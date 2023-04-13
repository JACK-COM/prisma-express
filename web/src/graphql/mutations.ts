/** @file GraphQL Mutations */

import {
  MFUserFragment,
  MFWorldFragment,
  MFCharacterFragment,
  MFLocationFragment,
  MFRelationshipFragment,
  MFTimelineFragment,
  MFTimelineEventFragment,
  MFEventFragment
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

/** Create new `Timeline` */
export const upsertTimelineMutation = () => `
mutation UpsertTimeline($data: MFTimelineUpsertInput!) {
  upsertTimeline(data: $data) {
    ${MFTimelineFragment}
  }
}`;

/** Delete a `Timeline` */
export const deleteTimelineMutation = () => `
mutation DeleteTimeline($id: Int!) {
  deleteTimeline(id: $id) {
    ${MFTimelineFragment}
  } 
}`;

/** Create new `Timeline Event` */
export const upsertTimelineEventMutation = () => `
mutation UpsertTimelineEvents($id: Int!, $events: [MFTimelineEventUpsertInput!]) {
  upsertTimelineEvents(id: $id, events: $events) {
    ${MFTimelineEventFragment}
  }
}`;

/** Delete a `Timeline Event` */
export const deleteTimelineEventMutation = () => `
mutation DeleteTimelineEvent($id: Int!) {
  deleteTimelineEvent(id: $id) {
    ${MFTimelineEventFragment}
  }
}`;

/** Create new `Event` */
export const upsertEventMutation = () => `
mutation UpsertEvent($data: [MFEventUpsertInput]!) {
  upsertEvents(data: $data) {
    ${MFEventFragment}
  }
}`;

/** Delete a `Event` */
export const deleteEventMutation = () => `
mutation DeleteEvent($id: Int!) {
  deleteEvent(id: $id) {
    ${MFEventFragment}
  }
}`;
