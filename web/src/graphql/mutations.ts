/** @file GraphQL Mutations */

import { MFUserFragment } from "./fragments";

/** Create new `User` */
export const createUserMutation = () => `
mutation CreateUser($data: [CreateUserInput]!){
  createUser(data: $data) {
    ${MFUserFragment}
  }
}`;
