/** @file GraphQL Queries */
import {
  MFCharacterFragment,
  MFLocationFragment,
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
      ${MFCharacterFragment}
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
