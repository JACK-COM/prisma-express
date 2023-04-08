/**
 * @module Inputs
 *
 * Define inputs for `mutations` and `queries` in this directory
 */

import { inputObjectType } from "nexus";

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
    t.int("authorId", { description: "Book Author/owner" });
  }
});
