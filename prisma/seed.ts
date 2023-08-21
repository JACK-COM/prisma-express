/**
 * @description Seed data into the database. Uncomment and modify the
 * code below if needed: otherwise you can safely ignore
 */

import { PrismaClient /* , Prisma */ } from "@prisma/client";
import { DateTime } from "luxon";
const prisma = new PrismaClient();

/** Create admin users (or other initial data). */
async function createAdmins() {
  const now = DateTime.now().toJSDate();
  /*   const you: Prisma.UserUpsertArgs['create'] = {
    email: 'you@your-email.app',
    authSource: 'other',
    password: 'password',
    created: now,
  }
  await Promise.all([
    prisma.user.upsert({
      where: { email: you.email },
      update: you,
      create: you,
    }),
  ])
  console.log('Added admin', { you }) */
  console.log("Added admins! (Not really)", now);
  return Promise.resolve();
}

createAdmins()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
