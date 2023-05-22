"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
/**
 * Generate ENV encryption keys. Modify as needed
 */
(0, crypto_1.generateKey)("aes", { length: 256 }, (err, key) => {
    if (err)
        return console.error(err);
    const JWT_SEC = (0, crypto_1.randomBytes)(32).toString("hex");
    const ENCRYPT = key.export().toString("hex");
    console.clear();
    console.log("Move these values to your .env file");
    console.log();
    console.log(`
    JWT_SEC="${JWT_SEC}"
    ENCRYPT="${ENCRYPT}"
  `);
    console.log();
    console.log("Kill the terminal process when done [ Ctrl + c ]");
});
//# sourceMappingURL=first-run.js.map