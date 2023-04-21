import { objectType } from "nexus";

/** All `Chapter` fields we want to expose via GraphQL */
export const MFChapter = objectType({
  name: "MFChapter",
  description: "A collection of Story `Scenes`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.nonNull.string("title");
    t.string("description");
    t.int("authorId", { description: "Author owner" });
    t.int("bookId", { description: "Chapter's Book id" });
    t.field("status", { type: "ChapterStatus", description: "Status" });
    t.field("created", { type: "CsDateTime", description: "Item created" });
    t.field("updated", { type: "CsDateTime", description: "Item updated" });

    // List properties
    t.list.field("Scenes", { type: "MFScene" });
    t.list.field("Links", { type: "MFSceneContentLink" });

    // relationships
    t.field("Author", { type: "MFAuthor" });
  }
});
