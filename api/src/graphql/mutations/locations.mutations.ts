/**
 * @file Locations.Mutations
 * @description Mutations for the `Locations` model
 */

import { arg, intArg, mutationField, nonNull } from "nexus";
import * as LocationsService from "../../services/locations.service";

/**
 * Create or update a new `Location` for a given `User` (Author role)
 */
export const upsertLocationMutation = mutationField("upsertLocation", {
  // The GraphQL type returned by this mutation
  type: "MFLocation",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: {
    data: nonNull(
      arg({
        type: "MFLocationUpsertInput",
        description: "The data to create a new location"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFLocation` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a location");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a location");
    }

    // require ownership
    if (data.id) {
      const location = await LocationsService.getLocation({ id: data.id });
      if (!location) throw new Error("Location not found");
      if (location.authorId !== user.id)
        throw new Error("You do not own this location");
    }

    // Restrict location nesting
    if (data.id && data.parentLocationId) {
      const child = await LocationsService.findAllLocations({
        parentLocationId: data.id
      });
      if (child.length > 0)
        throw new Error("Found children of nested location");
    } else if (data.parentLocationId) {
      // prevent circular or highly-nested parentLocationId
      if (data.parentLocationId === data.id) {
        throw new Error("Location cannot be its own parent");
      }

      const parentLocation = await LocationsService.getLocation({
        id: data.parentLocationId
      });
      if (!parentLocation) throw new Error("Parent location not found");
      if (parentLocation.parentLocationId) {
        throw new Error("Location cannot be nested more than one level deep");
      }
    }

    // append authorId and data
    return LocationsService.upsertLocation({
      ...data,
      authorId: data.authorId || user.id,
      climate: data.climate || undefined,
      fauna: data.fauna || undefined,
      flora: data.flora || undefined,
      id: data.id || undefined
    });
  }
});

/**
 * Delete a `Location` for a given `User` (Author role)
 */
export const deleteLocationMutation = mutationField("deleteLocation", {
  // The GraphQL type returned by this mutation
  type: "MFLocation",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFLocation` object from service
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to perform that action");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to perform that action");
    }

    // require ownership
    const location = await LocationsService.getLocation({ id });
    if (!location) throw new Error("Location not found");
    else if (location.authorId !== user.id) {
      throw new Error("You do not own this location");
    }

    // append authorId and data
    return LocationsService.deleteLocation({ id });
  }
});
