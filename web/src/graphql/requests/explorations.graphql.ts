/**
 * @file explorations.graphql.ts
 * @description GraphQL requests relating to `Explorations`, and `ExplorationScenes`.
 */

import { gql } from "@apollo/client";
import {
  fetchGQL,
  deleteExplorationMutation,
  deleteExplorationSceneMutation,
  getExplorationQuery,
  getExplorationSceneQuery,
  upsertExplorationMutation,
  upsertExplorationSceneMutation,
  listExplorationsQuery,
  listExplorationScenesQuery
} from "graphql";
import { APIData, Exploration, ExplorationScene } from "utils/types";

type PartialId = { id?: number };
/** Data to create an `Exploration` */
export type UpsertExplorationInput = PartialId &
  Omit<Exploration, "World" | "Author" | "Scenes" | "Location"> & {
    Scenes?: UpsertExplorationSceneInput[];
  };

/** Data to create an `ExplorationScene` */
export type UpsertExplorationSceneInput = Omit<
  ExplorationScene,
  "Exploration" | "explorationId"
> &
  PartialId & {
    explorationId?: number;
  };

/** Get an `Exploration` */
export async function getExploration(
  id: number
): Promise<APIData<Exploration> | null> {
  return fetchGQL<APIData<Exploration> | null>({
    query: getExplorationQuery(),
    variables: { id },
    onResolve: (x, errors) => errors || x.getExploration,
    fallbackResponse: null
  });
}

/** List `Exploration`s */
export async function listExplorations(
  data: Partial<Exploration> = {}
): Promise<APIData<Exploration>[]> {
  return fetchGQL<APIData<Exploration>[]>({
    query: listExplorationsQuery(),
    variables: { ...data },
    onResolve: (x, errors) => errors || x.listExplorations,
    fallbackResponse: []
  });
}

/** Get `Exploration Scene` by id */
export async function getExplorationScene(
  id: number
): Promise<APIData<ExplorationScene> | null> {
  return fetchGQL<APIData<ExplorationScene> | null>({
    query: getExplorationSceneQuery(),
    variables: { id },
    onResolve: (x, errors) => errors || x.getExplorationScene,
    fallbackResponse: null
  });
}

/** Get `Scenes` for `Exploration` by id */
export async function listExplorationScenes(
  explorationId: number
): Promise<APIData<ExplorationScene>[]> {
  return fetchGQL<APIData<ExplorationScene>[]>({
    query: listExplorationScenesQuery(),
    variables: { explorationId },
    onResolve: (x, errors) => errors || x.listExplorationScenes,
    fallbackResponse: []
  });
}

/** Create or update an `Exploration` */
export async function upsertExploration(
  data: UpsertExplorationInput
): Promise<APIData<Exploration> | null> {
  const pruned = pruneExplorationData(data);
  return fetchGQL<APIData<Exploration> | null>({
    query: upsertExplorationMutation(),
    variables: { data: pruned },
    onResolve: (x, errors) => errors || x.upsertExploration,
    fallbackResponse: null
  });
}

/** Create or update an `ExplorationScene` (returns parent `Exploration`) */
export async function upsertExplorationScene(
  data: UpsertExplorationSceneInput
): Promise<APIData<Exploration> | null> {
  const pruned = pruneExplorationSceneData(data);
  const { explorationId } = data;
  if (!explorationId) throw new Error("Exploration ID not found on scene");

  return fetchGQL<APIData<ExplorationScene> | null>({
    query: upsertExplorationSceneMutation(),
    refetchQueries: [
      { query: gql(getExplorationQuery()), variables: { id: explorationId } }
    ],
    variables: { data: pruned },
    onResolve: (x, errors) => errors || x.upsertExplorationScene,
    fallbackResponse: null
  }).then((x: any) => (x?.id ? getExploration(explorationId) : x));
}

/** Delete an `Exploration` */
export async function deleteExploration(
  id: number
): Promise<APIData<Exploration> | null> {
  return fetchGQL<APIData<Exploration> | null>({
    query: deleteExplorationMutation(),
    variables: { id },
    onResolve: (x, errors) => errors || x.deleteExploration,
    fallbackResponse: null
  });
}

/** Delete an `ExplorationScene` */
export async function deleteExplorationScene(
  id: number,
  explorationId: number
): Promise<APIData<Exploration> | null> {
  return fetchGQL<APIData<Exploration> | null>({
    query: deleteExplorationSceneMutation(),
    refetchQueries: [
      { query: gql(getExplorationQuery()), variables: { id: explorationId } }
    ],
    variables: { id },
    onResolve: (x, errors) => errors || x.deleteExplorationScene,
    fallbackResponse: null
  }).then((x) => (x?.id ? getExploration(explorationId) : x));
}

// HELPER | prune data for API
const safeString = (v?: string) => v || "";

export function pruneExplorationData(
  data: Partial<UpsertExplorationInput>
): UpsertExplorationInput {
  return {
    id: data.id,
    title: data.title || "Untitled",
    description: safeString(data.description),
    image: safeString(data.image),
    usesAttributes: safeString(data.usesAttributes),
    authorId: data.authorId,
    worldId: data.worldId,
    locationId: data.locationId || null,
    public: data.public || false,
    price: data.price || parseFloat("0.00"),
    Scenes: (data.Scenes || []).map(pruneExplorationSceneData)
  };
}

export function pruneExplorationSceneData(data: UpsertExplorationSceneInput) {
  const d: UpsertExplorationSceneInput = {
    authorId: data.authorId,
    order: data.order,
    title: data.title,
    config: data.config,
    description: safeString(data.description),
    explorationId: data.explorationId,
    background: safeString(data.background),
    foreground: safeString(data.foreground),
    characters: safeString(data.characters)
  };
  if (data.id) d.id = data.id;
  return d as UpsertExplorationSceneInput;
}
