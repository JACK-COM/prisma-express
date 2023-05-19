/**
 * @file books.graphql.ts
 * @description GraphQL requests relating to `Series`, `Books`, `Chapters`, and `Scenes`.
 */

import { gql } from "@apollo/client";
import fetchGQL from "graphql/fetch-gql";
import {
  deleteBookMutation,
  deleteChapterMutation,
  deleteSeriesMutation,
  deleteSceneMutation,
  upsertBookMutation,
  upsertChapterMutation,
  upsertSeriesMutation,
  upsertSceneMutation,
  publishSeriesMutation,
  publishBookMutation
} from "graphql/mutations";
import {
  getBookQuery,
  getChapterQuery,
  getSceneQuery,
  getSeriesQuery,
  listBooksQuery,
  listChaptersQuery,
  listScenesQuery,
  listSeriesQuery
} from "graphql/queries";
import { APIData, Book, Chapter, Scene, Series } from "utils/types";

/** Data required to create a book */
type ItemId = { id?: number };
type ItemIds = { id?: number[] };
export type UpsertBookData = ItemId & {
  authorId?: number;
  chapters?: UpsertChapterData[];
} & Pick<
    Book,
    | "public"
    | "price"
    | "order"
    | "image"
    | "title"
    | "description"
    | "genre"
    | "seriesId"
    | "worldId"
    | "locationId"
  >;

/** Data required to create a chapter */
export type UpsertChapterData = ItemId & {
  scenes?: UpsertSceneData[];
} & Pick<Chapter, "title" | "authorId" | "order" | "description" | "bookId">;

/** Data required to create a scene */
export type UpsertSceneData =
  | ItemId &
      Pick<
        Scene,
        | "order"
        | "title"
        | "description"
        | "authorId"
        | "chapterId"
        | "characterId"
        | "text"
        | "eventContextId"
        | "timelineId"
        | "chapterId"
      >;

/** Data required to create a series */
export type UpsertSeriesData = ItemId & {
  authorId?: number;
  books?: UpsertBookData[];
} & Pick<Series, "public" | "free" | "title" | "description" | "genre">;

// QUERIES

type ListBookFilters = Partial<
  Omit<UpsertBookData, "public" | "free"> & {
    publicOnly: boolean;
    freeOnly: boolean;
  }
>;
/** Get a list of books with fetchGQL (filtered) */
export async function listBooks(
  filters: ListBookFilters
): Promise<APIData<Book>[]> {
  return fetchGQL<APIData<Book>[]>({
    query: listBooksQuery(),
    variables: { ...filters },
    onResolve(x, errors) {
      return errors || x.listBooks;
    },
    fallbackResponse: []
  });
}

/** Get a single book by ID */
export async function getBook(id: number): Promise<APIData<Book> | null> {
  return fetchGQL<APIData<Book> | null>({
    query: getBookQuery(),
    variables: { id },
    onResolve(x, errors) {
      return errors || x.getBookById;
    },
    fallbackResponse: null
  });
}

type ListChapterFilters = ItemIds &
  Pick<Chapter, "title" | "description" | "bookId" | "authorId">;

/** Get a list of chapters with fetchGQL (filtered) */
export async function listChapters(
  filters: ListChapterFilters
): Promise<APIData<Chapter>[]> {
  return fetchGQL<APIData<Chapter>[]>({
    query: listChaptersQuery(),
    variables: { ...filters },
    onResolve(x, errors) {
      return errors || x.listChapters;
    },
    fallbackResponse: []
  });
}

/** Get a single chapter by ID */
export async function getChapter(id: number): Promise<APIData<Chapter> | null> {
  return fetchGQL<APIData<Chapter> | null>({
    query: getChapterQuery(),
    variables: { id },
    onResolve(x, errors) {
      return errors || x.getChapterById;
    },
    fallbackResponse: null
  });
}

type ListSceneFilters = ItemIds &
  Pick<Scene, "title" | "description" | "authorId" | "text" | "chapterId">;

