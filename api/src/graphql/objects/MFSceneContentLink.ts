import { objectType } from "nexus";

export const MFSceneContentLink = objectType({
  name: "MFSceneContentLink",
  description: "A link to a piece of content",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("originId");
    t.nonNull.string("text");
    t.int("seriesId");
    t.nonNull.int("bookId");
    t.int("chapterId");
    t.int("sceneId");
    t.int("authorId");
  }
});
