import { objectType } from "nexus";

/** All `Book` fields we want to expose via GraphQL */
export const MFBook = objectType({
  name: "MFBook",
  description: "A collection of story `Chapters`",
  definition(t) {
    t.nonNull.int("id");
    t.int("order", { description: "Book order in series" });
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("genre");
    t.nonNull.boolean("public", { description: "Book is publicly visible" });
    t.boolean("free", {
      description: "Book is free to read",
      resolve: ({ price }) => !price || price === 0
    });
    t.string("image");
    t.float("price", { description: "Book price in USD" });
    t.int("worldId", { description: "Fictional World location of Book" });
    t.int("locationId", { description: "Fictional World location of Book" });
    t.int("authorId", { description: "Book Author/owner" });
    t.int("seriesId", { description: "Book series parent id" });
    t.field("created", { type: "CsDateTime", description: "Item created" });
    t.field("updated", { type: "CsDateTime", description: "Item updated" });
    t.field("publishDate", {
      type: "CsDateTime",
      description: "Item published for public consumption"
    });

    // List properties
    t.list.field("Chapters", { type: "MFChapter" });

    // relationships
    t.field("Author", { type: "MFAuthor" });
    // t.field("Series", { type: "MFSeries" });
  }
});
