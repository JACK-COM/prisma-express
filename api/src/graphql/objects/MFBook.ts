import { objectType } from "nexus";

/** All `Book` fields we want to expose via GraphQL */
export const MFBook = objectType({
  name: "MFBook",
  description: "A collection of story `Chapters`",
  definition(t) {
    t.nonNull.int("id");
    t.int("order");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("genre");
    t.int("authorId", { description: "Book Author/owner" });
    t.int("seriesId", {
      description: "Book series (e.g. 'Foundation Trilogy')"
    });
    t.nonNull.field("created", { type: "CsDateTime" });
    t.nonNull.field("lastSeen", { type: "CsDateTime" });
    t.field("Author", { type: "MFUser" });
    // t.field("Series", { type: "MFSeries" });
    
    // List properties 
    t.nonNull.list.field("Chapters", { type: "MFChapter" });
  }
});
