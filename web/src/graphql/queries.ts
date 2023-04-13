/**
 * @file GraphQL Queries
 * @description This file contains all the GraphQL queries used by the app.
 * If necessary, this file can be refactored to an export root, with queries
 * moved to their own data-specific files (`Character`, `World`, etc).
 */

import {
  MFCharacterFragment,
  MFEventFragment,
  MFLocationFragment,
  MFRelationshipFragment,
  MFTimelineEventFragment,
  MFTimelineFragment,
  MFUserFragment,
  MFWorldFragment
} from "./fragments";

/** List `Authors` graphql query */
export const listAuthorsQuery = (args = "") =>
  `query { 
    ${args ? `listAuthors(${args}) {` : "listAuthors {"}
      ${MFUserFragment}
    } 
  }`;

/** List `Worlds` graphql query */
export const listLocationsQuery = () =>
  `query ListLocations(
    $id: Int, $authorId: Int, $worldId: Int!, $description: String, $name: String
   ) { 
    listLocations(
      id: $id, 
      authorId: $authorId, 
      worldId: $worldId, 
      description: $description, 
      name: $name) {
      ${MFLocationFragment}
    } 
  }`;

/** List `Characters` graphql query */
export const listCharactersQuery = () =>
  `query ListCharacters(
    $id: Int, $authorId: Int, $worldId: Int, $description: String, $name: String
   ) { 
    listCharacters(
      id: $id, 
      authorId: $authorId, 
      worldId: $worldId, 
      description: $description, 
      name: $name) {
      ${MFCharacterFragment}
    } 
  }`;

/** List `Relationships` graphql query */
export const listRelationshipsQuery = () =>
  `query ListRelationships(
    $id: Int, $characterId: Int, $targetId: Int, $relationship: String
   ) { 
    listRelationships(
      id: $id, 
      characterId: $characterId, 
      targetId: $targetId, 
      relationship: $relationship, 
    ) {
      ${MFRelationshipFragment}
    } 
  }`;

/** List `Worlds` graphql query */
export const listWorldsQuery = () =>
  `query ListWorlds(
    $id: Int, $authorId: Int, $description: String, $name: String
   ) { 
    listWorlds(
      id: $id, 
      authorId: $authorId, 
      description: $description, 
      name: $name) {
      ${MFWorldFragment}
    } 
  }`;

/** List `Timelines` graphql query */
export const listTimelinesQuery = () =>
  `query ListTimelines(
    $authorId: Int, $worldId: Int, $name: String
   ) { 
    listTimelines(
      authorId: $authorId, 
      worldId: $worldId, 
      name: $name) {
        ${MFTimelineFragment}
    } 
  }`;

/** List World `Events` graphql query */
export const listWorldEventsQuery = () =>
  `query ListEvents(
    $name: String, $description: String, $worldId: Int, $authorId: Int
   ) { 
    listWorldEvents(
      authorId: $authorId, 
      description: $description,
      worldId: $worldId, 
      name: $name
      ) {
      ${MFEventFragment}
    } 
  }`;

/** List `TimelineEvents` graphql query */
export const listTimelineEventsQuery = () =>
  `query ListTimelineEvents( $timelineId: Int! ) { 
    listTimelineEvents( timelineId: $timelineId ) {
      ${MFTimelineEventFragment}
    } 
  }`;

/** Get `Timeline` by id graphql query */
export const getTimelineQuery = () =>
  `query GetTimeline( $id: Int! ) { 
    getTimelineById( id: $id ) {
      ${MFTimelineFragment}
    } 
  }`;
