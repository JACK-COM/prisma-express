/**
 * @file Characters.Queries
 * @description Queries for the `Characters` model
 */

import { queryField, nonNull, intArg, stringArg, list } from "nexus";
import * as CharactersService from "../../services/characters.service";
import * as RelationshipsService from "../../services/character-relationships.service";

/**
 * Get a single `Character` by ID
 * @param id Character ID
 * @returns `MFCharacter` object from service
 * @throws Error if character not found, or user is not authorized to view character
 */
export const getCharacterById = queryField("getCharacterById", {
  type: "MFCharacter",
  args: {
    id: nonNull(intArg())
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFCharacter` object from service
   * @throws Error if character not found or character is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const character = await CharactersService.getCharacter({ id });
    const isAuthor = user?.id === character?.authorId;
    // require public character or author
    if (!character || !isAuthor) throw new Error("Character not found");
    return character;
  }
});

/**
 * Get a single `Character Relationship` by ID
 * @param id Character ID
 * @returns `MFCharacter` object from service
 * @throws Error if relationship not found, or user is not authorized to view relationship
 */
export const getRelationshipById = queryField("getRelationshipById", {
  type: "MFCharacterRelationship",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFCharacterRelationship` object from service
   */
  resolve: async (_, { id }) => {
    return RelationshipsService.getCharacterRelationship({ id });
  }
});

/**
 * List multiple `Characters` and filter by misc criteria. Can be used by an author to view their
 * own characters, or by a reader to view public characters.
 * @param id Character ID
 * @returns `MFCharacter` object from service
 * @throws Error if character not found
 * @throws Error if user is not authorized to view character
 * @throws Error if user is not logged in
 * @throws Error if character is private and user is not the author
 */
export const listCharacters = queryField("listCharacters", {
  type: list("MFCharacter"),
  description:
    "List/filter multiple `Characters`. Author can view their own characters, a reader can view public characters",
  args: {
    id: intArg({ default: undefined }),
    authorId: intArg(),
    worldId: intArg(),
    description: stringArg({ default: undefined }),
    name: stringArg({ default: undefined })
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFCharacter` object from service
   * @throws Error if character not found or character is private and user is not the author
   */
  resolve: async (_, args, { user }) => {
    const { authorId, worldId, description, name } = args;

    // return only public characters or author
    if (!user) return [];

    const characters = await CharactersService.findAllCharacter({
      id: args.id || undefined,
      authorId: authorId || user.id,
      description: description || undefined,
      worldId: worldId || undefined,
      name: name || undefined
    });
    return characters;
  }
});

/**
 * List multiple `Character Relationships` and filter by misc criteria.
 * @param id Character ID
 * @returns `MFCharacter` object from service
 * @throws Error if character not found
 * @throws Error if user is not authorized to view character
 * @throws Error if user is not logged in
 * @throws Error if character is private and user is not the author
 */
export const listCharacterRelationships = queryField("listRelationships", {
  type: list("MFCharacterRelationship"),
  description: "List/filter multiple `Character Relationships`.",
  args: {
    id: intArg({ default: undefined }),
    characterId: intArg(),
    targetId: intArg(),
    relationship: stringArg({ default: undefined })
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFCharacterRelationship` list from service
   */
  resolve: async (_, args, { user }) => {
    const { characterId, targetId, relationship } = args;

    // return only public relationships or author
    if (!user) return null;
    const relationships =
      await RelationshipsService.findAllCharacterRelationship({
        id: args.id || undefined,
        characterId: characterId || undefined,
        targetId: targetId || undefined,
        relationship: relationship || undefined
      });
    return relationships;
  }
});
