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
  args: {
    id: nonNull(intArg())
  },

  /**
   * Query resolver: this is where the magic happens
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFLocation` object from service
   * @throws Error if world not found or world is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const location = await LocationsService.getLocation({ id });

    if (location) {
      // require public world or author
      const world = await getWorld({ id: location.worldId });
      const isAuthor = user?.id === location?.authorId;

      if (isAuthor || world?.public) return location;
    }

    throw new Error("Location not found");
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
 * @throws Error if world not found
 * @throws Error if user is not authorized to view world
 * @throws Error if user is not logged in
 * @throws Error if world is private and user is not the author
 */
export const listLocations = queryField("listLocations", {
  type: list("MFLocation"),
  description:
    "List/filter multiple `Locations`. Author can view their own locations, a reader can view public locations",
  args: {
    id: intArg(),
    authorId: intArg(),
    description: stringArg({ default: undefined }),
    name: stringArg({ default: undefined })
  },

  /**
   * Query resolver: this is where the magic happens
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFLocation` object from service
   * @throws Error if world not found or world is private and user is not the author
   */
  resolve: async (_, args, { user }) => {
    const { authorId, description, name } = args;

    // return only public locations or author
    const locations = await LocationsService.findAllLocation({
      id: args.id || undefined,
      authorId: authorId || undefined,
      description: description || undefined,
      name: name || undefined
    });
    return locations.filter((l) => l.World.public || user?.id === l.authorId);
  }
});
