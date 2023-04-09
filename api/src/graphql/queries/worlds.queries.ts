/**
 * @file Worlds.Queries
 * @description Queries for the `Worlds` model
 */

import { queryField, nonNull, intArg, stringArg, list } from "nexus";
import * as WorldsService from "../../services/worlds.service";

/**
 * Get a single `World` by ID
 * @param id World ID
 * @returns `MFWorld` object from service
 * @throws Error if world not found, or user is not authorized to view world
 */
export const getWorldById = queryField("getWorldById", {
  type: "MFWorld",
  args: {
    id: nonNull(intArg())
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFWorld` object from service
   * @throws Error if world not found or world is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const world = await WorldsService.getWorld({ id });
    const isAuthor = user?.id === world?.authorId;

    // require public world or author
    if (!world || (!world.public && !isAuthor)) {
      throw new Error("World not found");
    }

    return world;
  }
});

/**
 * List multiple `Worlds` and filter by misc criteria. Can be used by an author to view their
 * own worlds, or by a reader to view public worlds.
 * @param id World ID
 * @returns `MFWorld` object from service
 * @throws Error if world not found
 * @throws Error if user is not authorized to view world
 * @throws Error if user is not logged in
 * @throws Error if world is private and user is not the author
 */
export const listWorlds = queryField("listWorlds", {
  type: list("MFWorld"),
  description:
    "List/filter multiple `Worlds`. Author can view their own worlds, a reader can view public worlds",
  args: {
    id: intArg(),
    authorId: intArg(),
    description: stringArg({ default: undefined }),
    name: stringArg({ default: undefined })
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFWorld` object from service
   * @throws Error if world not found or world is private and user is not the author
   */
  resolve: async (_, args, { user }) => {
    const { authorId, description, name } = args;

    // return only public worlds or author
    const worlds = await WorldsService.findAllWorld({
      id: args.id || undefined,
      authorId: authorId || undefined,
      description: description || undefined,
      name: name || undefined
    });
    return worlds.filter((w) => w.public || user?.id === w.authorId);
  }
});
