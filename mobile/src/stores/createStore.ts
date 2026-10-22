import AsyncStorage from '@react-native-async-storage/async-storage';

// Estado global mínimo (sem bibliotecas): um valor, quem está à escuta e uma forma
// de o alterar. Usar com useSyncExternalStore(store.subscribe, store.get).
// Com `persistKey`, o estado fica guardado no telemóvel e é recuperado com hydrate().
export function createStore<T extends object>(initial: T, persistKey?: string) {
  let state = initial;
  const listeners = new Set<() => void>();

  function replace(next: T) {
    state = next;
    listeners.forEach((listener) => listener());
    if (persistKey) {
      // Se não der para gravar, o app continua a funcionar só em memória.
      AsyncStorage.setItem(persistKey, JSON.stringify(state)).catch(() => {});
    }
  }

  return {
    get: () => state,
    set: (patch: Partial<T>) => replace({ ...state, ...patch }),
    reset: (patch: Partial<T> = {}) => replace({ ...initial, ...patch }),
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    hydrate: async () => {
      if (!persistKey) return;
      try {
        const saved = await AsyncStorage.getItem(persistKey);
        if (saved) {
          // Junta com o estado inicial para campos novos ganharem o valor por omissão.
          state = { ...initial, ...JSON.parse(saved) };
          listeners.forEach((listener) => listener());
        }
      } catch {
        // Dados ilegíveis: começa do estado inicial.
      }
    },
  };
}
