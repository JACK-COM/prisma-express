/**
 * @file Content-Links.Queries.ts
 * @description GraphQL Queries relating to `ContentLinks`.
 */

import { intArg, list, nonNull, queryField, stringArg } from "nexus";
import * as ContentLinksService from "../../services/content-links.service";

/** Get a `ContentLink` by ID */
export const getContentLink = queryField("getContentLink", {
  // The GraphQL type returned by this query
  type: "MFSceneContentLink",

  // Input arguments for this query.
  args: {
    id: nonNull(intArg())
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFSceneContentLink` object from service
   * @throws Error if `ContentLink` not found
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user || !user.id || user.role !== "Author") {
      throw new Error("Author role required to get a link");
    }

    // Get link
    return ContentLinksService.getContentLinkById(id);
  }
});

/** Search for a list of `ContentLink`s by misc parameters */
export const listContentLinks = queryField("listContentLinks", {
  // The GraphQL type returned by this query
  type: list("MFSceneContentLink"),

  // Input arguments for this query.
  args: {
    text: stringArg(),
    authorId: intArg({ default: undefined }),
    sceneId: intArg(),
    chapterId: intArg(),
    bookId: intArg(),
    seriesId: intArg()
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFSceneContentLink` object from service
   * @throws Error if `ContentLink` not found
   */
  resolve: async (
    _,
    { text, authorId, sceneId, chapterId, bookId, seriesId },
    { user }
  ) => {
    // require authentication and Author role
    if (!user || !user.id || user.role !== "Author") {
      throw new Error("Author role required to get a link");
    }

    // Get link
    return ContentLinksService.findManyContentLinks({
      text: text || undefined,
      bookId: bookId || undefined,
      authorId,
      sceneId,
      chapterId,
      seriesId
    });
  }
});
