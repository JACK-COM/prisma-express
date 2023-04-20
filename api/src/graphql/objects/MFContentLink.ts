import { objectType } from "nexus";

export const MFContentLink = objectType({
  name: "MFContentLink",
  description: "A link to a piece of content",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("text");
    t.int("seriesId");
    t.int("bookId");
    t.int("chapterId");
    t.int("sceneId");
    t.int("authorId");
  }
});
