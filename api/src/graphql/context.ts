import { PrismaClient, User } from "@prisma/client";

/** This is the user object obtained by passport and injected into global graphql context */
export type CtxUser = Pick<User, "id" | "role" | "email" | "lastSeen">;

/**
 * `PrismaClient` instance with all tables. Contents will be determined
 * by what you put in the `schema.prisma` file
 */
const db = new PrismaClient();

/**
 * This interface defines a global context object. It is a good place to reference
 * all tables and/or any other static data you want to share globally with graphql.
 */
export interface DBContext {
  /** Authenticated user, if present. Injected in `server.ts` */
  user?: CtxUser;

  // TABLES

  /** `Users` table */
  Users: PrismaClient["user"];
  /** `Books` table */
  Books: PrismaClient["book"];
  /** `Chapters` table */
  Chapters: PrismaClient["chapter"];
  /** `Characters` table */
  Characters: PrismaClient["character"];
  /** `Character Relationships` table */
  CharacterRelationships: PrismaClient["characterRelationship"];
  /** `Content Link` table */
  ContentLinks: PrismaClient["sceneContentLink"];
  /** `Events` table */
  Events: PrismaClient["event"];
  /** `Explorations` table */
  Explorations: PrismaClient["exploration"];
  ExplorationScenes: PrismaClient["explorationScene"];
  /** `Library` table */
  Libraries: PrismaClient["library"];
  /** `Locations` table */
  Locations: PrismaClient["location"];
  /** `Population Groups` table */
  PopulationGroups: PrismaClient["populationGroup"];
  /** `Scenes` table */
  Scenes: PrismaClient["scene"];
  /** `Series` table */
  Series: PrismaClient["series"];
  /** `Timelines` table */
  Timelines: PrismaClient["timeline"];
  /** `Timeline Events` table */
  TimelineEvents: PrismaClient["timelineEvent"];
  /** `Worlds` table */
  Worlds: PrismaClient["world"];
}

/**
 * This is a handy reference to all `Table` objects (via `Prisma`). It
 * can be accessed in the `resolve` field of all `NexusJS` objects, so
 * it is a good place to put anything you want to get on that level (e.g.
 * session validation stuff).
 *
 * `context` adheres to `DBContext`
 */
export const context: DBContext = {
  Users: db.user,
  Books: db.book,
  Chapters: db.chapter,
  Characters: db.character,
  CharacterRelationships: db.characterRelationship,
  ContentLinks: db.sceneContentLink,
  Events: db.event,
  Explorations: db.exploration,
  ExplorationScenes: db.explorationScene,
  Libraries: db.library,
  Locations: db.location,
  PopulationGroups: db.populationGroup,
  Scenes: db.scene,
  Series: db.series,
  Timelines: db.timeline,
  TimelineEvents: db.timelineEvent,
  Worlds: db.world
};
