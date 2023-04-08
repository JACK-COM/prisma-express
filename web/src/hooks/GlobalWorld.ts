import { useEffect, useState } from "react";
import {
  GlobalWorld,
  GlobalWorldInstance,
  GlobalWorldInstanceKey,
  clearGlobalWorld,
  setGlobalWorld,
  setGlobalWorlds,
  updateWorlds
} from "state";

type HookState = Partial<GlobalWorldInstance>;

/** Reusable subscription to `World` state  */
export function useGlobalWorld(
  keys: GlobalWorldInstanceKey[] = ["selectedWorld", "worlds"]
) {
  const gState = GlobalWorld.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const [state, setState] = useState<HookState>(init);
  const onWorld = (s: HookState) => setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalWorld.subscribeToKeys(onWorld, keys), []);

  return {
    ...state,

    // Helpers
    clearGlobalWorld,
    setGlobalWorld,
    setGlobalWorlds,
    updateWorlds
  };
}
