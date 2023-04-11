/**
 * @file Characters.Service
 * @description Database helper service for `Character` model
 */
import { Prisma, Character } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertCharacterInput =
  | Prisma.CharacterUpsertArgs["create"] & Prisma.CharacterUpsertArgs["update"];
type CharacterByIdInput = Pick<Character, "id">;
type SearchCharacterInput = { authorId: number; id?: number } & Partial<
  Pick<Character, "name" | "worldId" | "groupId" | "description">
>;
const { Characters } = context;

/** create character record */
export async function upsertCharacter(newCharacter: UpsertCharacterInput) {
  const data: UpsertCharacterInput = { ...newCharacter };
  return data.id
    ? Characters.update({ data, where: { id: newCharacter.id } })
    : Characters.create({ data });
}

/** find all character records matching params */
export async function findAllCharacter(filters: SearchCharacterInput) {
  const { id, name, authorId, worldId, groupId, description } = filters;
  const where: Prisma.CharacterFindManyArgs["where"] = {};
  where.AND = { authorId };
  where.AND.OR = [];
  if (id) where.AND.OR.push({ id });
  if (name) {
    where.AND.OR.push({ name: { contains: name, mode: "insensitive" } });
  }
  if (description) {
    where.AND.OR.push({
      description: { contains: description, mode: "insensitive" }
    });
  }
  if (worldId) where.AND.OR.push({ worldId });
  if (groupId) where.AND.OR.push({ groupId });

  return Characters.findMany({ where });
}

/** find one character record matching params */
export async function getCharacter(where: CharacterByIdInput) {
  return Characters.findUnique({ where });
}

/** update one character record matching params */
export async function updateCharacter(
  where: CharacterByIdInput,
  data: UpsertCharacterInput
) {
  return Characters.update({ data, where });
}

/** delete a character */
export async function deleteCharacter(where: CharacterByIdInput) {
  return Characters.delete({ where });
}
