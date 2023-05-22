import { objectType } from "nexus";

/** All `Exploration Scene` fields we want to expose via GraphQL */
export const MFExplorationScene = objectType({
  name: "MFExplorationScene",
  description: "A single scene in a CYOA-style exploration",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("explorationId", { description: "Exploration target id" });
    t.nonNull.string("title");
    t.int("authorId");
    t.string("description");
    t.string("config", { description: "Scene config data (JSON string)" });
    t.nonNull.int("order", { description: "Scene order in exploration" });
    t.string("background", { description: "Scene bg data" });
    t.string("foreground", { description: "Scene objects" });
    t.string("characters", { description: "Scene characters" });

    // Relationships
    t.field("Exploration", {
      type: "MFExploration",
      description: "Linked Scene"
    });
  }
});
