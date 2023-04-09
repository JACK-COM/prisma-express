import fetchGQL from "graphql/fetch-gql";
import { upsertLocationMutation, upsertWorldMutation } from "graphql/mutations";
import {
  listWorldsQuery,
  listAuthorsQuery,
  listLocationsQuery
} from "graphql/queries";
import { APIData, Location, World } from "utils/types";

/** Data required to create a world */
export type CreateWorldData = {
  id?: number;
} & Pick<World, "public" | "name" | "description" | "type">;

/** Data required to create a location */
export type CreateLocationData = {
  id?: number;
} & Pick<
  Location,
  "name" | "description" | "climate" | "flora" | "fauna" | "worldId"
>;

// Use fetchGQL to create a `World` on the server
export async function createOrUpdateWorld(data: Partial<CreateWorldData>) {
  const newWorld = await fetchGQL<APIData<World> | null>({
    query: upsertWorldMutation(),
    variables: { data },
    onResolve: ({ upsertWorld: list }) => list,
    fallbackResponse: null
  });

  return newWorld;
}

// Use fetchGQL to create a `Location` on the server
export async function createOrUpdateLocation(
  data: Partial<CreateLocationData>
) {
  const newLocation = await fetchGQL<APIData<Location> | null>({
    query: upsertLocationMutation(),
    variables: { data },
    onResolve: ({ upsertLocation: list }) => list,
    fallbackResponse: null
  });

  return newLocation;
}

// Use fetchGQL to list all `Worlds` on the server (with optional filters)
type WorldFilters = Pick<
  APIData<World>,
  "id" | "public" | "name" | "description" | "type"
>;
export async function listWorlds(filters: Partial<WorldFilters> = {}) {
  const newWorld = await fetchGQL<APIData<World>[]>({
    query: listWorldsQuery(),
    variables: { ...filters },
    onResolve: ({ listWorlds: list }) => list,
    fallbackResponse: []
  });

  return newWorld;
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
