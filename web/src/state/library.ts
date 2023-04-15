import createState from "@jackcom/raphsducks";
import { mergeLists } from "utils";
import {
  APIData,
  LibraryPurchase,
  Book,
  Chapter,
  Scene,
  Series
} from "utils/types";

/* Convenience */
type APIPurchase = APIData<LibraryPurchase>;
type APIBook = APIData<Book>;
type APIChapter = APIData<Chapter>;
type APIScene = APIData<Scene>;
type APISeries = APIData<Series>;
/* Convenience */

/**
 * All global state relating to the user's library.
 * This includes `Series`, `Books`, `Chapters`, and `Scenes`.
 */
export const GlobalLibrary = createState({
  /** Currently-selected `Book` */
  focusedBook: null as APIBook | null,
  /** Currently-selected `Chapter` */
  focusedChapter: null as APIChapter | null,
  /** Currently-selected `Scene` */
  focusedScene: null as APIScene | null,
  /** Currently-selected `Series` */
  focusedSeries: null as APISeries | null,
  /** All `Series` */
  series: [] as APISeries[],
  /** All `Books` */
  books: [] as APIBook[],
  /** All `Library Purchases` */
  library: [] as APIPurchase[],
  /** All `Chapters` */
  chapters: [] as APIChapter[],
  /** All `Scenes` */
  scenes: [] as APIScene[]
});

export type GlobalLibraryInstance = ReturnType<typeof GlobalLibrary.getState>;
export type GlobalLibraryInstanceKey = keyof GlobalLibraryInstance;
/** All lists in state */
export type GlobalLibraryListKey =
  | "series"
  | "books"
  | "library"
  | "chapters"
  | "scenes";

//  LIST HELPERS

/**
 * Update list of `Series` in state
 * @param series New `Series`
 * @param replace Replace existing list
 * @returns Updated list of `Series`
 * @see GlobalLibrary
 */
export function updateSeriesState(series: APISeries[], skipUpdate = false) {
  const updates = updateLibraryStateList(series, "series");
  if (!skipUpdate) GlobalLibrary.series(updates);
  return updates;
}

/**
 * Update list of `Books` in state
 * @param books New `Books`
 */
export function updateBooksState(books: APIBook[], skipUpdate = false) {
  const updates = updateLibraryStateList(books, "books");
  if (!skipUpdate) GlobalLibrary.books(updates);
  return updates;
}

/**
 * Update list of `Library Purchases` in state
 * @param lib New `Library Purchases`
 * @param replace Replace existing list
 * @returns Updated list of `Library Purchases`
 * @see GlobalLibrary
 */
export function updateLibrariesState(lib: APIPurchase[], skipUpdate = false) {
  const updates = updateLibraryStateList(lib, "library");
  if (!skipUpdate) GlobalLibrary.library(updates);
  return updates;
}

/**
 * Update list of `Chapters` in state
 * @param chaps New `Chapters`
 * @returns Updated list of `Chapters`
 */
export function updateChaptersState(chaps: APIChapter[], skipUpdate = false) {
  const updates = updateLibraryStateList(chaps, "chapters");
  if (!skipUpdate) GlobalLibrary.chapters(updates);
  return updates;
}

/**
 * Update list of `Scenes` in state
 * @param scenes New `Scenes`
 * @returns Updated list of `Scenes`
 */
export function updateScenesState(scenes: APIScene[], skipUpdate = false) {
  const updates = updateLibraryStateList(scenes, "scenes");
  if (!skipUpdate) GlobalLibrary.scenes(updates);
  return updates;
}

/** Remove a book from state */
export function removeBookFromState(bookId: number) {
  const state = GlobalLibrary.getState();
  const books = state.books.filter((b) => b.id !== bookId);
  GlobalLibrary.books(books);
}

/** Remove a chapter from state */
export function removeChapterFromState(chapterId: number) {
  const state = GlobalLibrary.getState();
  const chapters = state.chapters.filter((c) => c.id !== chapterId);
  GlobalLibrary.chapters(chapters);
}

/** Remove a scene from state */
export function removeSceneFromState(sceneId: number) {
  const state = GlobalLibrary.getState();
  const scenes = state.scenes.filter((s) => s.id !== sceneId);
  GlobalLibrary.scenes(scenes);
}

/** Remove a series from state */
export function removeSeriesFromState(seriesId: number) {
  const state = GlobalLibrary.getState();
  const series = state.series.filter((s) => s.id !== seriesId);
  GlobalLibrary.series(series);
}

/** Remove a library purchase from state */
export function removeLibraryFromState(libraryId: number) {
  const state = GlobalLibrary.getState();
  const library = state.library.filter((l) => l.id !== libraryId);
  GlobalLibrary.library(library);
}

//  MODULE HELPERS

/**
 * Merge a list of items with its state counterpart
 * @param newList New list of items
 * @param listKey Key of list to update
 * @param replace Replace existing list
 * @returns Updated list
 */
function updateLibraryStateList<T>(
  newList: T[],
  listKey: GlobalLibraryListKey
) {
  const state = GlobalLibrary.getState();
  const oldList = state[listKey] as T[];
  return oldList.length ? mergeLists(oldList, newList) : newList;
}
