import { useSyncExternalStore } from 'react';

import { LIKES_YOU } from '@/mocks/profiles';

import { createStore } from './createStore';

// Tudo o que acontece no app: swipes, matches, conversas, Premium e contadores.
// TEMPORÁRIO: guardado só no telemóvel e com respostas simuladas dos perfis fictícios.

export type SwipeType = 'like' | 'pass' | 'superlike';

export type Message = {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: number;
};

type Activity = {
  swipes: Record<string, SwipeType>;
  // Ordem dos swipes, para o botão "Voltar atrás".
  history: string[];
  // id → quando foi o match
  matches: Record<string, number>;
  conversations: Record<string, Message[]>;
  unread: Record<string, number>;
  premium: boolean;
  premiumPlan: string | null;
  superLikes: number;
  boosts: number;
  boostUntil: number | null;
  // Dia (AAAA-MM-DD) em que os Super Gostos foram renovados pela última vez.
  dailyResetOn: string;
};

const BOOST_MINUTES = 30;
const FREE_SUPER_LIKES = 1;
const PREMIUM_SUPER_LIKES = 5;

const HOUR = 60 * 60 * 1000;
const now = Date.now();
const message = (from: Message['from'], text: string, at: number): Message => ({
  id: `${at}-${from}`,
  from,
  text,
  at,
});

// Para o app não começar vazio: dois matches com conversa e um match novo.
const INITIAL: Activity = {
  swipes: { mariana: 'like', sara: 'like', ines: 'like' },
  history: ['mariana', 'sara', 'ines'],
  matches: { mariana: now - 48 * HOUR, sara: now - 24 * HOUR, ines: now - 3 * HOUR },
  conversations: {
    mariana: [
      message('them', 'Olá! Vi que também gostas de fotografia 📷', now - 47 * HOUR),
      message('me', 'Olá Mariana! Sim, adoro. Que máquina usas?', now - 46 * HOUR),
      message('them', 'Também vais ao retiro de jovens no sábado?', now - 2 * HOUR),
    ],
    sara: [
      message('them', 'Olá! Que bom dar match contigo 😊', now - 23 * HOUR),
      message('me', 'Olá Sara! Igualmente. A semana correu bem, graças a Deus.', now - 22 * HOUR),
      message('them', 'Amém! Fico muito feliz por saber 🙏', now - 20 * HOUR),
    ],
  },
  unread: { mariana: 1 },
  premium: false,
  premiumPlan: null,
  superLikes: FREE_SUPER_LIKES,
  boosts: 0,
  boostUntil: null,
  dailyResetOn: '',
};

const store = createStore<Activity>(INITIAL, 'fematch.activity');

export const activityStore = store;

export function useActivity() {
  return useSyncExternalStore(store.subscribe, store.get);
}

// "A escrever…" das respostas simuladas. Não é guardado.
const typingStore = createStore<Record<string, boolean>>({});

export function useTyping(id: string) {
  return useSyncExternalStore(typingStore.subscribe, () => typingStore.get()[id] ?? false);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Renova os Super Gostos uma vez por dia. Chamar depois de carregar os dados.
export function refreshDaily() {
  const state = store.get();
  if (state.dailyResetOn === today()) return;
  store.set({
    dailyResetOn: today(),
    superLikes: Math.max(state.superLikes, state.premium ? PREMIUM_SUPER_LIKES : FREE_SUPER_LIKES),
  });
}

// Regista um swipe. Devolve true quando dá match.
export function swipe(id: string, type: SwipeType, firstMessage?: string) {
  const state = store.get();
  const matched = type !== 'pass' && LIKES_YOU.includes(id);
  const patch: Partial<Activity> = {
    swipes: { ...state.swipes, [id]: type },
    history: [...state.history, id],
  };
  if (type === 'superlike') patch.superLikes = Math.max(state.superLikes - 1, 0);
  if (matched) patch.matches = { ...state.matches, [id]: Date.now() };
  if (matched && firstMessage) {
    patch.conversations = {
      ...state.conversations,
      [id]: [message('me', firstMessage, Date.now())],
    };
  }
  store.set(patch);
  if (matched && firstMessage) scheduleReply(id);
  return matched;
}

// Desfaz o último swipe (e o match, se esse swipe deu match).
export function rewind() {
  const state = store.get();
  const id = state.history.at(-1);
  if (!id) return null;
  const { [id]: _swipe, ...swipes } = state.swipes;
  const { [id]: _match, ...matches } = state.matches;
  const { [id]: _conversation, ...conversations } = state.conversations;
  store.set({ swipes, matches, conversations, history: state.history.slice(0, -1) });
  return id;
}

// "Ver de novo": volta a mostrar os perfis a quem se deu "Passar".
export function resetPasses() {
  const state = store.get();
  const swipes = Object.fromEntries(
    Object.entries(state.swipes).filter(([, type]) => type !== 'pass'),
  );
  store.set({ swipes, history: state.history.filter((id) => id in swipes) });
}

export function unmatch(id: string) {
  const state = store.get();
  const { [id]: _match, ...matches } = state.matches;
  const { [id]: _conversation, ...conversations } = state.conversations;
  const { [id]: _unread, ...unread } = state.unread;
  // O swipe fica registado, para a pessoa não voltar a aparecer.
  store.set({ matches, conversations, unread });
}

export function markRead(id: string) {
  const { unread } = store.get();
  if (!unread[id]) return;
  store.set({ unread: { ...unread, [id]: 0 } });
}

const REPLIES = [
  'Que bom! 😊',
  'Amém! 🙏',
  'Concordo totalmente.',
  'Haha, também acho!',
  'Conta-me mais sobre isso.',
  'Que Deus te abençoe! ✨',
  'E tu, em que igreja andas?',
  'Podíamos combinar um café depois do culto ☕',
  'Isso é mesmo importante para mim também.',
];

// Resposta simulada da outra pessoa, ao fim de alguns segundos.
function scheduleReply(id: string) {
  typingStore.set({ [id]: true });
  const delay = 1500 + Math.random() * 2000;
  setTimeout(() => {
    typingStore.set({ [id]: false });
    const state = store.get();
    if (!state.matches[id]) return;
    const text = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    store.set({
      conversations: {
        ...state.conversations,
        [id]: [...(state.conversations[id] ?? []), message('them', text, Date.now())],
      },
      unread: { ...state.unread, [id]: (state.unread[id] ?? 0) + 1 },
    });
  }, delay);
}

export function sendMessage(id: string, text: string) {
  const state = store.get();
  store.set({
    conversations: {
      ...state.conversations,
      [id]: [...(state.conversations[id] ?? []), message('me', text, Date.now())],
    },
  });
  scheduleReply(id);
}

// TEMPORÁRIO: sem pagamentos reais (modo de teste).
export function activatePremium(plan: string) {
  const state = store.get();
  store.set({
    premium: true,
    premiumPlan: plan,
    superLikes: Math.max(state.superLikes, PREMIUM_SUPER_LIKES),
    boosts: state.boosts + 1,
  });
}

export function cancelPremium() {
  store.set({ premium: false, premiumPlan: null });
}

// Ativa um Destaque. Devolve false se não houver nenhum disponível.
export function startBoost() {
  const state = store.get();
  if (state.boosts <= 0) return false;
  store.set({ boosts: state.boosts - 1, boostUntil: Date.now() + BOOST_MINUTES * 60 * 1000 });
  return true;
}

// Pessoas que gostaram de ti e ainda não viste.
export function pendingLikes(state: Activity) {
  return LIKES_YOU.filter((id) => !state.swipes[id]);
}
