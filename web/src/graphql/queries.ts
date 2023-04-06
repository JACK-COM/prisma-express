/** @file GraphQL Queries */
import { MFUserFragment } from "./fragments";

/** List `Authors` graphql query */
export const listAuthorsQuery = (args = "") =>
  `query { 
    ${args ? `listAuthors(${args}) {` : "listContentTags {"}
      ${MFUserFragment}
    } 
  }`;
