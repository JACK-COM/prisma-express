import { objectType } from "nexus";

/** All `Timeline` fields we want to expose via GraphQL */
export const MFTimeline = objectType({
  name: "MFTimeline",
  description: "A collection of Story `Scenes`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.int("authorId", { description: "Timeline Author" });
    t.nonNull.int("worldId", { description: "Timeline's `World` id" });

    // relationships
    t.field("World", { type: "MFWorld" });
    t.field("Author", { type: "MFAuthor" });

    // List properties
    t.list.field("Scenes", { type: "MFScene" });
    t.list.field("TimelineEvents", { type: "MFTimelineEvent" });
  }
});
