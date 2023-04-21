import { objectType } from "nexus";

/** All `PopulationGroup` fields we want to expose via GraphQL */
export const MFPopulationGroup = objectType({
  name: "MFPopulationGroup",
  description: "A collection of `Characters` (e.g. profession or religion)",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.field("type", { type: "GroupType", description: "Group type" });
    t.int("authorId", { description: "Group Author" });
    t.int("locationId", { description: "`PopulationGroup`'s location id" });
    t.nonNull.int("worldId", { description: "`PopulationGroup`'s World id" });

    // List properties
    t.list.field("Character", { type: "MFCharacter" });
    t.list.field("Event", { type: "MFEvent" });
  }
});
