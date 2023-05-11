/**
 * @file Worlds.Service
 * @description Database helper service for `World` model
 */
import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertWorldInput =
  | Prisma.WorldUpsertArgs["create"] & Prisma.WorldUpsertArgs["update"];
type SearchWorldInput = Partial<
  Pick<
    WorldByIdInput & World,
    "name" | "id" | "authorId" | "public" | "parentWorldId" | "description"
  >
>;
type WorldByIdInput = Pick<World, "id">;
const { Worlds } = context;
const WorldContent: Prisma.WorldInclude = { Locations: true, Events: true };

/** create world record */
export async function upsertWorld(newWorld: UpsertWorldInput) {
  const data: UpsertWorldInput = { ...newWorld };
  return data.id
    ? Worlds.update({ data, where: { id: newWorld.id }, include: WorldContent })
    : Worlds.create({ data, include: WorldContent });
}

/** find all world records matching params */
export async function findAllWorld(filters: SearchWorldInput) {
  const where: Prisma.WorldFindManyArgs["where"] = {};
  if (filters.id) where.id = filters.id;
  if (filters.parentWorldId !== undefined)
    where.parentWorldId = filters.parentWorldId;

  where.OR = [];
  const { authorId, public: isPub, name, description } = filters;
  if (authorId)
    where.OR.push({ authorId, public: false }, { authorId, public: true });
  if (isPub !== undefined) where.OR.push({ public: isPub });
  if (name) where.OR.push({ name: { contains: name } });
  if (description) where.OR.push({ description: { contains: description } });

  if (!where.OR.length) delete where.OR;
  const worlds = await Worlds.findMany({
    where,
    include: WorldContent,
    orderBy: { public: "asc" }
  });
  return worlds;
}

/** find one world record matching params */
export async function getWorld(where: WorldByIdInput) {
  return Worlds.findUnique({ where, include: WorldContent });
}

/** update one world record matching params */
export async function updateWorld(
  where: WorldByIdInput,
  data: UpsertWorldInput
) {
  return Worlds.update({ data, where, include: WorldContent });
}

/** delete a world */
export async function deleteWorld(where: WorldByIdInput) {
  const { id } = where;
  const [deletedWorld] = await Promise.all([
    // delete world and related content (e.g. locations)
    Worlds.delete({ where, include: WorldContent }),
    // nullify non-relational references to this world
    Worlds.updateMany({
      where: { parentWorldId: id },
      data: { parentWorldId: null }
    })
  ]);
  return deletedWorld;
}
