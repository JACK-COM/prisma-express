import { objectType } from "nexus";

/** All `Scene` fields we want to expose via GraphQL */
export const MFScene = objectType({
  name: "MFScene",
  description: "A chunk of story in a chapter`",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.nonNull.string("title");
    t.string("description");
    t.string("text");
    t.int("authorId", { description: "Scene Author" });
    t.nonNull.int("chapterId", { description: "Scene parent `Chapter`" });
    t.int("characterId", { description: "Scene target `Character`" });
    t.int("eventContextId", { description: "Main `Event` affecting `Scene`" });
    t.int("timelineId", { description: "`Event` Context Timeline (optional)" });
    t.field("created", { type: "CsDateTime", description: "Item created" });
    t.field("updated", { type: "CsDateTime", description: "Item updated" });
  }
});
