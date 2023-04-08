/** @file GraphQL Queries */
import { MFUserFragment, MFWorldFragment } from "./fragments";

/** List `Authors` graphql query */
export const listAuthorsQuery = (args = "") =>
  `query { 
    ${args ? `listAuthors(${args}) {` : "listAuthors {"}
      ${MFUserFragment}
    } 
  }`;

/** List `Authors` graphql query */
export const listWorldsQuery = (args: Record<string, any>) =>
  `query ListWorlds(
    $worldId: Int, $authorId: Int, $description: String, $name: String
   ) { 
    listWorlds(
      id: $worldId, 
      authorId: $authorId, 
      description: $description, 
      name: $name) {
      ${MFWorldFragment}
    } 
  }`;
