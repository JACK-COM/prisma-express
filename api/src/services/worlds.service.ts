/**
 * @file Worlds.Service
 * @description Database helper service for `World` model
 */
import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type CreateWorldInput =
  | Prisma.WorldUpsertArgs["create"] & Prisma.WorldUpsertArgs["update"];
type SearchWorldInput = Partial<
  Pick<CreateWorldInput, "name" | "authorId" | "description"> & WorldByIdInput
>;
type WorldByIdInput = Pick<World, "id">;
const { Worlds } = context;

/** create world record */
export async function upsertWorld(newWorld: CreateWorldInput) {
  const data: CreateWorldInput = { ...newWorld };
  return data.id
    ? Worlds.update({ data, where: { id: newWorld.id } })
    : Worlds.create({ data });
}

/** find all world records matching params */
export async function findAllWorld(filters: SearchWorldInput) {
  const where: Prisma.WorldFindManyArgs["where"] = { OR: {} };
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.id) where.id = filters.id;
  if (filters.name) where.name = { contains: filters.name };
  if (filters.description)
    where.description = { contains: filters.description };
  return Worlds.findMany({ where });
}

/** find one world record matching params */
export async function getWorld(where: WorldByIdInput) {
  return Worlds.findUnique({ where });
}

/** update one world record matching params */
export async function updateWorld(
  where: WorldByIdInput,
  data: CreateWorldInput
) {
  return Worlds.update({ data, where });
}

/** delete a world */
export async function deleteWorld(where: WorldByIdInput) {
  return Worlds.delete({ where });
}
