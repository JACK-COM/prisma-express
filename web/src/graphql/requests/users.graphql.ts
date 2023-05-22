/**
 * @file Users.graphql.ts
 * @description GraphQL requests relating to `Users`.
 */

import fetchGQL from "graphql/fetch-gql";
import { upsertUserMutation } from "graphql/mutations";
import { getUserQuery } from "graphql/queries";
import { APIData, User, FileUploadCategory } from "utils/types";

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
    refetchQueries: [{ query: getUserQuery() }],
    fallbackResponse: null,
    onResolve: (x, errors) => errors || x.updateUser
  });
  return res;
}

/**
 * List user's AWS image files
 * @param category Image category
 * @returns List of image files
 */
export async function listUserFiles(category: FileUploadCategory) {
  const res = await fetchGQL<string[]>({
    query: `query { listUserFiles } `,
    variables: { category },
    fallbackResponse: [],
    onResolve: (x, errors) => errors || x.listUserFiles
  });
  return res;
}
