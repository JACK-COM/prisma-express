/**
 * @file Location.Service
 * @description Database helper service for `Location` model
 */

import { Prisma, Location } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertLocationInput =
  | Prisma.LocationUpsertArgs["create"] & Prisma.LocationUpsertArgs["update"];
type SearchLocationInput = Pick<
  UpsertLocationInput,
  | "name"
  | "description"
  | "parentLocationId"
  | "authorId"
  | "climate"
  | "flora"
  | "fauna"
  | "worldId"
>;
type LocationByIdInput = Pick<Location, "id">;
const { Locations } = context;

/** create location record */
export async function upsertLocation(newLocation: UpsertLocationInput) {
  const data: UpsertLocationInput = { ...newLocation };

  return data.id
    ? Locations.update({ data, where: { id: newLocation.id } })
    : Locations.create({ data });
}

/** find all location records matching params */
export async function findAllLocation(
  filters: Partial<LocationByIdInput & SearchLocationInput>
) {
  const where: Prisma.LocationFindManyArgs["where"] = {
    worldId: filters.worldId
  };
  where.AND = [{ parentLocationId: filters.parentLocationId || null }];
  where.OR = [];
  // const OR: Prisma.LocationFindManyArgs["where"] = {};
  if (filters.authorId) where.OR.push({ authorId: filters.authorId });
  if (filters.id) where.OR.push({ id: filters.id });
  if (filters.name) where.OR.push({ name: { contains: filters.name } });
  if (filters.description)
    where.OR.push({ description: { contains: filters.description } });

  if (!where.OR.length) delete where.OR;

  const locations = await Locations.findMany({ where });
  return locations;
}

/** find one location record matching params */
export async function getLocation(where: LocationByIdInput) {
  return Locations.findUnique({ where });
}

/** update one location record matching params */
export async function updateLocation(
  where: LocationByIdInput,
  data: UpsertLocationInput
) {
  return Locations.update({ data, where });
}

/** delete a location */
export async function deleteLocation(where: LocationByIdInput) {
  return Locations.delete({ where });
}
