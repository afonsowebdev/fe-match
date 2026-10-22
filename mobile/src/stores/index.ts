import { activityStore, refreshDaily } from './activity';
import { meStore } from './me';
import { preferencesStore } from './preferences';
import { sessionStore } from './session';

// Carrega do telemóvel tudo o que foi guardado. Chamado uma vez, no ecrã de abertura.
export async function hydrateStores() {
  await Promise.all([
    sessionStore.hydrate(),
    meStore.hydrate(),
    preferencesStore.hydrate(),
    activityStore.hydrate(),
  ]);
  refreshDaily();
}
