/**
 * @module Objects
 *
 * Export all `enums` and custom graphql objects from this directory
 */

import { readdirSync } from "fs";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// export everything from the `queries` directory using fs
const files = readdirSync(path.dirname(__filename));
const exports = {};
files.forEach((file) => {
  if (file === "index.ts") return;
  let query = import(`./${file}`);
  exports[file.split(".")[0]] = query;
});

export default exports;
