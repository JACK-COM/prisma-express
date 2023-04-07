import { objectType } from "nexus";

/** All `Paragraph` fields we want to expose via GraphQL */
export const MFScene = objectType({
  name: "MFScene",
  description: "A collecton of Story `Paragraphs`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.nonNull.string("name");
    t.nonNull.string("description");
    t.int("authorId", { description: "Scene Author" });
    t.nonNull.int("chapterId", { description: "Scene parent `Chapter`" });
    t.int("characterId", { description: "Scene target `Character`" });
    t.int("eventContextId", { description: "Main `Event` affecting `Scene`" });
    t.nonNull.int("locationId", { description: "Scene `Location` (setting)" });
    t.int("timelineId", { description: "Context `Event` Timeline (optional)" });
    t.nonNull.list.field("Paragraphs", { type: "MFParagraph" });
  }
});
