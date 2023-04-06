import { useEffect, useState } from "react";
import { GlobalUser, GlobalUserInstance, GlobalUserInstanceKey } from "state";

type HookState = Partial<GlobalUserInstance>;
const defKeys: GlobalUserInstanceKey[] = ["email", "role", "loading", "error"];

/**
 * Listen for specific `User` data from global state.
 * @returns User data
 */
export function useGlobalUser(keys: GlobalUserInstanceKey[] = defKeys) {
  // Read global state and initialize the props you care about
  const global = GlobalUser.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: global[k] }), {});

  // Initialize internal state, and create a function that responds to
  // changes in global state
  const [state, setState] = useState<HookState>(init);
  const onAppState = (s: Partial<GlobalUserInstance>) =>
    setState((prev) => ({ ...prev, ...s }));

  // Subscribe to global state: unsubscribe on component unmount
  useEffect(() => GlobalUser.subscribeToKeys(onAppState, keys), []);

  return Object.assign({}, state);
}
