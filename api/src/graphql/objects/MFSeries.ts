import { objectType } from "nexus";

/** All `Book` fields we want to expose via GraphQL */
export const MFSeries = objectType({
  name: "MFSeries",
  description: "A collection of `Books` (e.g. a trilogy)",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("title");
    t.nonNull.boolean("public", { description: "Series is publicly visible" });
    t.float("price", { description: "Book price in USD" });
    t.boolean("free", {
      description: "Book is free to read",
      resolve: ({ price }) => !price || price === 0
    });
    t.nonNull.string("description");
    t.nonNull.string("genre");
    t.string("image");
    t.int("authorId", { description: "Book Author/owner" });
    t.field("created", { type: "CsDateTime", description: "Item created" });
    t.field("updated", { type: "CsDateTime", description: "Item updated" });
    t.field("publishDate", {
      type: "CsDateTime",
      description: "Item published for public consumption"
    });

    // List properties
    t.nonNull.list.field("Books", { type: "MFBook" });

    // relation
    t.field("Author", { type: "MFAuthor" });
  }
});
