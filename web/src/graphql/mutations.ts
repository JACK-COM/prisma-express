/** @file GraphQL Mutations */

import { MFUserFragment, MFWorldFragment, MFLocationFragment } from "./fragments";

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

/** Create new `World` */
export const upsertLocationMutation = () => `
mutation UpsertLocation($data: MFLocationUpsertInput!) {
  upsertLocation(data: $data) {
    ${MFLocationFragment}
  }
}`;
