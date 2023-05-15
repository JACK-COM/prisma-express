/**
 * @module Objects
 *
 * Export all `enums` and custom graphql objects from this directory
 */

import { readdirSync } from "fs";

// export everything from the `queries` directory using fs
const files = readdirSync(__dirname);
files.forEach((file) => {
  if (file === "index.ts") return;
  const name = file.split(".")[0];
  const query = require(`./${file}`);
  exports[name] = query;
});
