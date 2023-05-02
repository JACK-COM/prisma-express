/**
 * @file Users.graphql.ts
 * @description GraphQL requests relating to `Users`.
 */

import fetchGQL from "graphql/fetch-gql";
import { upsertUserMutation } from "graphql/mutations";
import { UserRole } from "utils/types";

export type MicroUser = {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
};
export type UpsertUserData = {
  email?: string;
  displayName?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Upsert a user.
 * @param data User data.
 * @returns User data.
 */
export async function upsertUser(id: number, data: UpsertUserData) {
  console.log({ id, data });
  const res = await fetchGQL<MicroUser | null>({
    query: upsertUserMutation(),
    variables: { id, data },
    onResolve(x, errors) {
      return errors || x.updateUser;
    },
    fallbackResponse: null
  });
  return res;
}
