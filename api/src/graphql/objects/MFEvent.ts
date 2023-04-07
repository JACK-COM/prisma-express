import { objectType } from "nexus";

/** All `Event` fields we want to expose via GraphQL */
export const MFEvent = objectType({
  name: "MFEvent",
  description:
    "A significant occurrence in a World or other location that acts as a story catalyst. ",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.field("target", { type: "EventTarget" });
    t.nonNull.field("polarity", { type: "EventPolarity" });
    t.int("authorId", { description: "Event Author" });
    t.int("characterId", { description: "`Character` target (optional)" });
    t.int("groupId", { description: "`Group` target (optional)" });
    t.int("locationId", { description: "`Location` target (optional)" });
    t.nonNull.int("worldId", { description: "Event target `World`" });
  }
});
