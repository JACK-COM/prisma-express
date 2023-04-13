import { objectType } from "nexus";

/** All `Book` fields we want to expose via GraphQL */
export const MFWorld = objectType({
  name: "MFWorld",
  description: "A collection of `Locations`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.boolean("public");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.field("type", { type: "WorldType" });
    t.int("authorId", { description: "Book Author/owner" });

    // List properties 
    t.list.field("Locations", { type: "MFLocation" });
    t.list.field("Timelines", { type: "MFTimeline" });
    t.list.field("Events", { type: "MFEvent" });
    t.list.field("Groups", { type: "MFPopulationGroup" });
  }
});
