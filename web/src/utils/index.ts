import { APP_VERSION, APP_VERSION_KEY } from "./constants";

export * from "./constants";
export const noOp = () => undefined;

/** App Migration helper: check if your app version has changed */
export async function checkVersionChanged() {
  const currentVersion = APP_VERSION;
  const lastVersion = localStorage.getItem(APP_VERSION_KEY);
  return currentVersion !== lastVersion;
}
