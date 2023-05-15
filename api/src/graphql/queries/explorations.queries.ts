/**
 * @file Explorations.Queries
 * @description GraphQL queries relating to `Explorations` and `Exploration Scenes`.
 */

import {
  queryField,
  nonNull,
  intArg,
  list,
  stringArg,
  booleanArg
} from "nexus";
import * as ExplorationsService from "../../services/explorations.service";
import {
  checkLibrary,
  getUserLibraryExplorations
} from "../../services/libraries.service";
import { DateTime } from "luxon";
import { Exploration } from "@prisma/client";

/**
 * Get a single `Exploration` by ID
 * @param id Exploration ID
 * @returns `MFExploration` object from service; `null` if not found or not authorized
 * @throws Error if exploration not found or exploration is private and user is not the author
 */
export const getExploration = queryField("getExploration", {
  type: "MFExploration",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFExploration` object from service
   */
  resolve: async (_, { id }, { user }) => {
    const [exploration, inLibrary] = await Promise.all([
      ExplorationsService.getExplorationById(id),
      checkLibrary({ explorationId: id, userId: user?.id })
    ]);
    // require public exploration or author
    if (!exploration || (user && exploration.authorId === user?.id))
      return exploration;

    // allow scenes if published or in library
    if (exploration.publishDate || exploration.public) {
      const isPublished = exploration.publishDate
        ? DateTime.now() > DateTime.fromJSDate(exploration.publishDate)
        : false;
      const allowScenes = exploration.public && (isPublished || inLibrary);
      if (allowScenes) return exploration;
    }

    // remove scenes
    return { ...exploration, Scenes: [] };
  }
});

/**
 * Get a list of `Exploration` objects
 * @param title Title to search for
 * @param description Description to search for
 * @param authorId Author ID to search for
 * @param publicOnly Only return public explorations
 * @param publishedOnly Only return published explorations
 * @param inLibraryOnly Only return explorations in user's library
 * @param attributes Attributes to search for
 * @param freeOnly Only return free explorations
 * @param minPrice Minimum price to search for
 * @param maxPrice Maximum price to search for
 */
export const listExplorations = queryField("listExplorations", {
  type: list("MFExploration"),
  args: {
    id: intArg(),
    title: stringArg(),
    description: stringArg(),
    authorId: intArg(),
    locationId: intArg(),
    worldId: intArg(),
    publicOnly: booleanArg(),
    publishedOnly: booleanArg(),
    inLibraryOnly: booleanArg(),
    attributes: list(nonNull(stringArg())),
    freeOnly: booleanArg(),
    minPrice: intArg(),
    maxPrice: intArg()
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFExploration` object from service
   * @throws Error if exploration not found or exploration is private and user is not the author
   */
  resolve: async (_, args, { user }) => {
    const { inLibraryOnly, ...rest } = args;
    if (inLibraryOnly) {
      return user ? getUserLibraryExplorations(user.id) : [];
    }

    const isPublic = (e: Exploration) => e.public;
    const { publicOnly, publishedOnly, freeOnly, minPrice, maxPrice } = rest;
    const explorations = await ExplorationsService.findAllExplorations({
      authorId: rest.authorId,
      title: rest.title || undefined,
      description: rest.description,
      attributes: rest.attributes || undefined,
      public: publicOnly || undefined,
      maxPrice: freeOnly ? 0 : maxPrice || undefined,
      minPrice: freeOnly ? 0 : minPrice || undefined,
      published: publishedOnly || undefined,
      locationId: rest.locationId,
      worldId: rest.worldId || undefined
    });

    return user
      ? explorations.filter(
          (e) => isPublic(e) || e.authorId === user.id || Boolean(e.publishDate)
        )
      : explorations.filter(isPublic);
  }
});

/**
 * Get an `Exploration Scene` by ID
 * @param id Scene ID
 * @returns `MFExplorationScene` object from service; `null` if not found or not authorized
 * @throws Error if scene not found or exploration is private and user is not the author
 */
export const getExplorationScene = queryField("getExplorationScene", {
  type: "MFExplorationScene",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFExplorationScene` object from service
   * @throws Error if scene not found or exploration is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const scene = await ExplorationsService.getExplorationSceneById(id);
    // require public exploration or author
    if (!scene || (user && scene.authorId === user?.id)) return scene;
    return null;
  }
});

/**
 * Get a list of `Exploration Scene` objects
 * @param explorationId Exploration ID to search for
 */
export const listExplorationScenes = queryField("listExplorationScenes", {
  type: list("MFExplorationScene"),
  args: { explorationId: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param __dbCtx `DBContext` from `src/context.ts`.
   * @returns `MFExplorationScene` object from service
   */
  resolve: async (_, args, { user }) => {
    const exploration = await ExplorationsService.getExplorationById(
      args.explorationId
    );
    if (!exploration || !user) return [];
    const exit = exploration.public || exploration.authorId === user?.id;
    if (exit) return exploration.Scenes;

    const isPublished = exploration.publishDate
        ? DateTime.now() > DateTime.fromJSDate(exploration.publishDate)
        : false,
      inLibrary = await checkLibrary({
        explorationId: exploration.id,
        userId: user?.id
      }),
      allowScenes = exploration.public && (isPublished || inLibrary);
    return allowScenes ? exploration.Scenes : [];
  }
});
