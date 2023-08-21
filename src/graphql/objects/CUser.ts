/**
 * @api {object} CUser CUser
 * @Module Objects.CUser
 * @description
 * Custom GraphQL object for `User` data
 */

import { objectType } from "nexus";

export const CsUser = objectType({
  name: "CsUser",
  description: "Custom User object",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("email");
    t.string("displayName");
    t.string("firstName");
    t.string("lastName");
    t.nonNull.field("createdAt", { type: "CsDateTime" });
    t.nonNull.field("updatedAt", { type: "CsDateTime" });
  }
});
