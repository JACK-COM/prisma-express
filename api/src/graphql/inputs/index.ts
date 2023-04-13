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
    t.int("authorId", { description: "Item Author/owner" });
  }
});

/** Input fields for creating a `Character` */
export const MFCharacterUpsertInput = inputObjectType({
  name: "MFCharacterUpsertInput",
  definition(t) {
    t.int("id", { default: undefined, description: "Character ID" });
    t.nonNull.string("name");
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
    t.field("climate", { type: "Climate" });
    t.field("flora", { type: "Richness" });
    t.field("fauna", { type: "Richness" });
    t.nonNull.int("worldId", { description: "Parent world ID" });
    t.int("authorId", { description: "Item Author/owner" });
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
