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
const SharedCharacterFields: Prisma.CharacterFindManyArgs = {
  include: { World: true },
  orderBy: { World: { name: "asc" } }
};

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
export async function findAllPublicCharacter(
  filters: Partial<SearchCharacterInput> = {}
) {
  const where = makeFindManyInput(filters as SearchCharacterInput);
  if (where.AND && Array.isArray(where.AND)) {
    const index = where.AND.findIndex((item) => item.World?.public === true);
    if (index === -1) where.AND.push({ World: { public: true } });
  } else where.AND = [{ World: { public: true } }];

  return Characters.findMany({ where, ...SharedCharacterFields });
}

/** find all character records matching params */
export async function findAllCharacter(filters: SearchCharacterInput) {
  const where = makeFindManyInput(filters);
  return Characters.findMany({ where, ...SharedCharacterFields });
}

function makeFindManyInput(filters: SearchCharacterInput) {
  const { id, name, authorId, worldId, groupId, description } = filters;
  const where: Prisma.CharacterFindManyArgs["where"] = {};
  if (id) where.id = id;
  if (name) where.name = { contains: name, mode: "insensitive" };
  if (worldId) where.worldId = worldId;
  if (!authorId && !groupId && !description) return where;

  where.OR = [];
  if (groupId) where.OR.push({ groupId });
  if (authorId) {
    where.OR.push(
      { authorId, World: { public: false } },
      { authorId, World: { public: true } },
      { World: { public: true } }
    );
  }
  if (description) {
    where.OR.push({
      description: { contains: description, mode: "insensitive" }
    });
  }
  return where;
}

/** find one character record matching params */
export async function getCharacter(where: CharacterByIdInput) {
  return Characters.findUnique({ where, include: { World: true } });
}

/** delete a character */
export async function deleteCharacter(where: CharacterByIdInput) {
  return Characters.delete({ where, include: { World: true } });
}
