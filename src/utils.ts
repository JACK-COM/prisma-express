/** strip all characters from a filename */
export function stripSpecialCharacters(st: string) {
  const strip = /[^a-zA-Z0-9_.]/g;
  return st.replace(strip, "_");
}

/** Capitalize first letter of string */
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Assert a value is truthy */
export function truthy(p: any) {
  return !falsy(p);
}

/** Assert a value is falsy */
export function falsy(x: any) {
  const _falsey = new Set([false, 0, "", null, undefined, NaN]);
  return _falsey.has(x);
}

/** Convert a possibly undefined number into a 0 */
export function safeNum(v: any) {
  return falsy(v) ? 0 : Number(v);
}

/** Convert a possibly undefined string into an empty string */
export function safeStr(v: any) {
  return falsy(v) ? "" : String(v);
}
