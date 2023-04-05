const crypto = require("crypto-js"),
  password = process.env.ENCRYPT;

export function encrypt(text: string) {
  return crypto.AES.encrypt(text, password).toString();
}

export function decrypt(encr: string) {
  return crypto.AES.decrypt(encr, password).toString(crypto.enc.Utf8);
}
