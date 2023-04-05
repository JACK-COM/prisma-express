import createState from "@jackcom/raphsducks";
import { UserRole, NullableString } from "utils/types";

/**
 * Your global application state `instance`. Every property in `initialState`
 * will become a method the state `instance`, so e.g. to update `appsCount`, you
 * call `store.appsCount( number )`. You can create as many state instances as
 * you need.
 */
export const User = createState({
  authenticated: false,
  initialized: false,
  loading: false,
  id: -1 as number,
  email: null as NullableString,
  error: null as NullableString,
  role: "researcher" as UserRole,
  lastSeen: ""
});

export type GlobalStore = ReturnType<typeof User.getState>;
export type GlobalStoreKey = keyof GlobalStore;
