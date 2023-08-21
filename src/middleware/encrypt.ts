import crypto from "crypto-js";
import { hash, verify } from "argon2";
import { ENCRYPT_SECRET } from "../constants";

type CryptoOpts = { algo?: "AES" | "Argon2"; text: string };

/** @middleware Exposes the Argon2 "Verify" function */
export const argon2Verify = verify;

/** @middleware Encrypt a raw string using argon2 */
export async function encrypt(text: string) {
  return hash(text); // argon2
}

/** @middleware Decrypt an encrypted string (AES encryption only) */
export async function decrypt(opts: CryptoOpts) {
  const sx = ENCRYPT_SECRET;
  const { algo = "Argon2", text } = opts;
  if (algo === "AES")
    return crypto.AES.decrypt(text, sx).toString(crypto.enc.Utf8);
  // This should NOT be getting used under any circumstances
  throw new Error("Attempt to decrypt Argon2 hash");
}
