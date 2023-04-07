import { objectType } from "nexus";

/** All `Character` fields we want to expose via GraphQL */
export const MFCharacter = objectType({
  name: "MFCharacter",
  description: "A significant actor in a `World`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.int("authorId", { description: "Author owner" });
    t.int("groupId", { description: "`Group` identifier id (optional)" });
    t.int("locationId", { description: "Character's `Location` id" });
    t.nonNull.int("worldId", { description: "Character's `World` id" });

    // List properties: uncomment if we want to auto-expose these fields
    t.nonNull.list.field("CharacterRelationship", {
      type: "MFCharacterRelationship"
    });
  }
});
