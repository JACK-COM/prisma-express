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
const { Characters, Worlds } = context;

/** create character record */
export async function upsertCharacter(newCharacter: UpsertCharacterInput) {
  const data: UpsertCharacterInput = { ...newCharacter };
  return data.id
    ? Characters.update({ data, where: { id: newCharacter.id } })
    : Characters.create({ data });
}

/** find all public character records */
export async function findAllPublicCharacter() {
  const pubWorlds = await Worlds.findMany({ where: { public: true } });
  const pubWorldIds = pubWorlds.map((w) => w.id);
  return Characters.findMany({
    where: { worldId: { in: pubWorldIds } }
  });
}

/** find all character records matching params */
export async function findAllCharacter(filters: SearchCharacterInput) {
  const { id, name, authorId, worldId, groupId, description } = filters;
  if (!id && !name && !authorId && !worldId && !groupId && !description) {
    return findAllPublicCharacter();
  }

  const where: Prisma.CharacterFindManyArgs["where"] = {};
  where.OR = [];
  if (authorId) where.OR.push({ authorId });
  if (id) where.OR.push({ id });
  if (name) {
    where.OR.push({ name: { contains: name, mode: "insensitive" } });
  }
  if (description) {
    where.OR.push({
      description: { contains: description, mode: "insensitive" }
    });
  }
  if (worldId) where.OR.push({ worldId });
  if (groupId) where.OR.push({ groupId });
  if (!where.OR.length) delete where.OR;

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
