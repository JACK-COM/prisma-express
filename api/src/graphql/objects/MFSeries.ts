import { objectType } from "nexus";

/** All `Book` fields we want to expose via GraphQL */
export const MFSeries = objectType({
  name: "MFSeries",
  description: "A collection of `Books` (e.g. a trilogy)",
  definition(t) {
    t.nonNull.int("id");
    t.int("order");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("genre");
    t.int("authorId", { description: "Book Author/owner" });
    t.field("Author", { type: "MFUser" });

    // List properties 
    t.nonNull.list.field("Books", { type: "MFBook" });
  }
});
