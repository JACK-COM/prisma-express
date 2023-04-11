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
  /** List of `selectedWorld`'s `locations` */
  worldLocations: [] as APILocation[],
  /** List of user (or public) worlds */
  worlds: [] as APIWorld[]
});

export type GlobalWorldInstance = ReturnType<typeof GlobalWorld.getState>;
export type GlobalWorldInstanceKey = keyof GlobalWorldInstance;
/** All lists in state */
export type GlobalWorldListKey = "worlds" | "worldLocations";

/** @helper Select a `Location` */
export const setGlobalLocation = (l: APILocation | null) =>
  GlobalWorld.selectedLocation(l);

/** @helper Select a `World`  */
export const setGlobalWorld = (w: APIWorld | null) => {
  GlobalWorld.selectedWorld(w);
};

/**
 * Retrieve a world from state
 * @param newWorlds New worlds
 */
export function getWorld(id: number) {
  const { worlds } = GlobalWorld.getState();
  const world = worlds.find((w) => w.id === id);
  return world || null;
}

/**
 * Update list of worlds in state
 * @param newWorlds New worlds
 */
export function updateWorlds(newWorlds: APIWorld[]) {
  const { selectedWorld } = GlobalWorld.getState();
  if (newWorlds.length !== 1 || !selectedWorld) {
    return updateWorldStateList(newWorlds, "worlds");
  }

  const worlds = updateWorldStateList(newWorlds, "worlds", true);
  GlobalWorld.multiple({ worlds, selectedWorld: newWorlds[0] });
}

/**
 * Update list of locations in state
 * @param newLocations New locations
 */
export function updateLocations(newLocations: APILocation[]) {
  const { selectedLocation } = GlobalWorld.getState();
  if (newLocations.length !== 1 || !selectedLocation) {
    return updateWorldStateList(newLocations, "worldLocations");
  }

  const worldLocations = updateWorldStateList(
    newLocations,
    "worldLocations",
    true
  );
  GlobalWorld.multiple({ worldLocations, selectedLocation: newLocations[0] });
}

/**
 * Remove world from list in from state
 * @param targetId Id of target object
 */
export function removeWorld(targetId: number) {
  return removeFromWorldsList(targetId, "worlds");
}

/**
 * Remove location from list in from state
 * @param targetId Id of target object
 */
export function removeLocation(targetId: number) {
  return removeFromWorldsList(targetId, "worldLocations");
}

/**
 * Update list-key in state
 * @param newItems New worlds
 */
export function updateWorldStateList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalWorldListKey,
  returnList = false
) {
  const state = GlobalWorld.getState();
  const old = state[key] as T;
  const next = [...old];
  newItems.forEach((w) => {
    const existing = old.findIndex((x) => x.id === w.id);
    if (existing > -1) next[existing] = { ...next[existing], ...w };
    else next.push(w);
  });

  if (returnList) return next;

  GlobalWorld[key](next);
}

/**
 * Overwrite a list-key in state
 * @param newItems New worlds
 */
export function setWorldStateList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalWorldListKey,
  additionalState?: Partial<GlobalWorldInstance>
) {
  GlobalWorld.multiple({ [key]: newItems, ...additionalState });
}

/**
 * Clear selected world
 * @param newWorlds New worlds
 */
export function clearGlobalWorld() {
  return GlobalWorld.multiple({
    selectedLocation: null,
    selectedWorld: null,
    worldLocations: []
  });
}

/**
 * Remove item from list in from state
 * @param targetId Id of target object
 */
function removeFromWorldsList(targetId: number, key: GlobalWorldListKey) {
  const state = GlobalWorld.getState();
  const old: any[] = state[key];
  const next = old.filter((x) => x.id !== targetId);

  GlobalWorld[key](next);
}
