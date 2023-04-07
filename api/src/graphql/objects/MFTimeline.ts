import { objectType } from "nexus";

/** All `Timeline` fields we want to expose via GraphQL */
export const MFTimeline = objectType({
  name: "MFTimeline",
  description: "A collection of Story `Scenes`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.int("authorId", { description: "Timeline Author" });
    t.nonNull.int("worldId", { description: "Timeline's `World` id" });

    // List properties
    t.nonNull.list.field("Scenes", { type: "MFScene" });
    // t.nonNull.list.field("TimelineEvents", { type: "MFTimelineEvents" });
  }
});
