import fetchGQL from "graphql/fetch-gql";
import { upsertWorldMutation } from "graphql/mutations";
import { World } from "utils/types";

export type CreateWorldData = {
  id?: number;
} & Pick<World, "public" | "name" | "description" | "type">;

// Use fetchGQL to create a `World` on the server
export async function createWorld(data: Partial<CreateWorldData>) {
  const newWorld = await fetchGQL<World | null>({
    query: upsertWorldMutation(),
    variables: { data },
    onResolve: ({ createWorld: list }) => list,
    fallbackResponse: null
  });

  return newWorld;
}
