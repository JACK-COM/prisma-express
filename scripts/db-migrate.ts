/**
 * @file db-migrate.ts
 * @description Database migration script. Created by CBlodgett.
 * This script is used to create a squashed migration and deploy it to the database.
 * It allows your prisma schema to grow while limiting the corresponding number of migration scripts.
 */
import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";
import { uuidv7 } from "uuidv7";

const migrationsPath = join(__dirname, "../prisma/migrations");
const squashedMigrations = `${migrationsPath}/000000000000_squashed_migrations`;
const squashedDiff = `${migrationsPath}/${uuidv7()}_squashed_diff`;
const shortDBUrl = process.env.DB_URL?.split("?")[0];

function makeSquashedMigration() {
  if (!shortDBUrl) return void console.log("Error: Missing database URL");

  fs.mkdirSync(squashedMigrations, { recursive: true });
  const squashedMigration = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script"
  );
  fs.writeFileSync(`${squashedMigrations}/migration.sql`, squashedMigration);
  // console.log(squashedMigration.toString());
  const prismaOut = execSync(
    `npx prisma migrate resolve --applied ${squashedMigrations}`
  );
  console.log(prismaOut.toString());
}

async function makeSquashedDiff() {
  if (!shortDBUrl) return void console.log("Error: Missing database URL");

  fs.mkdirSync(squashedDiff, { recursive: true });
  const squashedDiffMigration = execSync(
    `npx prisma migrate diff --from-url ${shortDBUrl} --to-schema-datamodel ./prisma/schema.prisma --script`
  );
  fs.writeFileSync(`${squashedDiff}/migration.sql`, squashedDiffMigration);
  console.log("squashedDiffMigration: ");
  console.log(squashedDiffMigration.toString());
}

function clearPastMigrations() {
  if (!shortDBUrl) return void console.log("Error: Missing database URL");

  fs.rmSync(migrationsPath, { recursive: true, force: true });
}

function generateClient() {
  if (!shortDBUrl) return void console.log("Error: Missing database URL");

  const prismaOut = execSync("npx prisma generate");
  console.log(prismaOut.toString());
}

function deployMigration() {
  if (!shortDBUrl) return void console.log("Error: Missing database URL");

  const prismaOut = execSync("npx prisma migrate deploy");
  console.log(prismaOut.toString());
}

async function main() {
  if (!shortDBUrl) return void console.log("Error: Missing database URL");

  generateClient();
  clearPastMigrations();
  makeSquashedMigration();
  makeSquashedDiff();
  deployMigration();
}

main().catch((e) => {
  console.error(e);
});
