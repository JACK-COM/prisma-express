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
  "name" | "description" | "authorId" | "climate" | "flora" | "fauna"
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
  where: Partial<LocationByIdInput & SearchLocationInput>
) {
  return Locations.findMany({
    where,
    include: { World: { select: { public: true } } }
  });
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
