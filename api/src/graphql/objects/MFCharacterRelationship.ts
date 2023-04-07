import { objectType } from "nexus";

/** All `CharacterRelationship` fields we want to expose via GraphQL */
export const MFCharacterRelationship = objectType({
  name: "MFCharacterRelationship",
  description: "A linear relationship betwen actors in a `World`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("characterId");
    t.nonNull.int("targetId");
    t.nonNull.string("relationship");
  }
});
