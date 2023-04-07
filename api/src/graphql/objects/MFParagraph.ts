import { objectType } from "nexus";

/** All `Paragraph` fields we want to expose via GraphQL */
export const MFParagraph = objectType({
  name: "MFParagraph",
  description: "A single paragraph in a story. ",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("order");
    t.nonNull.string("text");
    t.int("authorId", { description: "Paragraph Author" });
    t.int("characterId", { description: "Paragraph target `Character`" });
    t.int("sceneId", { description: "Paragraph parent `Scene`" });
  }
});
