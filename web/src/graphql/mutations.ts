/** @file GraphQL Mutations */

import {
  MFUserFragment,
  MFWorldFragment,
  MFBookFragment,
  MFChapterFragment,
  MFCharacterFragment,
  MFContentLinkFragment,
  MFEventFragment,
  MFLocationFragment,
  MFRelationshipFragment,
  MFSceneFragment,
  MFSeriesFragment,
  MFTimelineEventFragment,
  MFTimelineFragment,
  MFExplorationFragment,
  MFExplorationSceneFragment
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

/** Create new `Book` */
export const upsertBookMutation = () => `
mutation UpsertBook($data: MFBookUpsertInput!) {
  upsertBook(data: $data) { 
    ${MFBookFragment}
  }
}`;

/** Delete a `Book` */
export const deleteBookMutation = () => `
mutation DeleteBook($id: Int!) {
  deleteBook(id: $id) {
    ${MFBookFragment}
  }
}`;

/** Create new `Chapter` */
export const upsertChapterMutation = () => `
mutation UpsertChapter($data: MFChapterUpsertInput!) {
  upsertChapter(data: $data) {
    ${MFChapterFragment},
    Scenes { ${MFSceneFragment} }
  }
}`;

/** Delete a `Chapter` */
export const deleteChapterMutation = () => `
mutation DeleteChapter($id: Int!) {
  deleteChapter(id: $id) {
    ${MFChapterFragment}
  }
}`;

/** Create new `Scene` */
export const upsertSceneMutation = () => `
mutation UpsertScene($data: MFSceneUpsertInput!) {
  upsertScene(data: $data) {
    ${MFSceneFragment}
  }
}`;

/** Delete a `Scene` */
export const deleteSceneMutation = () => `
mutation DeleteScene($id: Int!) {
  deleteScene(id: $id) {
    ${MFSceneFragment}
  }
}`;

/** Create new `Book Series` */
export const upsertSeriesMutation = () => `
mutation UpsertSeries($data: [MFSeriesUpsertInput]!) {
  upsertSeries(data: $data) {
    ${MFSeriesFragment}
  }
}`;

/** Delete a `Book Series` */
export const deleteSeriesMutation = () => `
mutation DeleteSeries($id: Int!) {
  deleteSeries(id: $id) {
    ${MFSeriesFragment}
  }
}`;

/** Publish a `Book Series` */
export const publishSeriesMutation = () => `
mutation PublishSeries($id: Int!) {
  publishSeries(id: $id) {
    ${MFSeriesFragment}
  }
}`;

/** Publish a `Book` */
export const publishBookMutation = () => `
mutation PublishBook($id: Int!) {
  publishBook(id: $id) {
    ${MFBookFragment}
  }
}`;

/** Alter a user */
export const upsertUserMutation = () => `
mutation UpdateUser($data: MFUserUpsertInput!, $id: Int!) {
  updateUser(id: $id, data: $data) {
    ${MFUserFragment}
  }
}`;

/** Create multiple `ContentLinks` */
export const upsertContentLinksMutation = () => `
mutation UpsertContentLinks($data: [MFContentLinkUpsertInput!]) {
  upsertContentLinks(data: $data) {
    ${MFContentLinkFragment}
  }
}`;

/** Delete a `ContentLink` */
export const deleteContentLinkMutation = () => `
mutation DeleteContentLink($id: Int!) {
  deleteContentLink(id: $id) {
    ${MFContentLinkFragment}
  }
}`;

/** Create/update an `Exploration` */
export const upsertExplorationMutation = () => `
mutation UpsertExploration($data: MFExplorationUpsertInput!) {
  upsertExploration(data: $data) {
    ${MFExplorationFragment},
    Scenes { ${MFExplorationSceneFragment} }
  }
}`;

/** Create/update an `Exploration Scene` */
export const upsertExplorationSceneMutation = () => `
mutation UpsertExplorationScene($data: MFExplorationSceneUpsertInput!) {
  upsertExplorationScene(data: $data) {
    ${MFExplorationSceneFragment}
  }
}`;

/** Delete an `Exploration` */
export const deleteExplorationMutation = () => `
mutation DeleteExploration($id: Int!) {
  deleteExploration(id: $id) {
    ${MFExplorationFragment}
  }
}`;

/** Delete an `Exploration Scene` */
export const deleteExplorationSceneMutation = () => `
mutation DeleteExplorationScene($id: Int!) {
  deleteExplorationScene(id: $id) {
    ${MFExplorationSceneFragment}
  }
}`;
