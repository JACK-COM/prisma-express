/**
 * @module Utils
 * @description Export all utility functions and constants from here
 */
import { APP_VERSION, APP_VERSION_KEY } from "./constants";
import { UserRole, APIData } from "./types";

export * from "./constants";
export const noOp = () => undefined;

/** App Migration helper: check if your app version has changed */
export async function checkVersionChanged() {
  const currentVersion = APP_VERSION;
  const lastVersion = localStorage.getItem(APP_VERSION_KEY);
  return currentVersion !== lastVersion;
}

/** Merge two arrays of `APIData` data, preferring the second */
export function mergeLists<T extends APIData<any>>(a: T[], b: T[]): T[] {
  if (!a.length) return [...b];
  const next = [...a];
  b.forEach((item: any) => {
    const x = next.findIndex((l: any) => l.id === item.id);
    if (x > -1) next[x] = item;
    else next.push(item);
  });

  return next as T[];
}

/**
 * Require a mouse-event handler to be called by `Authors` only
 * @param fn Mouse event handler or other function
 * @param permissions Current user's `role`
 * @param preventDefault Call `.preventDefault()` on the event unless this is explicitly `false`
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
export function suppressEvent(e?: React.MouseEvent | React.FormEvent) {
  if (!e?.preventDefault) return;
  e.preventDefault();
  e.stopPropagation();
  if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
}

/** Shortens string to `XXXX...XXXX`; padding determined by optional `pad` parameter */
export function truncateString(str?: string | null, pad = 6): string {
  if (!str) return "";
  if (str.length <= pad) return str;
  const { length } = str;
  const start = str.substring(0, pad);
  return `${start}...${str.substring(length - pad, length)}`;
}
