/**
 * @file Content-Links.Mutations.ts
 * @description GraphQL Mutations relating to `ContentLinks`.
 */

import { arg, intArg, list, mutationField, nonNull } from "nexus";
import * as ContentLinksService from "../../services/content-links.service";

/** Create or update multiple `ContentLink` for a given `User` (Author role) */
export const upsertContentLinksMutation = mutationField("upsertContentLinks", {
  // The GraphQL type returned by this mutation
  type: list("MFSceneContentLink"),

  // Input arguments for this mutation.
  args: {
    data: list(nonNull(arg({ type: "MFContentLinkUpsertInput" })))
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFSceneContentLink` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication and Author role
    if (!user || !user.id || user.role !== "Author") {
      throw new Error("Author role required to create a link");
    }

    // require properties
    if (!data || !data.length) {
      throw new Error("No data provided");
    }

    if (data.some((d) => !d.bookId || !d.text)) {
      throw new Error("All links must have text and a bookId");
    }

    // Create link
    return ContentLinksService.upsertContentLinks(
      data.map((d) => ({ ...d, id: d.id || undefined }))
    );
  }
});

/** Delete a `ContentLink` */
export const deleteContentLinkMutation = mutationField("deleteContentLink", {
  // The GraphQL type returned by this mutation
  type: "MFSceneContentLink",

  // Input arguments for this mutation.
  args: {
    id: nonNull(intArg())
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFSceneContentLink` object from service
   * @throws Error if `ContentLink` not found
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user || !user.id || user.role !== "Author") {
      throw new Error("Author role required to delete a link");
    }

    // require owner
    const link = await ContentLinksService.getContentLinkById(id);
    if (!link) throw new Error("Link not found");
    if (link.authorId !== user.id) {
      throw new Error("You don't own this link");
    }

    // Delete link
    return ContentLinksService.deleteContentLink(id);
  }
});
