import { objectType } from "nexus";

/** All `Chapter` fields we want to expose via GraphQL */
export const MFChapter = objectType({
  name: "MFChapter",
  description: "A collection of Story `Scenes`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.int("authorId", { description: "Author owner" });
    t.int("bookId", { description: "Chapter's Book id" });
    t.nonNull.field("created", { type: "CsDateTime" });
    t.nonNull.field("lastSeen", { type: "CsDateTime" });
    t.field("Author", { type: "MFUser" });
    t.field("Book", { type: "MFBook" });

    // List properties
    t.nonNull.list.field("Scenes", { type: "MFScene" });
  }
});
