/**
 * @file Scene.Service
 * @description Database helper service for `Scene` model
 */

import { Prisma, Scene } from "@prisma/client";
import { context } from "../graphql/context";
import { DateTime } from "luxon";

type UpsertSceneInput =
  | Prisma.SceneUpsertArgs["create"] & Prisma.SceneUpsertArgs["update"];
type SearchSceneInput = Partial<
  Pick<Scene, "title" | "description" | "text" | "chapterId" | "authorId"> & {
    id?: Scene["id"][];
  }
>;
const { Scenes } = context;

/** create or update `Scene` record */
export async function upsertScene(newScene: UpsertSceneInput) {
  const data: UpsertSceneInput = { ...newScene };
  const now = DateTime.now().toISO();
  if (!data.id) data.created = now;
  data.lastUpdated = now;

  return data.id
    ? Scenes.update({ data, where: { id: data.id } })
    : Scenes.create({ data });
}

/** create or update multiple `Scene` records */
export async function upsertScenes(newScenes: UpsertSceneInput[]) {
  return Promise.all(newScenes.map(upsertScene));
}

/** find all `Scene` records matching params */
export async function findAllScenes(filters: SearchSceneInput) {
  const where: Prisma.SceneWhereInput = {};
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.id) where.id = { in: filters.id };
  if (filters.title) where.title = { contains: filters.title };
  if (filters.text) where.text = { contains: filters.text };

  return Scenes.findMany({ where });
}

/** find one `Scene` record matching params */
export async function getSceneById(id: number) {
  return Scenes.findUnique({ where: { id } });
}

/** delete a `Scene` */
export async function deleteScene(id: number) {
  return Scenes.delete({ where: { id } });
}

/** Prune data */
export function pruneSceneData(scene: any, i = 0) {
  return {
    id: scene.id || undefined,
    title: scene.title || "Untitled Scene",
    description: scene.description || "",
    text: scene.text || "",
    order: scene.order || i + 1,
    chapterId: scene.chapterId,
    authorId: scene.authorId || undefined,
    createdAt: scene.eventContextId || undefined,
    eventContextId: scene.eventContextId || undefined,
    characterId: scene.characterId || undefined,
    timelineId: scene.timelineId || undefined
  };
}
