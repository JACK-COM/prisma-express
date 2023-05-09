import { objectType } from "nexus";

/** A search result */
export const MFSearchResult = objectType({
  name: "MFSearchResult",
  description: "A search result",
  definition(t) {
    t.nonNull.list.field("books", { type: "MFBook" });
    t.nonNull.list.field("series", { type: "MFSeries" });
    // t.nonNull.list.field("authors", { type: "MFAuthor" });
  }
});
