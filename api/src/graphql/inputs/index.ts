/**
 * @module Inputs
 * Export all inputs for `mutations` and `queries` from here
 */

import { inputObjectType, nonNull } from "nexus";

/** Input fields for creating a `World` */
export const MFWorldUpsertInput = inputObjectType({
  name: "MFWorldUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "World ID" });
    t.boolean("public", {
      default: false,
      description: "Is this world public?"
    });
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.field("type", { type: "WorldType" });
    t.string("image");
    t.int("authorId", { description: "Item Author/owner" });
    t.int("parentWorldId", { description: "Parent world (optional)" });
  }
});

/** Input fields for creating a `Character` */
export const MFCharacterUpsertInput = inputObjectType({
  name: "MFCharacterUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Character ID" });
    t.nonNull.string("name");
    t.string("image");
    t.string("description", {
      default: "No description",
      description: "Character writing-prompts or bio"
    });
    t.nonNull.int("worldId", { description: "World ID" });
    t.int("authorId", { description: "Item Author/owner" });
    t.int("groupId", { description: "Character group/profession (OPTIONAL)" });
    t.int("locationId", { description: "Character location (OPTIONAL)" });
  }
});

/** Input fields for creating a `Character Relationship` */
export const MFRelationshipUpsertInput = inputObjectType({
  name: "MFRelationshipUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Relationship ID" });
    t.nonNull.int("characterId", { description: "Character ID" });
    t.nonNull.int("targetId", { description: "Target Character ID" });
    t.nonNull.string("relationship", { description: "Relationship notes" });
    t.int("authorId", { description: "Item Author/owner" });
  }
});

/** Input fields for creating a `Location` */
export const MFLocationUpsertInput = inputObjectType({
  name: "MFLocationUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Location ID" });
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.field("type", { type: "LocationType" });
    t.string("image");
    t.field("climate", { type: "Climate" });
    t.field("flora", { type: "Richness" });
    t.field("fauna", { type: "Richness" });
    t.int("northOf", { description: "Location north neighbor" });
    t.int("southOf", { description: "Location south neighbor" });
    t.int("eastOf", { description: "Location east neighbor" });
    t.int("westOf", { description: "Location west neighbor" });
    t.nonNull.int("worldId", { description: "Parent world ID" });
    t.int("authorId", { description: "Item Author/owner" });
    t.int("parentLocationId", { description: "Parent location (optional)" });
  }
});

/** Input fields for creating a World `Event` */
export const MFEventUpsertInput = inputObjectType({
  name: "MFEventUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Event ID" });
    t.nonNull.string("name");
    t.nonNull.int("worldId", { description: "Parent world ID" });
    t.nonNull.field("polarity", { type: "EventPolarity" });
    t.nonNull.field("target", { type: "EventTarget" });
    t.string("description", { default: "No description" });
    t.int("authorId", { description: "Item Author/owner" });
    t.int("characterId", { description: "Event character target (optional)" });
    t.int("groupId", { description: "Event group target (optional)" });
    t.int("locationId", { description: "Event location target (optional)" });
  }
});

/** Input fields for creating a `Timeline Event` (links an `Event` to a `Timeline`) */
export const MFTimelineEventUpsertInput = inputObjectType({
  name: "MFTimelineEventUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "TimelineEvent ID" });
    t.nonNull.int("order", { description: "Event order in timeline" });
    t.nonNull.int("eventId", { description: "Event ID" });
    t.nonNull.int("timelineId", { description: "Timeline ID" });
    t.int("authorId", { description: "Item Author/owner" });
  }
});

/** Input fields for creating a `Timeline` */
export const MFTimelineUpsertInput = inputObjectType({
  name: "MFTimelineUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Timeline ID" });
    t.nonNull.string("name");
    t.int("authorId", { description: "Item Author/owner" });
    t.nonNull.int("worldId", { description: "Parent world ID" });

    // World `Events` that will be created and linked for user
    t.list.field("events", { type: nonNull("MFTimelineEventUpsertInput") });
  }
});

/** Input fields for creating a `PopulationGroup` */
export const MFGroupUpsertInput = inputObjectType({
  name: "MFGroupUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Group ID" });
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.int("worldId", { description: "Parent world ID" });
    t.nonNull.field("type", { type: "GroupType" });
    t.int("authorId", { description: "Item Author/owner" });
  }
});

