/** @file GraphQL Mutations */

import { MFUserFragment, MFWorldFragment } from "./fragments";

/** Create new `User` */
export const createUserMutation = () => `
mutation CreateUser($data: [CreateUserInput]!){
  createUser(data: $data) {
    ${MFUserFragment}
  }
}`;

/** Create new `World` */
export const upsertWorldMutation = () => `
mutation UpsertWorld($data: MFWorldUpsertInput!) {
  upsertWorld(data: $data) {
    ${MFWorldFragment}
  }
}`;
