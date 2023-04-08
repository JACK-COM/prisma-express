import createState from "@jackcom/raphsducks";
import { APIData, World } from "utils/types";

/** Any global state relating to worlds fetched/viewed by the user */
export const GlobalWorld = createState({
  selectedWorld: null as APIData<World> | null,
  worlds: [] as APIData<World>[]
});

export type GlobalWorldInstance = ReturnType<typeof GlobalWorld.getState>;
export type GlobalWorldInstanceKey = keyof GlobalWorldInstance;

export const setGlobalWorld = (w: APIData<World>) =>
  GlobalWorld.selectedWorld(w);
export const setGlobalWorlds = (w: APIData<World>[]) => GlobalWorld.worlds(w);

/**
 * Update list of worlds in state
 * @param newWorlds New worlds
 */
export function updateWorlds(newWorlds: APIData<World>[]) {
  const { worlds } = GlobalWorld.getState();
  const next: APIData<World>[] = [...worlds];
  newWorlds.forEach((w) => {
    const existing = worlds.findIndex((x) => x.id === w.id);
    if (existing > -1) next[existing] = { ...next[existing], ...w };
    else next.push(w);
  });

  GlobalWorld.worlds(next);
}

/**
 * Clear selected world
 * @param newWorlds New worlds
 */
export function clearGlobalWorld() {
  GlobalWorld.selectedWorld(null);
}
