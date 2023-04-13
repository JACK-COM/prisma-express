/**
 * @file Worlds.Service
 * @description Database helper service for `World` model
 */
import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertWorldInput =
  | Prisma.WorldUpsertArgs["create"] & Prisma.WorldUpsertArgs["update"];
type SearchWorldInput = Partial<
  Pick<World, "name" | "authorId" | "public" | "description"> & WorldByIdInput
>;
type WorldByIdInput = Pick<World, "id">;
const { Worlds } = context;

/** create world record */
export async function upsertWorld(newWorld: UpsertWorldInput) {
  const data: UpsertWorldInput = { ...newWorld };
  return data.id
    ? Worlds.update({
        data,
        where: { id: newWorld.id },
        include: { Locations: true, Events: true }
      })
    : Worlds.create({ data, include: { Locations: true, Events: true } });
}

/** find all world records matching params */
export async function findAllWorld(filters: SearchWorldInput) {
  const where: Prisma.WorldFindManyArgs["where"] = {};
  if (filters.id) where.id = filters.id;

  where.OR = [];
  const { authorId, public: isPub, name, description } = filters;
  if (authorId) where.OR.push({ authorId, public: false });
  if (isPub !== undefined) where.OR.push({ public: isPub });
  if (name) where.OR.push({ name: { contains: name } });
  if (description) where.OR.push({ description: { contains: description } });

  if (!where.OR.length) delete where.OR;

  const worlds = await Worlds.findMany({
    where,
    include: { Locations: true, Events: true }
  });

  return worlds;
}

/** find one world record matching params */
export async function getWorld(where: WorldByIdInput) {
  return Worlds.findUnique({
    where,
    include: { Locations: true, Events: true }
  });
}

/** update one world record matching params */
export async function updateWorld(
  where: WorldByIdInput,
  data: UpsertWorldInput
) {
  return Worlds.update({
    data,
    where,
    include: { Locations: true, Events: true }
  });
}

/** delete a world */
export async function deleteWorld(where: WorldByIdInput) {
  return Worlds.delete({ where, include: { Locations: true, Events: true } });
}
