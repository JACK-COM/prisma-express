/**
 * @file characters.graphql.ts
 * @description GraphQL requests relating to `Characters` and `Relationships`.
 */
import fetchGQL from "graphql/fetch-gql";
import {
  deleteCharacterMutation,
  deleteRelationshipMutation,
  upsertCharacterMutation,
  upsertRelationshipsMutation
} from "graphql/mutations";
import { listCharactersQuery, listRelationshipsQuery } from "graphql/queries";
import { APIData, Character, CharacterRelationship } from "utils/types";

/** Data required to create a character */
type PartialId = { id?: number };
export type CreateCharacterData =
  | Omit<
      Character,
      "Event" | "Scene" | "Author" | "Group" | "Location" | "World"
    > &
      PartialId;

/** Data required to create a relationship */
export type CreateRelationshipData =
  | Pick<
      CharacterRelationship,
      "characterId" | "authorId" | "targetId" | "relationship"
    > &
      PartialId;

/** @type `Character` search filters */
export type CharacterFilters = APIData<
  Pick<Character, "name" | "authorId" | "description">
>;

/** @mutation Create a `Character` on the server */
export async function upsertCharacter(raw: Partial<CreateCharacterData>) {
  const formatForAPI = (c: Partial<CreateCharacterData>) => ({
    id: c.id || undefined,
    name: c.name || undefined,
    description: c.description || undefined,
    locationId: c.locationId || undefined,
    groupId: c.groupId || undefined,
    worldId: c.worldId || undefined,
    authorId: c.authorId || undefined
  });
  const newCharacter = await fetchGQL<APIData<Character> | null>({
    query: upsertCharacterMutation(),
    variables: { data: formatForAPI(raw) },
    onResolve: ({ upsertCharacter: list }, err) => err || list,
    fallbackResponse: null
  });

  return newCharacter;
}

/** @mutation Delete a `Character` on the server */
export async function deleteCharacter(id: number) {
  return fetchGQL<APIData<Character> | null>({
    query: deleteCharacterMutation(),
    variables: { id },
    onResolve: ({ upsertCharacter: list }, err) => err || list,
    fallbackResponse: null
  });
}

/** @mutation Create a `Character Relationship` on the server */
export async function upsertRelationships(
  characterId: number,
  raw: Partial<CreateRelationshipData>[]
) {
  const formatForAPI = (r: Partial<CreateRelationshipData>) => ({
    characterId: r.characterId || undefined,
    targetId: r.targetId || undefined,
    relationship: r.relationship || undefined,
    authorId: r.authorId || undefined,
    id: r.id || undefined
  });
  const data: ReturnType<typeof formatForAPI>[] = [];
  raw.forEach((r) => {
    if (r.characterId === characterId) data.push(formatForAPI(r));
  });

  const newRelationship = await fetchGQL<APIData<CharacterRelationship> | null>(
    {
      query: upsertRelationshipsMutation(),
      variables: { data },
      onResolve: ({ upsertRelationships: list }, err) => err || list,
      fallbackResponse: null
    }
  );

  return newRelationship;
}

/** @query List all `Characters` on the server (with optional filters) */
export async function listCharacters(filters: Partial<CharacterFilters> = {}) {
  const newCharacter = await fetchGQL<APIData<Character>[]>({
    query: listCharactersQuery(),
    variables: { ...filters },
    onResolve: ({ listCharacters: list }, err) => err || list,
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
  const { characterId } = filters;
  const newRelationship = await fetchGQL<APIData<CharacterRelationship>[]>({
    query: listRelationshipsQuery(),
    variables: { ...filters, characterId },
    onResolve: ({ listRelationships: list }, err) => err || list,
    fallbackResponse: []
  });

  return newRelationship;
}

/** @mutation Delete a `Relationship` on the server */
export async function deleteRelationship(id: number) {
  const respCharacter = await fetchGQL<APIData<Character> | null>({
    query: deleteRelationshipMutation(),
    variables: { id },
    onResolve: ({ upsertCharacter: list }, error) => error || list,
    fallbackResponse: null
  });

  return respCharacter;
}
