/**
 * @file books.graphql.ts
 * @description GraphQL requests relating to `Series`, `Books`, `Chapters`, and `Scenes`.
 */

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
    | "free"
    | "order"
    | "image"
    | "title"
    | "description"
    | "genre"
    | "seriesId"
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
> & {
  publicOnly: boolean;
  freeOnly: boolean;
};

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
  return fetchGQL<APIData<Book>>({
    query: upsertBookMutation(),
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
  return fetchGQL<APIData<Chapter>>({
    query: upsertChapterMutation(),
    variables: { data },
    onResolve(x, errors) {
      return errors || x.upsertChapter;
    },
    fallbackResponse: undefined
  });
}

/** Create/update a scene with fetchGQL */
export async function upsertScene(data: UpsertSceneData) {
  const res = await fetchGQL<APIData<Scene>>({
    query: upsertSceneMutation(),
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
  return fetchGQL<APIData<Series>>({
    query: upsertSeriesMutation(),
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
    variables: { id },
    onResolve(x, errors) {
      return errors || x.deleteBook;
    },
    fallbackResponse: undefined
  });
}

/** Delete a chapter with fetchGQL */
export async function deleteChapter(id: number): Promise<APIData<Chapter>> {
  return fetchGQL<APIData<Chapter>>({
    query: deleteChapterMutation(),
    variables: { id },
    onResolve(x, errors) {
      return errors || x.deleteChapter;
    },
    fallbackResponse: undefined
  });
}

/** Delete a scene with fetchGQL */
export async function deleteScene(
  id: number
): Promise<APIData<Chapter> | null> {
  const res = await fetchGQL<APIData<Scene>>({
    query: deleteSceneMutation(),
    variables: { id },
    onResolve(x, errors) {
      return errors || x.deleteScene;
    },
    fallbackResponse: undefined
  });

  if (typeof res === "string" || !res) return res;
  return getChapter(res.chapterId);
}

/** Delete a series with fetchGQL */
export async function deleteSeries(id: number): Promise<APIData<Series>> {
  return fetchGQL<APIData<Series>>({
    query: deleteSeriesMutation(),
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
    seriesId: raw.seriesId,
    order: raw.order || 0,
    title: raw.title || "No Title",
    description: raw.description || "No description",
    genre: raw.genre || "No Genre",
    public: raw.public || false,
    free: raw.free || false,
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
