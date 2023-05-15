import { objectType } from "nexus";

/** All `Library` fields we want to expose via GraphQL */
export const MFLibrary = objectType({
  name: "MFLibrary",
  description: "A user's collection of purchased books",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.nonNull.int("userId");
    t.int("bookId", { description: "ID of Book purchase" });
    t.int("seriesId", { description: "ID of Series purchase" });
    t.int("explorationId", { description: "ID of Exploration purchase" });
    t.nonNull.boolean("publicPurchase", {
      description: "Make this visible on user profile"
    });
    t.field("purchaseDate", { type: "CsDateTime" });
    t.field("Book", { type: "MFBook" });
    t.field("Series", { type: "MFSeries" });
    t.field("Exploration", { type: "MFExploration" });
  }
});
