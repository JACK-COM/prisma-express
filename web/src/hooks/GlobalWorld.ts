import { useEffect, useState } from "react";
import { listWorlds } from "graphql/requests/worlds.graphql";
import {
  GlobalWorld,
  GlobalWorldInstance,
  GlobalWorldInstanceKey,
  clearGlobalWorld,
  getByIdFromWorldState,
  setGlobalTimeline,
  setGlobalLocation,
  setGlobalWorld,
  setWorldStateList,
  updateLocations,
  updateWorlds,
  updateWorldStateList
} from "state";
import { APIData, World, Location, Timeline } from "utils/types";
import {
  listTimelines,
  listWorldEvents
} from "graphql/requests/timelines.graphql";
import { useParams } from "react-router";

type HookState = Partial<GlobalWorldInstance>;

// Return a list if it's already loaded, otherwise load it
const listOrLoad = (list: any[], req: () => any) =>
  list.length > 1 ? list : req();

// Additonal instructions for focusing data in the global state
type HOOK__LoadWorldOpts = {
  userId: number;
  timelineId?: number;
  locationId?: number;
  worldId?: number;
  groupId?: number;
};

/** Reusable subscription to `World` state  */
export function useGlobalWorld(
  keys: GlobalWorldInstanceKey[] = ["focusedWorld", "worlds"]
) {
  const gState = GlobalWorld.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const { timelineId } = useParams<{ timelineId: string }>();
  const [state, setState] = useState<HookState>(init);
  const onWorld = (s: HookState) => setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalWorld.subscribeToKeys(onWorld, keys), []);

  return {
    ...state,

    // Helpers
    clearGlobalWorld,
    loadWorlds,
    getWorld: (id: number) => getByIdFromWorldState(id, "worlds"),
    setGlobalLocation,
    setGlobalWorld,
    setGlobalTimeline,
    setGlobalTimelines: (t: APIData<Timeline>[]) =>
      setWorldStateList(t, "timelines", { focusedTimeline: null }),
    setGlobalWorlds: (w: APIData<World>[]) =>
      setWorldStateList(w, "worlds", { focusedWorld: null }),
    setGlobalLocations: (l: APIData<Location>[]) =>
      setWorldStateList(l, "worldLocations", { focusedLocation: null }),
    updateLocations,
    updateTimelines: (t: APIData<Timeline>[]) =>
      updateWorldStateList(t, "timelines"),
    updateEvents: (t: APIData<Timeline>[]) => updateWorldStateList(t, "events"),
    updateWorlds
  };
}

const defaultLoadOpts: HOOK__LoadWorldOpts = { userId: -1 };

// Shared function to load timelines and worlds
async function loadWorlds(opts = defaultLoadOpts) {
  const gState = GlobalWorld.getState();
  const { worldId, userId, timelineId } = opts;
  const params: any = userId >= 0 ? { authorId: userId } : { public: true };
  if (worldId) params.worldId = worldId;
  const [apiTimelines, apiWorlds, apiEvents] = await Promise.all([
    worldId ? listTimelines(params) : [],
    listOrLoad(gState.worlds, () => listWorlds(params)),
    listOrLoad(gState.events, () => listWorldEvents({ authorId: userId })),
  ]);

  const timeline = apiTimelines.find((t: any) => t.id === Number(timelineId));
  const world = timeline?.World || apiWorlds.find((t: any) => t.id === worldId);

  GlobalWorld.multiple({
    timelines: apiTimelines,
    worlds: apiWorlds,
    events: apiEvents,
    // focused data
    focusedTimeline: timeline || null,
    focusedWorld: world || null,
    worldLocations: world?.Locations || [],
  });
}
