/**
 * @file Chapters.Mutations.ts
 * @description GraphQL Mutations relating to `Chapters`, and `Scenes`.
 */

import { arg, intArg, mutationField, nonNull } from "nexus";
import * as ChaptersService from "../../services/chapters.service";
import * as ScenesService from "../../services/scenes.service";

/** Create or update a new `Chapter` for a given `User` (Author role) */
export const upsertChapterMutation = mutationField("upsertChapter", {
  // The GraphQL type returned by this mutation
  type: "MFChapter",

  // Input arguments for this mutation.
  args: {
    data: nonNull(
      arg({
        type: "MFChapterUpsertInput",
        description: "The data to create a new chapter"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFChapter` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication and Author role
    if (!user || !user.id || user.role !== "Author") {
      throw new Error("Author role required to create a chapter");
    }

    console.log(
      ChaptersService.pruneChapterData({
        ...data,
        authorId: data.authorId || user.id,
        bookId: data.bookId || undefined
      })
    );

    // Create chapter
    const newChapter = await ChaptersService.upsertChapter(
      ChaptersService.pruneChapterData({
        ...data,
        authorId: data.authorId || user.id,
        bookId: data.bookId || undefined
      })
    );

    // create new scenes
    const { scenes = [] } = data;
    if (scenes?.length) {
      await ScenesService.upsertScenes(
        scenes.map((scene, i) => ({
          ...ScenesService.pruneSceneData(scene, i),
          authorId: scene.authorId || user.id,
          chapterId: newChapter.id,
          title: scene.title || "Untitled Scene",
          text: scene.text || "",
          order: scene.order || i + 1
        }))
      );
    } else if (!data.id) {
      // if no scenes are provided, create a default scene
      await ScenesService.upsertScene({
        title: "Scene 1",
        authorId: user.id,
        order: 1,
        chapterId: newChapter.id,
        text: ""
      });
    }

    return ChaptersService.getChapterById(newChapter.id);
  }
});

/** Create or update a new `Scene` for a given `User` (Author role) */
export const upsertSceneMutation = mutationField("upsertScene", {
  // The GraphQL type returned by this mutation
  type: "MFScene",

  // Input arguments for this mutation.
  args: {
    data: nonNull(
      arg({
        type: "MFSceneUpsertInput",
        description: "The data to create a new scene"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFScene` object from service
   * @throws Error if user is not logged in or not an Author
   * @throws Error if chapterId is not provided
   */
  resolve: async (_, { data: scene }, { user }) => {
    // require authentication and Author role
    if (!user?.id || user.role !== "Author") {
      throw new Error("Author role required to create a scene");
    }

    // Create scene
    return ScenesService.upsertScene({
      ...ScenesService.pruneSceneData(scene),
      authorId: scene.authorId || user.id,
      chapterId: scene.chapterId,
      title: scene.title || "Untitled Scene",
      text: scene.text || "",
      order: scene.order || 0
    });
  }
});

/** Delete a `Chapter` */
export const deleteChapterMutation = mutationField("deleteChapter", {
  // The GraphQL type returned by this mutation
  type: "MFChapter",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFDeleteResponse` object
   * @throws Error if user is not logged in or not an Author
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user?.id) {
      throw new Error("Unauthenticated user");
    }

    // require author/owner
    const chapter = await ChaptersService.getChapterById(id);
    if (!chapter) return null;

    if (chapter?.authorId !== user.id) {
      throw new Error("You are not the author of this chapter");
    }

    // Delete chapter
    return ChaptersService.deleteChapterById(id);
  }
});

/** Delete a `Scene` */
export const deleteSceneMutation = mutationField("deleteScene", {
  // The GraphQL type returned by this mutation
  type: "MFScene",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFDeleteResponse` object
   * @throws Error if user is not logged in or not an Author
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user?.id) {
      throw new Error("Unauthenticated user");
    }

    // require author/owner
    const scene = await ScenesService.getSceneById(id);
    if (!scene) return null;

    if (scene.authorId !== user.id) {
      throw new Error("You are not the author of this scene");
    }

    // Delete scene
    return ScenesService.deleteScene(id);
  }
});