/** Input fields for creating a `Series` */
export const MFSeriesUpsertInput = inputObjectType({
  name: "MFSeriesUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Series ID" });
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("genre");
    t.string("image");
    t.int("authorId", { description: "Item Author/owner" });
    t.boolean("public", { default: false });
    t.float("price", { default: 0.0 });
    t.list.field("books", { type: nonNull("MFBookUpsertInput") });
  }
});

/** Input fields for creating a `Book` */
export const MFBookUpsertInput = inputObjectType({
  name: "MFBookUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Book ID" });
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("genre");
    t.string("image");
    t.int("order", { description: "Sequence in series (if part of one" });
    t.int("authorId", { description: "Item Author/owner" });
    t.int("seriesId", { description: "Parent Series" });
    t.int("locationId", { description: "Event location target (optional)" });
    t.int("worldId", { description: "Parent world ID" });
    t.boolean("public", { default: false });
    t.float("price", { default: 0.0 });
    t.list.field("chapters", { type: nonNull("MFChapterUpsertInput") });
  }
});

/** Input fields for creating a `Chapter` */
export const MFChapterUpsertInput = inputObjectType({
  name: "MFChapterUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Chapter ID" });
    t.nonNull.string("title");
    t.string("image");
    t.string("description");
    t.int("order", { description: "Sequence in book (if part of one" });
    t.int("authorId", { description: "Item Author/owner" });
    t.nonNull.int("bookId", { description: "Parent Book" });
    t.list.field("scenes", { type: nonNull("MFSceneUpsertInput") });
  }
});

/** Input fields for creating a `Scene` */
export const MFSceneUpsertInput = inputObjectType({
  name: "MFSceneUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Scene ID" });
    t.nonNull.string("title");
    t.string("description");
    t.string("image");
    t.nonNull.string("text");
    t.nonNull.int("order", {
      description: "Sequence in chapter (if part of one"
    });
    t.nonNull.int("chapterId", { description: "Parent Chapter" });
    t.int("authorId", { description: "Item Author/owner" });
    t.int("characterId", { description: "Scene primary character" });
    t.int("eventContextId", { description: "Scene event context" });
    t.int("timelineId", { description: "Scene event timeline" });
  }
});

/** User upsert input fields */
export const MFUserUpsertInput = inputObjectType({
  name: "MFUserUpsertInput",
  definition(t) {
    t.string("email");
    t.string("password");
    t.string("displayName");
    t.string("firstName");
    t.string("image");
    t.string("lastName");
  }
});

/** Input fields for creating a `ContentLink` */
export const MFContentLinkUpsertInput = inputObjectType({
  name: "MFContentLinkUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "ContentLink ID" });
    t.nonNull.string("text", { default: "Mystery Link" });
    t.nonNull.int("originId", { description: "Link's scene of origin" });
    t.int("seriesId");
    t.nonNull.int("bookId", { default: undefined });
    t.int("chapterId");
    t.int("sceneId");
    t.int("authorId", { description: "Item Author/owner" });
  }
});

/** Input fields for creating an `ExplorationScene` */
export const MFExplorationSceneUpsertInput = inputObjectType({
  name: "MFExplorationSceneUpsertInput",
  definition(t) {
    t.int("id");
    t.int("explorationId", { description: "Exploration target id" });
    t.nonNull.string("title");
    t.string("description");
    t.string("config", { description: "Scene config data (JSON string)" });
    t.int("authorId", { description: "Item Author/owner" });
    t.nonNull.int("order", { description: "Scene order in exploration" });
    t.string("background", { description: "Scene bg data" });
    t.string("foreground", { description: "Scene objects" });
    t.string("characters", { description: "Scene characters" });
  }
});

/** Input fields for creating an `Exploration` */
export const MFExplorationUpsertInput = inputObjectType({
  name: "MFExplorationUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Exploration ID" });
    t.nonNull.string("title");
    t.string("image");
    t.string("description");
    t.string("config", {
      description: "Exploration config data (JSON string)"
    });
    t.string("usesAttributes", {
      description: "Attributes used in exploration"
    });
    t.int("authorId", { description: "Item Author/owner" });
    t.nonNull.int("worldId", { description: "Parent world ID" });
    t.int("locationId", { description: "Location ID" });
    t.boolean("public", { default: false });
    t.float("price", { default: 0.0 });
    t.field("publishDate", { type: "CsDateTime" });
    t.list.field("Scenes", { type: nonNull("MFExplorationSceneUpsertInput") });
  }
});
