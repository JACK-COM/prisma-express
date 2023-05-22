import { objectType } from "nexus";

/** All `Exploration` fields we want to expose via GraphQL */
export const MFExploration = objectType({
  name: "MFExploration",
  description:
    "A CYOA-style exploration of a `World` or `Location`, based on a `Book`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("title");
    t.string("config", {
      description: "Exploration config data (JSON string)"
    });
    t.string("description");
    t.string("usesAttributes", {
      description: "Character attributes required to play (OPTIONAL)"
    });
    t.string("image");
    t.int("authorId", { description: "Exploration Author" });
    t.nonNull.int("worldId", { description: "World target id" });
    t.int("locationId", { description: "Location target id" });
    t.boolean("public", { description: "Visible to public" });
    t.boolean("free", {
      description: "Free item",
      resolve: ({ price }) => !price || price === 0
    });
    t.float("price", { description: "Book price in USD" });

    // Date-time fields
    t.field("created", { type: "CsDateTime" });
    t.field("lastUpdated", { type: "CsDateTime" });
    t.field("publishDate", { type: "CsDateTime" });

    // Relationships
    t.field("Author", { type: "MFAuthor", description: "Exploration Author" });
    t.field("World", { type: "MFWorld", description: "Linked World" });
    t.field("Location", { type: "MFLocation", description: "Linked Location" });

    // List properties
    t.nonNull.list.field("Scenes", { type: "MFExplorationScene" });
  }
});
