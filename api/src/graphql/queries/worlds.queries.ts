/**
 * @file Worlds.Queries
 * @description Queries for the `Worlds` model
 */

import {
  queryField,
  nonNull,
  intArg,
  stringArg,
  list,
  booleanArg
} from "nexus";
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
    parentWorldId: intArg(),
    parentsOnly: booleanArg({ default: false }),
    description: stringArg({ default: undefined }),
    name: stringArg({ default: undefined }),
    public: booleanArg({ default: true })
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFWorld` object from service
   */
  resolve: async (_, args, { user }) => {
    const { authorId, description, name } = args;
    // enforce public worlds if no authed user
    if (!user?.id) return WorldsService.findAllWorld({ public: true });

    const worlds = await WorldsService.findAllWorld({
      id: args.id || undefined,
      authorId: authorId || undefined,
      parentWorldId: args.parentsOnly ? null : args.parentWorldId,
      description: description || undefined,
      name: name || undefined,
      public: args.public || undefined
    });
    return worlds;
  }
});

/**
 * Get a single `World` by ID
 * @param id World ID
 * @returns `MFWorld` object from service
 * @throws Error if world not found, or user is not authorized to view world
 */
export const getWorld = queryField("getWorld", {
  type: "MFWorld",
  args: {
    id: nonNull(intArg())
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   */
  resolve: async (_, { id }, { user }) => {
    const world = await WorldsService.getWorld({ id });
    const isAuthor = world?.public || user?.id === world?.authorId;

    // require public world or author
    if (!isAuthor) throw new Error("World not found");
    return world;
  }
});