/** Get a list of scenes with fetchGQL (filtered) */
export async function listScenes(
  filters: ListSceneFilters
): Promise<APIData<Scene>[]> {
  return fetchGQL<APIData<Scene>[]>({
    query: listScenesQuery(),
    variables: { ...filters },
    onResolve(x, errors) {
      return errors || x.listScenes;
    },
    fallbackResponse: []
  });
}

type ListSeriesFilters = Omit<
  UpsertSeriesData,
  "public" | "id" | "books" | "free"
> & { publicOnly: boolean; freeOnly: boolean };

/** Get a list of series with fetchGQL (filtered) */
export async function listSeries(
  filters: ListSeriesFilters
): Promise<APIData<Series>[]> {
  return fetchGQL<APIData<Series>[]>({
    query: listSeriesQuery(),
    variables: { ...filters },
    onResolve(x, errors) {
      return errors || x.listSeries;
    },
    fallbackResponse: []
  });
}

// MUTATIONS

/** Create/update a book with fetchGQL */
export async function upsertBook(data: UpsertBookData): Promise<APIData<Book>> {
  const refetchQueries: any[] = [{ query: listBooksQuery() }];
  if (data.id) {
    refetchQueries.push({ query: getBookQuery(), variables: { id: data.id } });
  }
  if (data.seriesId) {
    refetchQueries.push({
      query: getSeriesQuery(),
      variables: { id: data.seriesId }
    });
  }

  return fetchGQL<APIData<Book>>({
    query: upsertBookMutation(),
    refetchQueries,
    variables: { data },
    onResolve(x, errors) {
      return errors || x.upsertBook;
    },
    fallbackResponse: undefined
  });
}

/** Create/update a chapter with fetchGQL */
export async function upsertChapter(
  data: UpsertChapterData
): Promise<APIData<Chapter>> {
  const refetchQueries: any[] = [
    { query: gql(listChaptersQuery()) },
    { query: gql(getBookQuery()), variables: { id: data.bookId } }
  ];

  return fetchGQL<APIData<Chapter>>({
    query: upsertChapterMutation(),
    refetchQueries,
    variables: { data },
    onResolve(x, errors) {
      return errors || x.upsertChapter;
    },
    fallbackResponse: undefined
  });
}

/** Create/update a scene with fetchGQL */
export async function upsertScene(data: UpsertSceneData) {
  const refetchQueries: any[] = [
    { query: gql(getChapterQuery()), variables: { id: data.chapterId } }
  ];
  const res = await fetchGQL<APIData<Scene>>({
    query: upsertSceneMutation(),
    refetchQueries,
    variables: { data: pruneSceneForAPI(data) },
    onResolve(x, errors) {
      return errors || x.upsertScene;
    },
    fallbackResponse: undefined
  });

  if (typeof res === "string" || !res) return res;
  return getChapter(data.chapterId);
}

/** Fetch a single scene */
export async function getScene(id: number): Promise<APIData<Scene> | null> {
  return fetchGQL<APIData<Scene> | null>({
    query: getSceneQuery(),
    variables: { id },
    onResolve(x, errors) {
      return errors || x.getSceneById;
    },
    fallbackResponse: null
  });
}

/** Create/update a series with fetchGQL */
export async function upsertSeries(
  data: UpsertSeriesData
): Promise<APIData<Series>> {
  const refetchQueries: any[] = [{ query: listSeriesQuery() }];
  if (data.id) {
    refetchQueries.push({
      query: getSeriesQuery(),
      variables: { id: data.id }
    });
  }

  return fetchGQL<APIData<Series>>({
    query: upsertSeriesMutation(),
    refetchQueries,
    variables: { data },
    onResolve(x, errors) {
      return errors || x.upsertSeries;
    },
    fallbackResponse: undefined
  });
}

/** Publish a series with fetchGQL */
export async function publishSeries(id: number): Promise<APIData<Series>> {
  return fetchGQL<APIData<Series>>({
    query: publishSeriesMutation(),
    refetchQueries: [
      { query: listSeriesQuery() },
      { query: getSeriesQuery(), variables: { id } }
    ],
    variables: { id },
    onResolve(x, errors) {
      return errors || x.publishSeries;
    },
    fallbackResponse: undefined
  });
}

