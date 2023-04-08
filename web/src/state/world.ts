import createState from "@jackcom/raphsducks";
import { APIData, Location, World } from "utils/types";

/* Convenience */
type APIWorld = APIData<World>;
type APILocation = APIData<Location>;
/* Convenience */

/** Any global state relating to worlds fetched/viewed by the user */
export const GlobalWorld = createState({
  /** Currently-focused `location` in application */
  selectedLocation: null as APILocation | null,
  /** Currently-focused `world` in application */
  selectedWorld: null as APIWorld | null,
  /** List of focused world's `locations` */
  worldLocations: [] as APILocation[],
  /** List of user (or public) worlds */
  worlds: [] as APIWorld[]
});

export type GlobalWorldInstance = ReturnType<typeof GlobalWorld.getState>;
export type GlobalWorldInstanceKey = keyof GlobalWorldInstance;

/** @helper Select a `Location` */
export const setGlobalLocation = (l: APILocation | null) =>
  GlobalWorld.selectedLocation(l);

/** @helper Select a `World` */
export const setGlobalWorld = (w: APIWorld | null) =>
  GlobalWorld.selectedWorld(w);

/** @helper Set a list of `Worlds` */
export const setGlobalWorlds = (w: APIWorld[]) => GlobalWorld.worlds(w);

/**
 * Update list of worlds in state
 * @param newWorlds New worlds
 */
export function updateWorlds(newWorlds: APIWorld[]) {
  const { worlds } = GlobalWorld.getState();
  const next: APIWorld[] = [...worlds];
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
