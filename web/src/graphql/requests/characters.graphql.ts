/**
 * @file characters.graphql.ts
 * @description GraphQL requests relating to `Characters` and `Relationships`.
 */
import fetchGQL from "graphql/fetch-gql";
import {
  deleteCharacterMutation,
  upsertCharacterMutation,
  upsertRelationshipsMutation
} from "graphql/mutations";
import { listCharactersQuery, listRelationshipsQuery } from "graphql/queries";
import { APIData, Character, CharacterRelationship } from "utils/types";

/** Data required to create a character */
export type CreateCharacterData = {
  id?: number;
} & Pick<Character, "name" | "description" | "worldId">;

/** Data required to create a relationship */
export type CreateRelationshipData = {
  id?: number;
} & Pick<CharacterRelationship, "characterId" | "targetId" | "relationship">;

/** @mutation Create a `Character` on the server */
export async function createOrUpdateCharacter(
  data: Partial<CreateCharacterData>
) {
  const newCharacter = await fetchGQL<APIData<Character> | null>({
    query: upsertCharacterMutation(),
    variables: { data },
    onResolve: ({ upsertCharacter: list }) => list,
    fallbackResponse: null
  });

  return newCharacter;
}

/** @mutation Delete a `Character` on the server */
export async function deleteCharacter(worldId: number) {
  const respCharacter = await fetchGQL<APIData<Character> | null>({
    query: deleteCharacterMutation(),
    variables: { data: { id: worldId, deleted: true } },
    onResolve: ({ upsertCharacter: list }) => list,
    fallbackResponse: null
  });

  return respCharacter;
}

/** @mutation Create a `Character Relationship` on the server */
export async function createOrUpdateRelationships(
  data: Partial<CreateRelationshipData>[]
) {
  const newRelationship = await fetchGQL<APIData<CharacterRelationship> | null>(
    {
      query: upsertRelationshipsMutation(),
      variables: { data },
      onResolve: ({ upsertRelationships: list }) => list,
      fallbackResponse: null
    }
  );

  return newRelationship;
}

/** @type `Character` search filters */
type CharacterFilters = Pick<
  APIData<Character>,
  "id" | "name" | "authorId" | "description"
>;
/** @query List all `Characters` on the server (with optional filters) */
export async function listCharacters(filters: Partial<CharacterFilters> = {}) {
  const newCharacter = await fetchGQL<APIData<Character>[]>({
    query: listCharactersQuery(),
    variables: { ...filters },
    onResolve: ({ listCharacters: list }) => list,
    fallbackResponse: []
  });

  return newCharacter;
}

/** @query List all `Relationships` on a world (with optional filters) */
type RelationshipFilters = { characterId: number } & Partial<
  Pick<APIData<CharacterRelationship>, "id" | "targetId" | "relationship">
>;
export async function listRelationships(
  filters: RelationshipFilters = { characterId: -1 }
) {
  const newRelationship = await fetchGQL<APIData<CharacterRelationship>[]>({
    query: listRelationshipsQuery(),
    variables: { ...filters, characterId: filters.characterId },
    onResolve: ({ listRelationships: list }) => list,
    fallbackResponse: []
  });

  return newRelationship;
}
