import { objectType } from "nexus";

/** All `Event` fields we want to expose via GraphQL */
export const MFLocation = objectType({
  name: "MFLocation",
  description: "A fixed, recurring setting in a World. ",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.nonNull.field("type", { type: "LocationType" });
    t.int("parentLocationId", { description: "Parent Location" });
    t.field("climate", { type: "Climate" });
    t.field("fauna", { type: "Richness" });
    t.field("flora", { type: "Richness" });
    t.int("authorId", { description: "Event Author" });
    t.int("parentLocationId", { description: "Parent Location id (optional)" });
    t.nonNull.int("worldId", { description: "Event target `World`" });

    // Relationships
    t.field("World", { type: "MFWorld" });
    t.field("ParentLocation", {
      type: "MFLocation",
      resolve: ({ parentLocationId }, _args, { Locations }) =>
        parentLocationId
          ? Locations.findUnique({ where: { id: parentLocationId } })
          : null
    });

    // List properties
    t.list.field("Characters", { type: "MFCharacter" });
    t.list.field("Events", { type: "MFEvent" });
    t.list.field("Groups", { type: "MFPopulationGroup" });
    t.int("childLocationCount", {
      resolve: ({ id: parentLocationId }, _args, { Locations }) =>
        Locations.count({ where: { parentLocationId } })
    });
    t.list.field("ChildLocations", {
      type: "MFLocation",
      resolve: ({ id: parentLocationId }, _args, { Locations }) =>
        Locations.findMany({ where: { parentLocationId } })
    });
  }
});
