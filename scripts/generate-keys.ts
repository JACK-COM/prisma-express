import { generateKey, randomBytes } from "crypto";

/**
 * Generate ENV encryption keys. Modify as needed
 */
generateKey("aes", { length: 256 }, (err, key) => {
  if (err) return console.error(err);
  const JWT_SEC = randomBytes(32).toString("hex");
  const ENCRYPT = key.export().toString("hex");

  console.clear();
  const output = `Update (or add) these values in your .env file:
  
    JWT_SEC="${JWT_SEC}"
    ENCRYPT="${ENCRYPT}"
  `;
  console.log(output);
  process.exit();
});

export {};
