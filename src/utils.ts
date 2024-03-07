import * as encrypt from "bcryptjs";

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

/**
 * Generate a unique slug from a string. Idempotent (same string in = same slug out).
 * Pass an `optionalSource` if `str` is a substring of a larger value, so that the slug
 * will always represent the full string.
 */
export function slugify(str: string, optionalSource?: string) {
  const slugged = str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
  const enc = encrypt.hash(optionalSource || str);
  let hex = Buffer.from(enc).toString("hex");
  const randlength = hex.length;
  hex = hex.slice(randlength - 12, randlength);
  return `${slugged.slice(0, 12)}-${hex}`;
}
