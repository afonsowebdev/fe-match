import * as Crypto from 'expo-crypto';
import { useSyncExternalStore } from 'react';

import { activityStore } from './activity';
import { createStore } from './createStore';
import { meStore, resetMe } from './me';

// Conta e sessão.
// TEMPORÁRIO: a conta fica guardada só neste telemóvel (uma conta por aparelho).
// Quando houver API, o registo e o login passam a ser feitos no servidor.

type Account = {
  name: string;
  email: string;
  birthDate: string;
  // Nunca se guarda a palavra-passe, só um hash dela.
  passwordHash: string;
};

const store = createStore<{ account: Account | null; signedIn: boolean }>(
  { account: null, signedIn: false },
  'fematch.session',
);

export const sessionStore = store;

export function useSession() {
  return useSyncExternalStore(store.subscribe, store.get);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(email: string, password: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${normalizeEmail(email)}:${password}`,
  );
}

export async function signUp(data: {
  name: string;
  email: string;
  birthDate: string;
  password: string;
}) {
  const passwordHash = await hashPassword(data.email, data.password);
  store.set({
    account: {
      name: data.name.trim(),
      email: normalizeEmail(data.email),
      birthDate: data.birthDate,
      passwordHash,
    },
    signedIn: true,
  });
  // Conta nova começa com perfil e atividade limpos.
  resetMe(data.name.trim(), data.birthDate);
  activityStore.reset();
}

// Conta de demonstração, com o perfil já preenchido, para testar o app sem registo.
export const DEMO_EMAIL = 'demo@fematch.pt';
export const DEMO_PASSWORD = 'demo1234';

export async function signInAsDemo() {
  await signUp({
    name: 'Francisco',
    email: DEMO_EMAIL,
    birthDate: '1998-05-20',
    password: DEMO_PASSWORD,
  });
  meStore.set({
    photos: [0, 1, 2].map((n) => `https://picsum.photos/seed/fematch-demo-${n}/600/900`),
    bio: 'Cristão, apaixonado por música e por servir na igreja. Procuro alguém para caminhar na fé.',
    fields: {
      city: 'Lisboa',
      church: 'Igreja da Graça, Lisboa',
      denomination: 'Evangélica',
      intention: 'Casamento',
      ministry: 'Louvor',
      height: '1,80 m',
      job: 'Engenheiro de software',
      education: 'Licenciatura',
      languages: 'Português',
    },
    topics: {
      'Sobre mim': 'Gosto de manhãs tranquilas com café e a Palavra.',
      'O meu testemunho': 'Conheci Jesus num acampamento de jovens aos 16 anos.',
    },
    interests: {
      'Interesse atual': 'Voluntariado, Louvor, Fotografia',
      'Versículo favorito': 'Salmos 46:10',
      'Louvor favorito': 'Oceans, Hillsong United',
    },
  });
}

export type SignInResult = 'ok' | 'no-account' | 'wrong-credentials';

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const { account } = store.get();
  // A conta demo funciona sempre, mesmo que ainda não exista neste telemóvel.
  if (
    normalizeEmail(email) === DEMO_EMAIL &&
    password === DEMO_PASSWORD &&
    account?.email !== DEMO_EMAIL
  ) {
    await signInAsDemo();
    return 'ok';
  }
  if (!account) return 'no-account';
  if (account.email !== normalizeEmail(email)) return 'wrong-credentials';
  if ((await hashPassword(email, password)) !== account.passwordHash) return 'wrong-credentials';
  store.set({ signedIn: true });
  return 'ok';
}

export function signOut() {
  store.set({ signedIn: false });
}
