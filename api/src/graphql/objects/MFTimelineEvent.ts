import { objectType } from "nexus";

/** All `Timeline` fields we want to expose via GraphQL */
export const MFTimelineEvent = objectType({
  name: "MFTimelineEvent",
  description: "A linear `Event`-to-`Timeline` relationship",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.int("authorId", { description: "Timeline Author" });
    t.nonNull.int("eventId", { description: "Target `Event` id" });
    t.nonNull.int("timelineId", { description: "Target `Timeline` id" });

    // relationships
    t.field("Event", { type: "MFEvent" });

    // List properties
    t.list.field("Scenes", { type: "MFScene" });
  }
});
