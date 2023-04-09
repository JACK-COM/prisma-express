/** @file GraphQL Mutations */

import {
  MFUserFragment,
  MFWorldFragment,
  MFCharacterFragment,
  MFLocationFragment,
  MFRelationshipFragment
} from "./fragments";

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

/** Delete a `World` */
export const deleteWorldMutation = () => `
mutation DeleteWorld($id: Int!) {
  deleteWorld(data: $data) {
    ${MFWorldFragment}
  }
}`;

/** Create new `Location` */
export const upsertLocationMutation = () => `
mutation UpsertLocation($data: MFLocationUpsertInput!) {
  upsertLocation(data: $data) {
    ${MFLocationFragment}
  }
}`;

/** Create new `Character` */
export const upsertCharacterMutation = () => `
mutation UpsertCharacter($data: MFCharacterUpsertInput!) {
  upsertCharacter(data: $data) {
    ${MFCharacterFragment}
  }
}`;

/** Delete a `Character` */
export const deleteCharacterMutation = () => `
mutation DeleteCharacter($id: Int!) {
  deleteCharacter(data: $data) {
    ${MFCharacterFragment}
  }
}`;

/** Create new `Character Relationship` */
export const upsertRelationshipMutation = () => `
mutation UpsertRelationship($data: MFRelationshipUpsertInput!) {
  upsertRelationship(data: $data) {
    ${MFRelationshipFragment}
  }
}`;

/** Delete a `Character Relationship` */
export const deleteRelationshipMutation = () => `
mutation DeleteCharacter($id: Int!) {
  deleteRelationship(data: $data) {
    ${MFCharacterFragment}
  }
}`;
