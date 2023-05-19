/**
 * @file GraphQL Queries
 * @description This file contains all the GraphQL queries used by the app.
 * If necessary, this file can be refactored to an export root, with queries
 * moved to their own data-specific files (`Character`, `World`, etc).
 */

import {
  MFBookFragment,
  MFChapterFragment,
  MFCharacterFragment,
  MFContentLinkFragment,
  MFEventFragment,
  MFExplorationFragment,
  MFExplorationSceneFragment,
  MFLocationFragment,
  MFRelationshipFragment,
  MFSceneFragment,
  MFSearchResultFragment,
  MFSeriesFragment,
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

/** Get `Location` graphql query */
export const getLocationQuery = () =>
  `query GetLocation($id: Int!) {
    getLocationById(id: $id) {
      ${MFLocationFragment},
      Children { ${MFLocationFragment} },
    }
  }`;

/** List `Series` */
export const listSeriesQuery = () =>
  `query ListSeries(
    $authorId: Int, $description: String, $title: String, $genre: String
    ) { 
      listSeries(
        authorId: $authorId,
        description: $description,
        genre: $genre,
        title: $title
      ) {
        ${MFSeriesFragment}
      }
    }`;

/** Get `Series` */
export const getSeriesQuery = () =>
  `query GetSeries($id: Int!) {
    getSeries(id: $id) {
      ${MFSeriesFragment},
      Books {
        ${MFBookFragment}
      }
    }
  }`;

/** List `Books` */
export const listBooksQuery = () =>
  `query ListBooks(
    $title: String, $genre: String, $description: String, $authorId: Int, $seriesId: Int, $public: Boolean, $free: Boolean
    ) {
      listBooks(
        title: $title,
        genre: $genre,
        description: $description,
        authorId: $authorId,
        seriesId: $seriesId,
        public: $public,
        free: $free
      ) {
        ${MFBookFragment}
      }
    }`;

/** Get `Book` */
export const getBookQuery = () =>
  `query GetBook($id: Int!) {
    getBookById(id: $id) {
      ${MFBookFragment}
      Chapters {
        ${MFChapterFragment},
        Scenes { ${MFSceneFragment} }
      }
    }
  }`;

/** List `Chapters` */
export const listChaptersQuery = () =>
  `query ListChapters(
    $id: Int, $authorId: Int, $bookId: Int, $description: String, $title: String
    ) {
      listChapters(
        id: $id,
        authorId: $authorId,
        bookId: $bookId,
        description: $description,
        title: $title
      ) {
        ${MFChapterFragment}
      }
    }`;

/** Get `Chapter` */
export const getChapterQuery = () =>
  `query GetChapter($id: Int!) {
    getChapterById(id: $id) {
      ${MFChapterFragment},
      Scenes { ${MFSceneFragment}, Links { ${MFContentLinkFragment} } }
    }
  }`;

/** List `Scenes` */
export const listScenesQuery = () =>
  `query ListScenes(
    $id: Int, $authorId: Int, $chapterId: Int, $description: String, $title: String  
    ) {
      listScenes(
        id: $id,
        authorId: $authorId,
        chapterId: $chapterId,
        description: $description,
        title: $title
      ) {
        ${MFSceneFragment}
      }
    }`;

/** Get `Scene` */
export const getSceneQuery = () =>
  `query GetScene($id: Int!) {  
    getSceneById(id: $id) {
      ${MFSceneFragment}
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
    $id: Int, $authorId: Int, $parentWorldId: Int, $parentsOnly: Boolean, $description: String, $name: String, $public: Boolean
   ) { 
    listWorlds(
      id: $id, 
      authorId: $authorId, 
      description: $description, 
      name: $name,
      parentWorldId: $parentWorldId,
      parentsOnly: $parentsOnly,
      public: $public) {
      ${MFWorldFragment}
    } 
  }`;

/** Get `World` by Id */
export const getWorldQuery = () =>
  `query GetWorld($id: Int!) {
    getWorld(id: $id) {
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

/** Get `ContentLink` by id graphql query */
export const getContentLinkQuery = () =>
  `query GetContentLink( $id: Int! ) { 
    getContentLink( id: $id ) {
      ${MFContentLinkFragment}
    } 
  }`;

/** List `ContentLinks` graphql query */
export const listContentLinksQuery = () =>
  `query ListContentLinks(
    $id: Int, $authorId: Int, $sceneId: Int, $chapterId: Int, $bookId: Int, $seriesId: Int, $text: String
   ) { 
    listContentLinks(
      id: $id, 
      authorId: $authorId, 
      sceneId: $sceneId,
      chapterId: $chapterId,
      bookId: $bookId,
      seriesId: $seriesId,
      text: $text
      ) {
      ${MFContentLinkFragment}
    } 
  }`;

/** Get user */
export const getUserQuery = () =>
  `query GetUser {
    getAuthUser { ${MFUserFragment} }
  }`;

/** Search titles */
export const searchTitlesQuery = () =>
  `query SearchPublications(
    $title: String,
    $genre: String,
    $description: String,
    $seriesId: Int,
    $authorId: Int,
    $freeOnly: Boolean
  ) {
    searchPublications(
      title: $title,
      genre: $genre,
      description: $description,
      seriesId: $seriesId,
      authorId: $authorId,
      freeOnly: $freeOnly
    ) {
      ${MFSearchResultFragment}
    }
  }`;

/** List `Explorations` */
export const listExplorationsQuery = () =>
  `query ListExplorations(
    $id: Int, $authorId: Int, $locationId: Int, $worldId: Int, $attributes: [String!], $description: String, $title: String
    ) {
      listExplorations(
        id: $id,
        authorId: $authorId,
        worldId: $worldId,
        locationId: $locationId,
        attributes: $attributes,
        description: $description,
        title: $title
      ) {
        ${MFExplorationFragment}
      }
    }`;

/** Get `Exploration` by id */
export const getExplorationQuery = () =>
  `query GetExploration($id: Int!) {  
    getExploration(id: $id) {
      ${MFExplorationFragment},
      Scenes { ${MFExplorationSceneFragment} }
    }
  }`;

/** Get `Exploration Scene` */
export const getExplorationSceneQuery = () =>
  `query GetExplorationScene($id: Int!) {  
    getExplorationScene(id: $id) {
      ${MFExplorationSceneFragment}
    }
  }`;

/** Get `Exploration Scene` */
export const listExplorationScenesQuery = () =>
  `query ListExplorationScenes($explorationId: Int!) {  
    listExplorationScenes(explorationId: $explorationId) {
      ${MFExplorationSceneFragment}
    }
  }`;
