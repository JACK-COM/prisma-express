/**
 * @file Location.Service
 * @description Database helper service for `Location` model
 */

import { Prisma, Location } from "@prisma/client";
import { context } from "../graphql/context";

type CreateLocationInput = 
    | Prisma.LocationUpsertArgs["create"] & Prisma.LocationUpsertArgs["update"];
type SearchLocationInput = Pick<CreateLocationInput, "name" | "description">;
type LocationByIdInput = Pick<Location, "id">;
const { Locations } = context;

/** create location record */
export async function upsertLocation(newLocation: CreateLocationInput) {
    const data: CreateLocationInput = { ...newLocation };

    return Locations.upsert({
        create: data,
        update: data,
        where: { id: newLocation.id }
    });
}

/** find all location records matching params */
export async function findAllLocation(where: LocationByIdInput | SearchLocationInput) {
    return Locations.findMany({ where });
}

/** find one location record matching params */
export async function getLocation(where: LocationByIdInput) {
    return Locations.findUnique({ where });
}

/** update one location record matching params */
export async function updateLocation(
    where: LocationByIdInput,
    data: CreateLocationInput
) {
    return Locations.update({ data, where });
}

/** delete a location */
export async function deleteLocation(where: LocationByIdInput) {
    return Locations.delete({ where });
}