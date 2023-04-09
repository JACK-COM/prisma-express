/** @file GraphQL Queries */
import { MFLocationFragment, MFUserFragment, MFWorldFragment } from "./fragments";

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
