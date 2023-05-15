import { objectType } from "nexus";

/** All `Note` fields we want to expose via GraphQL */
export const Note = objectType({
  name: "Note",
  description: "A note about a character, location, or event",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.string("image");
    t.nonNull.int("authorId", { description: "Note Author" });
    t.int("bookId", { description: "Book target id" });
    t.int("chapterId", { description: "Chapter target id" });
    t.int("characterId", { description: "Character target id" });
    t.int("sceneId", { description: "Scene target id" });

    // Relationships
    t.field("Author", { type: "MFAuthor", description: "Note Author" });
    t.field("Book", { type: "MFBook", description: "Book target" });
    t.field("Chapter", { type: "MFChapter", description: "Chapter target" });
    t.field("Character", {
      type: "MFCharacter",
      description: "Character target"
    });
    t.field("Scene", { type: "MFScene", description: "Scene target" });
  }
});
