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
 * Require a mouse-event handler to be called by `Authors` only
 * @param fn Mouse event handler or other function
 * @param permissions Current user's `role`
 * @returns Function if user is author; undefined if not
 */
export function requireAuthor(
  fn: React.MouseEventHandler,
  permissions: UserRole = "Reader",
  preventDefault?: boolean
): typeof fn | undefined {
  if (permissions !== "Author") return undefined;
  return preventDefault === false
    ? fn
    : (e) => {
        suppressEvent(e);
        fn(e);
      };
}

/**
 * Stop propagation and prevent default on a mouse event
 * @param e React mouse event
 */
export function suppressEvent(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}
