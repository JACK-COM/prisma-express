import { PrismaClient, User } from "@prisma/client";

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
  /** `Events` table */
  Events: PrismaClient["event"];
  /** `Locations` table */
  Locations: PrismaClient["location"];
  /** `Paragraphs` table */
  Paragraphs: PrismaClient["paragraph"];
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
  Events: db.event,
  Locations: db.location,
  Paragraphs: db.paragraph,
  PopulationGroups: db.populationGroup,
  Scenes: db.scene,
  Series: db.series,
  Timelines: db.timeline,
  TimelineEvents: db.timelineEvent,
  Worlds: db.world
};