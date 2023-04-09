/**
 * @file Worlds.Mutations
 * @description Mutations for the `Worlds` model
 */

import { arg, intArg, mutationField, nonNull } from "nexus";
import * as WorldsService from "../../services/worlds.service";

/**
 * Create or update a new `World` for a given `User` (Author role)
 */
export const upsertWorldMutation = mutationField("upsertWorld", {
  // The GraphQL type returned by this mutation
  type: "MFWorld",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: {
    data: nonNull(
      arg({
        type: "MFWorldUpsertInput",
        description: "The data to create a new world"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFWorld` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a world");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a world");
    }

    // require ownership
    if (data.id && data.authorId !== user.id) {
      throw new Error("You do not own this world");
    }

    // append authorId and data
    return WorldsService.upsertWorld({
      ...data,
      authorId: user.id,
      id: data.id || undefined,
      public: data.public || false
    });
  }
});

/**
 * Create or update a new `World` for a given `User` (Author role)
 */
export const deleteWorldMutation = mutationField("deleteWorld", {
  // The GraphQL type returned by this mutation
  type: "MFWorld",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFWorld` object from service
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a world");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a world");
    }

    // require ownership
    const world = await WorldsService.getWorld({ id });
    if (!world) throw new Error("World not found");
    else if (world.authorId !== user.id) {
      throw new Error("You do not own this world");
    }

    // append authorId and data
    return WorldsService.deleteWorld({ id });
  }
});
