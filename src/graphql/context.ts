import { PrismaClient, User } from "@prisma/client";

/**
 * This is the user object obtained by passport and injected into global
 * graphql context. It is attached in `server.ts` and can be accessed
 * in any resolver via `ctx.user`
 */
export type CtxUser = Pick<User, "id" | "displayName" | "email">;

/**
 * `PrismaClient` instance with all tables. Contents will be determined
 * by what you put in the `schema.prisma` file
 */
const db = new PrismaClient();

/**
 * This interface defines a global context object. It is a good place
 * to reference all your tables, and/or any other properties you want to
 * globally access. Once you have generated your `PrismaClient`, fill it
 * out and use it to populate the `context` object below
 */
export interface DBContext {
  /** Authenticated user, if present. Injected in `server.ts` */
  user?: CtxUser;
  Users: PrismaClient["user"]; // example
}

/**
 * This is a handy reference to all `Table` objects (via `Prisma`). It
 * can be accessed in the `resolve` field of all `NexusJS` objects, so
 * it is a good place to put anything you want to get on that level (e.g.
 * session validation stuff).
 *
 * `context` adheres to whatever
 */
export const context: DBContext = {
  Users: db.user
};
