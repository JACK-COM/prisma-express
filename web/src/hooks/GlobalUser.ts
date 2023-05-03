import { useEffect, useState } from "react";
import { GlobalUser, GlobalUserInstance, GlobalUserInstanceKey } from "state";

const defKeys = Object.keys(GlobalUser.getState()) as GlobalUserInstanceKey[];
type HookState<T extends GlobalUserInstanceKey[]> =
  | Omit<Partial<GlobalUserInstance>, "id"> & { id: number } & {
      [k in T[number]]: GlobalUserInstance[k];
    };

/**
 * Listen for specific `User` data from global state.
 * @returns User data
 */
export function useGlobalUser(keys = defKeys): HookState<typeof keys> {
  // Read global state and initialize the props you care about
  const global = GlobalUser.getState();
  const init = keys.reduce(
    (agg, k) => ({ ...agg, [k]: global[k] }),
    {} as HookState<typeof keys>
  );

  // Initialize internal state, and create a function that responds to
  // changes in global state
  const [state, setState] = useState(init);
  const onAppState = (s: Partial<GlobalUserInstance>) =>
    setState((prev) => ({ ...prev, ...s }));

  // Subscribe to global state: unsubscribe on component unmount
  useEffect(() => GlobalUser.subscribeToKeys(onAppState, keys), []);

  return Object.assign({}, state);
}
