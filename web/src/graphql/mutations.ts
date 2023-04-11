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
  deleteWorld(id: $id) {
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

/** Delete a `Location` */
export const deleteLocationMutation = () => `
mutation DeleteLocation($data: Int!) {
  deleteLocation(id: $data) {
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
  deleteCharacter(id: $id) {
    ${MFCharacterFragment}
  }
}`;

/** Create new `Character Relationship` */
export const upsertRelationshipsMutation = () => `
mutation UpsertRelationship($data: [MFRelationshipUpsertInput!]!) {
  upsertRelationships(data: $data) {
    ${MFRelationshipFragment}
  }
}`;

/** Delete a `Character Relationship` */
export const deleteRelationshipMutation = () => `
mutation DeleteRelationship($id: Int!) {
  deleteRelationship(id: $id) {
    ${MFRelationshipFragment}
  }
}`;
