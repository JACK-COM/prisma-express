/**
 * @file Locations.Mutations
 * @description Mutations for the `Locations` model
 */

import { arg, mutationField, nonNull } from "nexus";
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
   * Mutation resolver: this is where the magic happens
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
    if (data.id && data.authorId !== user.id) {
      throw new Error("You do not own this location");
    }

    // append authorId and data
    return LocationsService.upsertLocation({
      ...data,
      authorId: user.id,
      climate: data.climate || undefined,
      fauna: data.fauna || undefined,
      flora: data.flora || undefined,
      id: data.id || undefined
    });
  }
});
