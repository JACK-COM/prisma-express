import { useEffect, useMemo, useState } from "react";
import {
  GlobalWorld,
  GlobalWorldInstance,
  GlobalWorldInstanceKey,
  getByIdFromWorldState,
  updateWorldStateList
} from "state";
import { APIData, World, Timeline } from "utils/types";
import { useParams } from "react-router";
import { loadCharacters, loadTimelines, loadWorld } from "api/loadUserData";

type HookState = Partial<GlobalWorldInstance>;
type LocationParams = { worldId: string; locationId: string };

/** Reusable subscription to `World` state  */
export function useGlobalWorld(
  keys: GlobalWorldInstanceKey[] = ["focusedWorld", "worlds"]
) {
  const gState = GlobalWorld.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const [state, setState] = useState<HookState>(init);
  const onWorld = (s: HookState) => setState((prev) => ({ ...prev, ...s }));
  const { worldId: w, locationId: l } = useParams<LocationParams>();
  const safe = (v?: string) => (v ? Number(v) : undefined);
  const [worldId, locationId] = useMemo(() => [safe(w), safe(l)], [w, l]);
  const loadComponentData = async () => {
    if (!worldId) return;
    await Promise.all([
      loadWorld({ worldId, locationId }),
      loadTimelines({ worldId }),
      loadCharacters({ worldId })
    ]);
  };

  useEffect(() => {
    loadComponentData();
    return GlobalWorld.subscribeToKeys(onWorld, keys);
  }, [worldId]);

  return {
    ...state,

    // Helpers
    getWorld: (id: number) =>
      getByIdFromWorldState(id, "worlds") as APIData<World>,
    updateTimelines: (t: APIData<Timeline>[]) =>
      updateWorldStateList(t, "timelines")
  };
}
