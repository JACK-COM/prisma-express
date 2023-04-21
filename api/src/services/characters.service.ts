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
    ? Characters.update({
        data,
        where: { id: newCharacter.id },
        include: { World: true }
      })
    : Characters.create({ data, include: { World: true } });
}

/** find all public character records */
export async function findAllPublicCharacter() {
  return Characters.findMany({
    where: { World: { public: true } },
    include: { World: true },
    orderBy: { World: { name: "asc" } }
  });
}

/** find all character records matching params */
export async function findAllCharacter(filters: SearchCharacterInput) {
  const { id, name, authorId, worldId, groupId, description } = filters;
  const where: Prisma.CharacterFindManyArgs["where"] = {};
  if (id) where.id = id;
  if (name) where.name = { contains: name, mode: "insensitive" };

  where.OR = [];
  if (worldId) where.worldId = worldId;
  else where.OR.push({ World: { public: true } });
  if (authorId) {
    where.OR.push(
      { authorId, World: { public: false } },
      { authorId, World: { public: true } }
    );
  }
  if (description) {
    where.OR.push({
      description: { contains: description, mode: "insensitive" }
    });
  }
  if (groupId) where.OR.push({ groupId });
  if (!where.OR.length) delete where.OR;

  return Characters.findMany({
    where,
    include: { World: true },
    orderBy: { World: { name: "asc" } }
  });
}

/** find one character record matching params */
export async function getCharacter(where: CharacterByIdInput) {
  return Characters.findUnique({ where, include: { World: true } });
}

/** delete a character */
export async function deleteCharacter(where: CharacterByIdInput) {
  return Characters.delete({ where, include: { World: true } });
}
