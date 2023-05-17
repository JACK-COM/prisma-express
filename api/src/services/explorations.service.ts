/**
 * @file Explorations.Service
 * @description Database helper service for `Exploration` model
 */
import { Prisma, Exploration, ExplorationScene } from "@prisma/client";
import { context } from "../graphql/context";
import { DateTime } from "luxon";

export type ExplorationUpsertInput = Prisma.ExplorationUpsertArgs["create"] &
  Prisma.ExplorationUpsertArgs["update"] & { id?: number };

export type ExplorationSceneUpsertInput =
  Prisma.ExplorationSceneUpsertArgs["create"] &
    Prisma.ExplorationSceneUpsertArgs["update"] & { id?: number };
type LocationAttrs = Pick<Exploration, "locationId" | "worldId">;
type SearchIds = { id?: number[] };
type SearchExplorationInput = SearchIds &
  Partial<
    LocationAttrs &
      Pick<
        Exploration,
        | "title"
        | "authorId"
        | "description"
        | "public"
        | "locationId"
        | "worldId"
      >
  > & {
    minPrice?: number;
    maxPrice?: number;
    published?: boolean;
    attributes?: string[];
  };
type SearchExplorationSceneInput = SearchIds &
  Partial<
    LocationAttrs &
      Pick<
        ExplorationScene,
        "title" | "authorId" | "explorationId" | "description"
      >
  >;

const { Explorations, ExplorationScenes } = context;
const ExplorationContents: Pick<
  Required<Prisma.ExplorationInclude>,
  "Scenes"
> = {
  Scenes: { orderBy: { order: "asc" } }
};

/** create or update `Exploration` record */
export async function upsertExploration(exploration: ExplorationUpsertInput) {
  const data = { ...exploration };
  const now = DateTime.now().toISO();
  if (!data.id) data.created = now;
  data.lastUpdated = now;
  return exploration.id
    ? Explorations.update({
        data,
        where: { id: exploration.id },
        include: ExplorationContents
      })
    : Explorations.create({ data, include: ExplorationContents });
}

/** create or update `Exploration Scene` records */
export async function upsertExplorationScenes(
  scenes: ExplorationSceneUpsertInput[]
) {
  return Promise.all(scenes.map(upsertExplorationScene));
}

/** create or update `Exploration Scene` record */
export async function upsertExplorationScene(
  scene: ExplorationSceneUpsertInput
) {
  const data = { ...scene };

  // Update parent

  const upsert = scene.id
    ? ExplorationScenes.update({ data, where: { id: scene.id } })
    : ExplorationScenes.create({ data });
  await upsert;

  return Explorations.update({
    data: { lastUpdated: DateTime.now().toISO() },
    where: { id: scene.explorationId }
  }).then(() => upsert);
}

/** find all `Exploration` records matching params */
export async function findAllExplorations(filters: SearchExplorationInput) {
  const where: Prisma.ExplorationWhereInput = findAllWhereInput(filters);
  return Explorations.findMany({ where, include: ExplorationContents });
}

/** find all `Exploration Scene` records matching params */
export async function findAllExplorationScenes(
  filters: SearchExplorationSceneInput
) {
  const where: Prisma.ExplorationSceneWhereInput =
    findAllSceneWhereInput(filters);
  return ExplorationScenes.findMany({ where });
}

/** find `Exploration` record by id */
export async function getExplorationById(id: number) {
  return Explorations.findUnique({
    where: { id },
    include: ExplorationContents
  });
}

/** find `Exploration Scene` record by id */
export async function getExplorationSceneById(id: number) {
  return ExplorationScenes.findUnique({ where: { id } });
}

/** delete `Exploration` record by id */
export async function deleteExploration(id: number) {
  return Explorations.delete({ where: { id }, include: ExplorationContents });
}

/** delete `Exploration Scene` record by id */
export async function deleteExplorationScene(id: number) {
  return ExplorationScenes.delete({ where: { id } });
}

// Build `where` input for search
function findAllWhereInput(filters: SearchExplorationInput) {
  const where: Prisma.ExplorationWhereInput = {};
  where.OR = [];
  if (filters.id) where.id = { in: filters.id };
  if (filters.locationId) where.locationId = filters.locationId;
  if (filters.worldId) where.worldId = filters.worldId;
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.public) where.public = filters.public;
  if (filters.published) where.publishDate = { lte: DateTime.now().toISO() };
  if (filters.maxPrice || filters.minPrice) {
    where.price = {};
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
    if (filters.minPrice) where.price.gte = filters.minPrice;
  }
  const { attributes, title, description } = filters;
  if (title) where.title = { contains: title };
  if (description) where.description = { contains: description };
  if (attributes) {
    where.OR.push(
      ...attributes.map((attr) => ({ usesAttributes: { contains: attr } }))
    );
  }
  if (!where.OR.length) delete where.OR;
  return where;
}

// Build `where` input for search
function findAllSceneWhereInput(filters: SearchExplorationSceneInput) {
  const where: Prisma.ExplorationSceneWhereInput = {};
  const { authorId, title, description } = filters;
  if (authorId) where.authorId = authorId;
  if (title) where.title = { contains: title };
  if (description) where.description = { contains: description };
  return where;
}

export function pruneExplorationData<T extends ExplorationUpsertInput>(
  exploration: T
) {
  const { Scenes, Author, Library, Location, World, ...rest } = exploration;
  return rest as ExplorationUpsertInput;
}

export function pruneExplorationSceneData(scene: any) {
  const { Exploration, ...rest } = scene;
  const args: Partial<ExplorationSceneUpsertInput> = {
    ...rest,
    title: rest.title || "",
    background: rest.background || "",
    foreground: rest.foreground || "",
    characters: rest.characters || "",
    order: rest.order || 1
  };
  if (rest.id) args.id = rest.id;
  if (rest.explorationId) args.explorationId = rest.explorationId;
  if (rest.authorId) args.authorId = rest.authorId;
  return args as ExplorationSceneUpsertInput;
}
