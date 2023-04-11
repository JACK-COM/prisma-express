/**
 * @file Scene.Service
 * @description Database helper service for `Scene` model
 */

import { Prisma, Scene } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertSceneInput =
    | Prisma.SceneUpsertArgs["create"] & Prisma.SceneUpsertArgs["update"];
type SearchSceneInput = Pick<CreateSceneInput, "name" | "authorId">;
type SceneByIdInput = Pick<Scene, "id">;
const { Scenes } = context;

/** create scene record */
export async function upsertScene(newScene: CreateSceneInput) {
    const data: CreateSceneInput = { ...newScene };

    return Scenes.upsert({
        create: data,
        update: data,
        where: { id: newScene.id }
    });
}

/** find all scene records matching params */
export async function findAllScene(where: SceneByIdInput | SearchSceneInput) {
    return Scenes.findMany({ where });
}

/** find one scene record matching params */
export async function getScene(where: SceneByIdInput) {
    return Scenes.findUnique({ where });
}

/** update one scene record matching params */
export async function updateScene(
    where: SceneByIdInput,
    data: CreateSceneInput
) {
    return Scenes.update({ data, where });
}

/** delete a scene */
export async function deleteScene(where: SceneByIdInput) {
    return Scenes.delete({ where });
}