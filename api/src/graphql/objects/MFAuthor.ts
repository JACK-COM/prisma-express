import { objectType } from "nexus";

/** All `MFUser` fields we want to expose as an Author via GraphQL */
export const MFAuthor = objectType({
  name: "MFAuthor",
  description: "An abbreviated `MFUser` model",
  definition(t) {
    t.nonNull.string("displayName");
  }
});
