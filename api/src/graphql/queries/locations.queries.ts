/**
 * @file Locations.Queries
 * @description Queries for the `Locations` model
 */

import { queryField, nonNull, intArg, stringArg, list } from "nexus";
import * as LocationsService from "../../services/locations.service";
import { getWorld } from "../../services/worlds.service";

/**
 * Get a single `Location` by ID
 * @param id Location ID
 * @returns `MFLocation` object from service
 * @throws Error if world not found, or user is not authorized to view world
 */
export const getLocationById = queryField("getLocationById", {
  type: "MFLocation",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFLocation` object from service
   */
  resolve: async (_, { id }, { user }) => {
    const location = await LocationsService.getLocation({ id });

    if (location) {
      // require public world or author
      const world = await getWorld({ id: location.worldId });
      const isAuthor = user?.id === location?.authorId;

      if (isAuthor || world?.public) return location;
    }

    return null;
  }
});

/**
 * List multiple `Locations` and filter by misc criteria. Can be used by an author to view their
 * own locations, or by a reader to view locations in a public world.
 * @param id Location ID
 * @param authorId Locations by AuthorID
 * @param description Locations matching description
 * @param name Locations matching name
 * @returns `MFLocation` object from service
 */
export const listLocations = queryField("listLocations", {
  type: list("MFLocation"),
  description:
    "List/filter multiple `Locations`. Author can view their own locations, a reader can view public locations",
  args: {
    id: intArg(),
    authorId: intArg(),
    worldId: nonNull(intArg()),
    description: stringArg({ default: undefined }),
    name: stringArg({ default: undefined })
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFLocation` object from service
   */
  resolve: async (_, args, { user }) => {
    const { authorId, description, name } = args;

    // return only public locations or author
    const world = await getWorld({ id: args.worldId });
    if (!world || (!world.public && user?.id !== world.authorId)) return [];
    const locations = await LocationsService.findAllLocations({
      ...args,
      id: args.id || undefined,
      authorId: authorId || undefined,
      description: description || undefined,
      name: name || undefined
    });

    return locations;
  }
});
