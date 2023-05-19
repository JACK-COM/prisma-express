/**
 * @file Books.Queries
 * @description GraphQL queries relating to `Chapters`, and `Scenes`.
 */

import { queryField, nonNull, intArg, list, stringArg } from "nexus";
import * as ChaptersService from "../../services/chapters.service";
import * as ScenesService from "../../services/scenes.service";
import { checkLibrary } from "../../services/libraries.service";
import { DateTime } from "luxon";

/**
 * Get a single `Chapter` by ID
 * @param id Chapter ID
 * @returns `MFChapter` object from service; `null` if not found or not authorized
 * @throws Error if chapter not found or chapter is private and user is not the author
 */
export const getChapterById = queryField("getChapterById", {
  type: "MFChapter",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFChapter` object from service
   * @throws Error if chapter not found or chapter is private and user is not the author
   */
  resolve: async (_, { id }, { user, Books }) => {
    const chapter = await ChaptersService.getChapterById(id);
    if (!chapter) return chapter;

    // require public chapter or author
    const isAuthor = chapter.authorId === user?.id;
    if (!user || !isAuthor) {
      const book = await Books.findUnique({ where: { id: chapter.bookId } });
      const returnNull =
        !book ||
        !book.public ||
        !book.publishDate ||
        DateTime.now() < DateTime.fromJSDate(book.publishDate);
      if (returnNull) return null;
    }

    return chapter;
  }
});

/**
 * Get a single `Scene` by ID
 * @param id Scene ID
 * @returns `MFScene` object from service; `null` if not found or not authorized
 * @throws Error if scene not found or scene is private and user is not the author
 */
export const getSceneById = queryField("getSceneById", {
  type: "MFScene",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFScene` object from service
   * @throws Error if scene not found or scene is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const scene = await ScenesService.getSceneById(id);
    const isAuthor = scene?.authorId === user?.id;
    // require public scene or author
    return !scene || !isAuthor ? null : scene;
  }
});

/**
 * List `Chapters` by search criteria. Restricted to specific books
 * @param bookId Book ID to search for
 * @param name Title of chapter to search for
 * @param description Description of chapter to search for
 * @param publicOnly Only return public chapters
 * @returns List of `MFChapter` objects from service
 * @throws Error if chapter not found or chapter is private and user is not the author
 */
export const listChapters = queryField("listChapters", {
  type: list("MFChapter"),
  args: {
    id: list(nonNull(intArg())),
    bookId: nonNull(intArg()),
    authorId: intArg(),
    title: stringArg(),
    description: stringArg()
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns List of `MFChapter` objects from service
   * @throws Error if chapter not found or chapter is private and user is not the author or book is private
   */
  resolve: async (_, args, { user, Books }) => {
    const { bookId, title } = args;
    const userId = user?.id;
    const book = await Books.findUnique({ where: { id: bookId } });
    if (!book) return [];
    const isAuthor = userId === book.authorId;
    if (book.public) {
      // check if book is free or user has purchased it
      if (book.price && !(await checkLibrary({ userId, bookId }))) {
        return [];
      }
    } else if (!isAuthor) return [];

    const chapters = await ChaptersService.findAllChapters({
      id: args.id || undefined,
      bookId,
      title: title || undefined,
      authorId: args.authorId || undefined,
      description: args.description || undefined
    });

    // filter out private chapters if user is not the author
    return chapters;
  }
});

/**
 * List `Scenes` by search criteria. Restricted to specific chapters
 * @param chapterId Chapter ID to search for
 * @param name Title of scene to search for
 * @param description Description of scene to search for
 * @param authorId Only return scenes by this author
 * @param text Text to search for in scene
 * @param id List of scene ids to search for
 * @returns List of `MFScene` objects from service
 * @throws Error if scene not found or scene is private and user is not the author or chapter is private
 */
export const listScenes = queryField("listScenes", {
  type: list("MFScene"),
  args: {
    id: list(nonNull(intArg())),
    chapterId: nonNull(intArg()),
    authorId: intArg(),
    title: stringArg(),
    description: stringArg(),
    text: stringArg()
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns List of `MFScene` objects from service
   * @throws Error if scene not found or scene is private and user is not the author or chapter is private
   */
  resolve: async (_, args, { user, Chapters }) => {
    const { chapterId, title } = args;
    const userId = user?.id;
    const chapter = await Chapters.findUnique({
      where: { id: chapterId },
      include: { Book: { select: { public: true, price: true } } }
    });
    if (!chapter) return [];

    // fetch scenes from db
    const scenesList = () =>
      ScenesService.findAllScenes({
        id: args.id || undefined,
        chapterId,
        title: title || undefined,
        authorId: args.authorId || undefined,
        description: args.description || undefined,
        text: args.text || undefined
      });

    // Return scene if user is the author, or nothing if
    // the book is still private
    if (userId === chapter.authorId) return scenesList();
    else if (!chapter.Book.public) return [];

    // Book is public, so check if it's free
    const isFree = !chapter.Book.price || chapter.Book.price === 0;
    if (isFree) return scenesList();

    // Book is not free, so check if user has purchased it
    const bookId = chapter.bookId;
    const inLibrary = await checkLibrary({ userId, bookId });
    if (inLibrary) return scenesList();

    // Book is not free and user has not purchased it
    return [];
  }
});
