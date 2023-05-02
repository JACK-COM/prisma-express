import { objectType } from "nexus";

/** All `MFUser` fields we want to expose as an Author via GraphQL */
export const MFAuthor = objectType({
  name: "MFAuthor",
  description: "An abbreviated `MFUser` model",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("displayName");
    t.nonNull.string("email");
    t.string("image");
    t.field("role", { type: "UserRole" });
    t.string("firstName");
    t.string("lastName");

    t.list.field("Series", { type: "MFSeries" });
    t.list.field("Books", { type: "MFBook" });
    t.list.field("Timelines", { type: "MFTimeline" });
    t.list.field("Worlds", { type: "MFWorld" });
  }
});
