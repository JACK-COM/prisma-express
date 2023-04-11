/**
 * @file Worlds.Service
 * @description Database helper service for `World` model
 */
import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertWorldInput =
  | Prisma.WorldUpsertArgs["create"] & Prisma.WorldUpsertArgs["update"];
type SearchWorldInput = Partial<
  Pick<World, "name" | "authorId" | "description"> & WorldByIdInput
>;
type WorldByIdInput = Pick<World, "id">;
const { Worlds } = context;

/** create world record */
export async function upsertWorld(newWorld: UpsertWorldInput) {
  const data: UpsertWorldInput = { ...newWorld };
  return data.id
    ? Worlds.update({ data, where: { id: newWorld.id } })
    : Worlds.create({ data });
}

/** find all world records matching params */
export async function findAllWorld(filters: SearchWorldInput) {
  const OR: Prisma.WorldFindManyArgs["where"] = {};
  if (filters.authorId) OR.authorId = filters.authorId;
  if (filters.id) OR.id = filters.id;
  if (filters.name) OR.name = { contains: filters.name };
  if (filters.description) OR.description = { contains: filters.description };
  const worlds =
    Object.keys(OR).length > 0
      ? await Worlds.findMany({ where: { OR } })
      : await Worlds.findMany();

  return worlds;
}

/** find one world record matching params */
export async function getWorld(where: WorldByIdInput) {
  return Worlds.findUnique({ where });
}

/** update one world record matching params */
export async function updateWorld(
  where: WorldByIdInput,
  data: UpsertWorldInput
) {
  return Worlds.update({ data, where });
}

/** delete a world */
export async function deleteWorld(where: WorldByIdInput) {
  return Worlds.delete({ where });
}
