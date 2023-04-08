import fetchGQL from "graphql/fetch-gql";
import { upsertWorldMutation } from "graphql/mutations";
import { listWorldsQuery } from "graphql/queries";
import { APIData, World } from "utils/types";

export type CreateWorldData = {
  id?: number;
} & Pick<World, "public" | "name" | "description" | "type">;

// Use fetchGQL to create a `World` on the server
export async function createWorld(data: Partial<CreateWorldData>) {
  const newWorld = await fetchGQL<APIData<World> | null>({
    query: upsertWorldMutation(),
    variables: { data },
    onResolve: ({ upsertWorld: list }) => list,
    fallbackResponse: null
  });

  return newWorld;
}

// Use fetchGQL to list all `Worlds` on the server (with optional filters)
type WorldFilters = Pick<
  APIData<World>,
  "id" | "public" | "name" | "description" | "type"
>;
export async function listWorlds(filters: Partial<WorldFilters> = {}) {
  const newWorld = await fetchGQL<APIData<World>[]>({
    query: listWorldsQuery(filters),
    variables: { ...filters },
    onResolve: ({ listWorlds: list }) => list,
    fallbackResponse: []
  });

  return newWorld;
}
