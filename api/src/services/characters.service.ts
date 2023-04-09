/**
 * @file Characters.Service
 * @description Database helper service for `Character` model
 */
import { Prisma, Character } from "@prisma/client";
import { context } from "../graphql/context";

type CreateCharacterInput =
  | Prisma.CharacterUpsertArgs["create"] & Prisma.CharacterUpsertArgs["update"];
type CharacterByIdInput = Pick<Character, "id">;
type SearchCharacterInput = { authorId: number; id?: number } & Partial<
  Pick<Character, "name" | "worldId" | "groupId" | "description">
>;
const { Characters } = context;

/** create character record */
export async function upsertCharacter(newCharacter: CreateCharacterInput) {
  const data: CreateCharacterInput = { ...newCharacter };
  return data.id
    ? Characters.update({ data, where: { id: newCharacter.id } })
    : Characters.create({ data });
}

/** find all character records matching params */
export async function findAllCharacter(filters: SearchCharacterInput) {
  const OR: Prisma.CharacterFindManyArgs["where"] = {};
  if (filters.id) OR.id = filters.id;
  if (filters.name) OR.name = { contains: filters.name };
  if (filters.description) OR.description = { contains: filters.description };
  if (filters.worldId) OR.worldId = filters.worldId;
  if (filters.groupId) OR.groupId = filters.groupId;
  const { authorId } = filters;

  return Characters.findMany({ where: { AND: { authorId, OR } } });
}

/** find one character record matching params */
export async function getCharacter(where: CharacterByIdInput) {
  return Characters.findUnique({ where });
}

/** update one character record matching params */
export async function updateCharacter(
  where: CharacterByIdInput,
  data: CreateCharacterInput
) {
  return Characters.update({ data, where });
}

/** delete a character */
export async function deleteCharacter(where: CharacterByIdInput) {
  return Characters.delete({ where });
}
