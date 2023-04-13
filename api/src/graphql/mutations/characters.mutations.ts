/**
 * @file Characters.Mutations
 * @description Mutations for the `Characters` model
 */

import { arg, intArg, list, mutationField, nonNull } from "nexus";
import * as CharactersService from "../../services/characters.service";
import * as RelationshipsService from "../../services/character-relationships.service";

/** Create or update a new `Character` for a given `User` (Author role) */
export const upsertCharacterMutation = mutationField("upsertCharacter", {
  // The GraphQL type returned by this mutation
  type: "MFCharacter",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: {
    data: nonNull(
      arg({
        type: "MFCharacterUpsertInput",
        description: "The data to create a new character"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFCharacter` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a character");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a character");
    }

    // require ownership
    if (data.id && data.authorId !== user.id) {
      throw new Error("You do not own this character");
    }

    // append authorId and data
    return CharactersService.upsertCharacter({
      ...data,
      authorId: user.id,
      id: data.id || undefined,
      description: data.description || "No description"
    });
  }
});

/** Create or update a new `Character` for a given `User` (Author role) */
export const deleteCharacterMutation = mutationField("deleteCharacter", {
  // The GraphQL type returned by this mutation
  type: "MFCharacter",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFCharacter` object from service
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a character");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a character");
    }

    // require ownership
    const character = await CharactersService.getCharacter({ id });
    if (!character) throw new Error("Character not found");
    else if (character.authorId !== user.id) {
      throw new Error("You do not own this character");
    }

    // append authorId and data
    return CharactersService.deleteCharacter({ id });
  }
});

/** Create or update a new `Character Relationship` for a given `User` (Author role) */
export const upsertCharacterRelationshipMutation = mutationField(
  "upsertRelationships",
  {
    // The GraphQL type returned by this mutation
    type: list("MFCharacterRelationship"),

    // Input arguments for this mutation. Every key will be required on the `args` object
    // sent to the mutation by the client
    args: {
      data: nonNull(
        list(
          nonNull(
            arg({
              type: "MFRelationshipUpsertInput",
              description: "The data to create a new character relationship"
            })
          )
        )
      )
    },

    /**
     * Mutation resolver
     * @param _ Source object (ignored in mutations/queries)
     * @param args Args (everything defined in `args` property above)
     * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
     * database directly, or to access the authenticated `user` if the request has one.
     * @returns `MFCharacterRelationship` object from service
     */
    resolve: async (_, { data }, { user }) => {
      // require authentication
      if (!user?.id) {
        throw new Error("You must be logged in to create relationships");
      }

      // require Author role
      if (user.role !== "Author") {
        throw new Error("Author role required to create relationships");
      }

      if (!data.length) return [];

      // require ownership
      const [first] = data;
      const character = await CharactersService.getCharacter({
        id: first.characterId
      });
      if (!character) throw new Error("Character not found");
      else if (character.authorId !== user.id) {
        throw new Error("You do not own this character");
      }

      // append authorId and data
      return RelationshipsService.upsertCharacterRelationships(
        data.map((d) => ({ ...d, id: d.id || undefined }))
      );
    }
  }
);

/** Delete a `Relationship` for a given `User` (Author role) */
export const deleteRelationshipMutation = mutationField("deleteRelationship", {
  // The GraphQL type returned by this mutation
  type: "MFCharacterRelationship",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFRelationship` object from service
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a character");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a character");
    }

    // require ownership
    const rel = await RelationshipsService.getCharacterRelationship({ id });
    if (!rel) throw new Error("Relationship not found");
    const character = await CharactersService.getCharacter({ id });
    if (!character) throw new Error("Character not found");
    else if (character.authorId !== user.id) {
      throw new Error("You do not own this character");
    }

    // delete relationship
    return RelationshipsService.deleteCharacterRelationship({ id });
  }
});
