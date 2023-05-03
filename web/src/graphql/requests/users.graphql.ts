/**
 * @file Users.graphql.ts
 * @description GraphQL requests relating to `Users`.
 */

import fetchGQL from "graphql/fetch-gql";
import { upsertUserMutation } from "graphql/mutations";
import { APIData, User } from "utils/types";

export type MicroUser = Pick<
  APIData<User>,
  "email" | "id" | "displayName" | "role"
>;
export type UpsertUserData = {
  firstName?: string;
  lastName?: string;
} & Partial<Pick<User, "email" | "displayName" | "image">>;

/**
 * Upsert a user.
 * @param data User data.
 * @returns User data.
 */
export async function upsertUser(id: number, data: UpsertUserData) {
  const res = await fetchGQL<MicroUser | null>({
    query: upsertUserMutation(),
    variables: { id, data },
    fallbackResponse: null,
    onResolve: (x, errors) => errors || x.updateUser
  });
  return res;
}
