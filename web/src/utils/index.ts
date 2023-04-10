import { APP_VERSION, APP_VERSION_KEY } from "./constants";
import { UserRole } from "./types";

export * from "./constants";
export const noOp = () => undefined;

/** App Migration helper: check if your app version has changed */
export async function checkVersionChanged() {
  const currentVersion = APP_VERSION;
  const lastVersion = localStorage.getItem(APP_VERSION_KEY);
  return currentVersion !== lastVersion;
}

/**
 * Protect a mouse-event handler from being called by non-authors
 * @param fn Mouse event handler or other function
 * @param permissions Current user permissions
 * @returns Function if user is author; undefined if not
 */
export function guard(
  fn: React.MouseEventHandler,
  permissions: UserRole = "Reader",
): typeof fn | undefined {
  if (permissions !== "Author") return undefined;
  return (e) => {
    e.stopPropagation();
    fn(e);
  };
}
