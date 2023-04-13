/**
 * @file PopulationGroup.Service
 * @description Database helper service for `PopulationGroup` model
 */

import { Prisma, PopulationGroup } from "@prisma/client";
import { context } from "../graphql/context";

type PGroupUpsert = Prisma.PopulationGroupUpsertArgs;
type UpsertPopulationGroupInput =
  | PGroupUpsert["create"] & PGroupUpsert["update"];
type SearchPopulationGroupInput = Partial<
  Pick<
    PopulationGroup,
    "name" | "description" | "type" | "locationId" | "worldId" | "authorId"
  >
> &
  Pick<UpsertPopulationGroupInput, "id">;
type PopulationGroupByIdInput = Pick<PopulationGroup, "id">;
const { PopulationGroups } = context;

/** create `PopulationGroup` record */
export async function upsertPopulationGroup(
  newPopulationGroup: UpsertPopulationGroupInput
) {
  const data: UpsertPopulationGroupInput = { ...newPopulationGroup };
  return data.id
    ? PopulationGroups.update({
        data,
        where: { id: newPopulationGroup.id }
      })
    : PopulationGroups.create({ data });
}

/** create multiple `PopulationGroup` records */
export async function upsertMultiplePopulationGroups(
  newPopulationGroups: UpsertPopulationGroupInput[]
) {
  return Promise.all(
    newPopulationGroups.map((populationGroup) =>
      upsertPopulationGroup(populationGroup)
    )
  );
}

/** find all `PopulationGroup` records matching params */
export async function findAllPopulationGroup(
  filters: SearchPopulationGroupInput
) {
  const where: Prisma.PopulationGroupWhereInput = {};
  const { id, type, description, locationId, worldId, authorId, name } =
    filters;
  if (id) where.id = id;
  if (name) where.name = { contains: name };
  if (description) where.description = { contains: description };
  if (type) where.type = type;
  if (authorId) where.authorId = authorId;
  if (locationId) where.locationId = locationId;
  if (worldId) where.worldId = worldId;

  return PopulationGroups.findMany({ where });
}

/** find one `PopulationGroup` record matching params */
export async function getPopulationGroup(where: PopulationGroupByIdInput) {
  return PopulationGroups.findUnique({ where });
}

/** update one `PopulationGroup` record matching params */
export async function updatePopulationGroup(
  where: PopulationGroupByIdInput,
  data: UpsertPopulationGroupInput
) {
  return PopulationGroups.update({ data, where });
}

/** delete a `PopulationGroup` */
export async function deletePopulationGroup(where: PopulationGroupByIdInput) {
  return PopulationGroups.delete({ where });
}
