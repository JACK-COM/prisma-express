/**
 * @module Inputs
 * Export all inputs for `mutations` and `queries` from here
 */

import { inputObjectType } from "nexus";

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
