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
export async function findAllLocations(
  filters: Partial<LocationByIdInput & SearchLocationInput>
) {
  const { id, authorId, name, description, worldId } = filters;
  const where: Prisma.LocationFindManyArgs["where"] = { worldId };
  if (filters.parentLocationId)
    where.AND = [{ parentLocationId: filters.parentLocationId }];

  where.OR = [];
  if (authorId) where.OR.push({ authorId });
  if (id) where.OR.push({ id });
  if (name) where.OR.push({ name: { contains: name } });
  if (description) where.OR.push({ description: { contains: description } });
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
