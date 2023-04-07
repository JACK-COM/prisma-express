/**
 * @file Worlds.Service
 * @description Database helper service for `World` model
 */
import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type CreateWorldInput =
  | Prisma.WorldUpsertArgs["create"] & Prisma.WorldUpsertArgs["update"];
type SearchWorldInput = Pick<CreateWorldInput, "name" | "authorId">;
type WorldByIdInput = Pick<World, "id">;
const { Worlds } = context;

/** create world record */
export async function upsertWorld(newWorld: CreateWorldInput) {
  const data: CreateWorldInput = { ...newWorld };

  return Worlds.upsert({
    create: data,
    update: data,
    where: { id: newWorld.id }
  });
}

/** find all world records matching params */
export async function findAllWorld(where: WorldByIdInput | SearchWorldInput) {
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