/** Publish a book with fetchGQL */
export async function publishBook(id: number): Promise<APIData<Book>> {
  return fetchGQL<APIData<Book>>({
    query: publishBookMutation(),
    refetchQueries: [
      { query: listBooksQuery() },
      { query: getBookQuery(), variables: { id } }
    ],
    variables: { id },
    onResolve(x, errors) {
      return errors || x.publishBook;
    },
    fallbackResponse: undefined
  });
}

/** Delete a book with fetchGQL */
export async function deleteBook(id: number): Promise<APIData<Book>> {
  return fetchGQL<APIData<Book>>({
    query: deleteBookMutation(),
    refetchQueries: [{ query: listBooksQuery() }],
    variables: { id },
    onResolve(x, errors) {
      return errors || x.deleteBook;
    },
    fallbackResponse: undefined
  });
}

/** Delete a chapter with fetchGQL */
export async function deleteChapter(
  id: number,
  bookId: number
): Promise<APIData<Chapter>> {
  return fetchGQL<APIData<Chapter>>({
    query: deleteChapterMutation(),
    refetchQueries: [
      { query: gql(listChaptersQuery()) },
      { query: gql(getBookQuery()), variables: { id: bookId } }
    ],
    variables: { id },
    onResolve: (x, errors) => errors || x.deleteChapter,
    fallbackResponse: undefined
  });
}

/** Delete a scene with fetchGQL */
export async function deleteScene(
  id: number,
  chapterId: number
): Promise<APIData<Chapter> | null> {
  const res = await fetchGQL<APIData<Scene>>({
    query: deleteSceneMutation(),
    refetchQueries: [
      { variables: { id: chapterId }, query: getChapterQuery() }
    ],
    variables: { id },
    onResolve: (x, errors) => errors || x.deleteScene,
    fallbackResponse: undefined
  });

  if (typeof res === "string" || !res) return res;
  return getChapter(res.chapterId);
}

/** Delete a series with fetchGQL */
export async function deleteSeries(id: number): Promise<APIData<Series>> {
  return fetchGQL<APIData<Series>>({
    query: deleteSeriesMutation(),
    refetchQueries: [{ query: listSeriesQuery() }],
    variables: { id },
    onResolve(x, errors) {
      return errors || x.deleteSeries;
    },
    fallbackResponse: undefined
  });
}

// HELPERS

/** Format `Book` data for API */
export function pruneBookForAPI(raw: Partial<UpsertBookData>) {
  const data: UpsertBookData = {
    authorId: raw.authorId,
    locationId: raw.locationId,
    worldId: raw.worldId,
    seriesId: raw.seriesId,
    order: raw.order || 0,
    title: raw.title || "No Title",
    description: raw.description || "No description",
    genre: raw.genre || "No Genre",
    public: raw.public || false,
    price: raw.price || 0.0,
    image: raw.image || undefined
  };
  if (raw.id) data.id = raw.id;
  if (raw.order) data.order = raw.order;
  if (raw.chapters) data.chapters = raw.chapters;
  return data;
}

/** Format `Chapter` data for API */
export function pruneChapterForAPI(raw: Partial<UpsertChapterData>) {
  const data: UpsertChapterData = {
    order: raw.order || 0,
    title: raw.title || "Untitled Chapter",
    bookId: raw.bookId,
    description: raw.description || "No description"
  };
  if (raw.id) data.id = raw.id;
  // if (raw.authorId) data.authorId = raw.authorId;
  if (raw.order) data.order = raw.order;
  if (raw.scenes) data.scenes = raw.scenes;
  return data;
}

/** Format `Scene` data for API */
export function pruneSceneForAPI(
  raw: Partial<UpsertSceneData> & { chapterId: number }
) {
  const order = raw.order || 0;
  const data: UpsertSceneData = {
    order,
    title: raw.title || `Scene ${order + 1}`,
    chapterId: raw.chapterId || 1,
    description: raw.description || "No description",
    text: raw.text || ""
  };
  if (raw.id) data.id = raw.id;
  if (raw.authorId) data.authorId = raw.authorId;
  if (raw.order) data.order = raw.order;
  return data;
}
