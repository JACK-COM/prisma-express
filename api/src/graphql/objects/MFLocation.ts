import { objectType } from "nexus";

/** All `Event` fields we want to expose via GraphQL */
export const MFLocation = objectType({
  name: "MFLocation",
  description: "A fixed, recurring setting in a World. ",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.int("parentLocationId", { description: "Parent Location" });
    t.nonNull.field("climate", { type: "Climate" });
    t.nonNull.field("fauna", { type: "Richness" });
    t.nonNull.field("flora", { type: "Richness" });
    t.int("authorId", { description: "Event Author" });
    t.nonNull.int("worldId", { description: "Event target `World`" });
    // List properties: uncomment if we want to auto-expose these fields
    t.list.field("Characters", { type: "MFCharacter" });
    t.list.field("Events", { type: "MFEvent" });
    t.list.field("Groups", { type: "MFPopulationGroup" });
    t.list.field("Scenes", { type: "MFScene" });
    t.list.field("World", { type: "MFWorld" });
  }
});
