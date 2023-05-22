/**
 * @file worlds.graphql.ts
 * @description GraphQL requests relating to `Worlds` and `Locations`.
 */
import sortby from "lodash.sortby";
import fetchGQL from "graphql/fetch-gql";
import {
  deleteLocationMutation,
  deleteWorldMutation,
  upsertLocationMutation,
  upsertWorldMutation
} from "graphql/mutations";
import {
  getWorldQuery,
  listWorldsQuery,
  listLocationsQuery,
  getLocationQuery
} from "graphql/queries";
import { APIData, Location, World } from "utils/types";

/** Data required to create a world */
export type CreateWorldData = {
  id?: number;
  authorId?: number;
} & Pick<World, "public" | "name" | "parentWorldId" | "description" | "type">;

/** Data required to create a location */
export type CreateLocationData = {
  id?: number;
  authorId?: number;
} & Pick<
  Location,
  | "name"
  | "description"
  | "climate"
  | "parentLocationId"
  | "type"
  | "flora"
  | "fauna"
  | "worldId"
>;

// Fetch a single `World` by ID
export async function getWorld(worldId: number) {
  return await fetchGQL<APIData<World> | null>({
    query: getWorldQuery(),
    variables: { id: worldId },
    onResolve: ({ getWorld: list }, errors) => errors || list,
    fallbackResponse: null
  });
}

// Use fetchGQL to create a `World` on the server
export async function upsertWorld(raw: Partial<CreateWorldData>) {
  const data = {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    public: raw.public,
    type: raw.type,
    authorId: raw.authorId,
    parentWorldId: raw.parentWorldId || null
  };
  const refetchQueries: any[] = [{ query: listWorldsQuery() }];
  if (raw.id)
    refetchQueries.push({ query: getWorldQuery(), variables: { id: raw.id } });

  const newWorld = await fetchGQL<APIData<World> | null>({
    query: upsertWorldMutation(),
    refetchQueries,
    variables: { data },
    onResolve: ({ upsertWorld: list }, errors) => errors || list,
    fallbackResponse: null
  });

  return newWorld;
}

// Delete a `World` on the server
export async function deleteWorld(worldId: number) {
  const respWorld = await fetchGQL<APIData<World> | null>({
    query: deleteWorldMutation(),
    refetchQueries: [{ query: listWorldsQuery() }],
    variables: { id: worldId },
    onResolve: ({ deleteWorld: list }, errors) => errors || list,
    fallbackResponse: null
  });

  return respWorld;
}

// Fetch a single `Location` by ID
export async function getLocation(locationId: number) {
  const locations = await fetchGQL<APIData<Location>[]>({
    query: getLocationQuery(),
    variables: { id: locationId },
    onResolve: ({ listLocations: list }) => list,
    fallbackResponse: []
  });

  return locations[0];
}

// Use fetchGQL to create a `Location` on the server
export async function upsertLocation(data: Partial<CreateLocationData>) {
  const newLocation = await fetchGQL<APIData<Location> | null>({
    query: upsertLocationMutation(),
    refetchQueries: [
      { query: getWorldQuery(), variables: { id: data.worldId } },
      { query: listLocationsQuery(), variables: { worldId: data.worldId } }
    ],
    variables: { data },
    onResolve: ({ upsertLocation: list }, errors) => errors || list,
    fallbackResponse: null
  });

  return newLocation;
}

// delete a location on the server
export async function deleteLocation(locationId: number, worldId: number) {
  const respLocation = await fetchGQL<APIData<Location> | null>({
    query: deleteLocationMutation(),
    refetchQueries: [
      { query: getWorldQuery(), variables: { id: worldId } },
      { query: listLocationsQuery(), variables: { worldId } }
    ],
    variables: { id: locationId },
    onResolve: ({ deleteLocation: loc }, errors) => errors || loc,
    fallbackResponse: null
  });

  return respLocation;
}

// Use fetchGQL to list all `Worlds` on the server (with optional filters)
type WorldFilters = Pick<
  APIData<World>,
  | "id"
  | "public"
  | "name"
  | "description"
  | "parentWorldId"
  | "type"
  | "authorId"
> & { parentsOnly?: boolean };
export async function listWorlds(filters: Partial<WorldFilters> = {}) {
  const unsortedWorlds = await fetchGQL<APIData<World>[]>({
    query: listWorldsQuery(),
    variables: filters,
    onResolve: ({ listWorlds: list }) => list,
    fallbackResponse: []
  });

  if (!unsortedWorlds?.length) return [];
  if (!filters.authorId) return unsortedWorlds;
  const userWorlds: APIData<World>[] = [];
  const publicWorlds: APIData<World>[] = [];

  unsortedWorlds.forEach((world) => {
    if (world.authorId === filters.authorId) userWorlds.push(world);
    else publicWorlds.push(world);
  });

  return [...sortby(userWorlds, ["public", "name"]), ...publicWorlds];
}

// Use fetchGQL to list all `Locations` on a world (with optional filters)
type LocationFilters = { worldId: number } & Partial<
  Pick<
    APIData<Location>,
    "id" | "name" | "description" | "climate" | "flora" | "fauna"
  >
>;

export async function listLocations(
  filters: LocationFilters = { worldId: -1 }
) {
  const newLocation = await fetchGQL<APIData<Location>[]>({
    query: listLocationsQuery(),
    variables: { ...filters, worldId: filters.worldId },
    onResolve: ({ listLocations: list }) => list,
    fallbackResponse: []
  });

  return newLocation;
}

// Prune location data for API
export function pruneLocationForAPI(data: Partial<CreateLocationData>) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    climate: data.climate,
    parentLocationId: data.parentLocationId,
    type: data.type,
    flora: data.flora,
    fauna: data.fauna,
    worldId: data.worldId
  };
}
