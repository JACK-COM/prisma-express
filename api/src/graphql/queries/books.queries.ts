/**
 * @file Books.Queries
 * @description GraphQL queries relating to `Series`, `Books`, `Chapters`, and `Scenes`.
 */

import {
  queryField,
  nonNull,
  intArg,
  list,
  stringArg,
  arg,
  booleanArg
} from "nexus";
import * as BooksService from "../../services/books.service";
import * as ChaptersService from "../../services/chapters.service";
import * as SeriesService from "../../services/series.service";
import * as ScenesService from "../../services/scenes.service";
import { checkLibrary } from "../../services/libraries.service";

/**
 * Get a single `Book` by ID
 * @param id Book ID
 * @returns `MFBook` object from service; `null` if not found or not authorized
 * @throws Error if book not found or book is private and user is not the author
 */
export const getBookById = queryField("getBookById", {
  type: "MFBook",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFBook` object from service
   * @throws Error if book not found or book is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const book = await BooksService.getBookById(id);
    const isAuthor = book?.authorId === user?.id;
    // require public book or author
    return !book || !isAuthor ? null : book;
  }
});

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
      if (!book || !book.public) return null;
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
 * Get a single `Series` by ID
 * @param id Series ID
 * @returns `MFSeries` object from service; `null` if not found or not authorized
 * @throws Error if series not found or series is private and user is not the author
 */
export const getSeriesById = queryField("getSeriesById", {
  type: "MFSeries",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns `MFSeries` object from service
   * @throws Error if series not found or series is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const series = await SeriesService.getSeriesById(id);
    const isAuthor = series?.authorId === user?.id;
    // require public series or author
    return !series || !isAuthor ? null : series;
  }
});

/**
 * Search for a list of `Books`
 * @param title Title of book to search for
 * @param genre Genre of book to search for
 * @param authorId Author ID of books to search for
 * @param publicOnly Only return public books
 * @param freeOnly Only return free books
 * @returns List of `MFBook` objects from service
 * @throws Error if book not found or book is private and user is not the author
 */
export const listBooks = queryField("listBooks", {
  type: list("MFBook"),
  args: {
    title: stringArg(),
    genre: stringArg(),
    description: stringArg(),
    seriesId: intArg(),
    authorId: intArg(),
    public: arg({ type: "Boolean", default: false }),
    free: arg({ type: "Boolean", default: false })
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns List of `MFBook` objects from service
   * @throws Error if book not found or book is private and user is not the author
   */
  resolve: async (_, args, { user }) => {
    const { authorId,  } = args;
    const books = await BooksService.findAllBooks({
      title: args.title || undefined,
      genre: args.genre || undefined,
      authorId,
      public: !user || args.public || false,
      free: args.free || false,
      description: args.description || undefined,
      seriesId: args.seriesId || undefined
    });

    // filter out private books if user is not the author
    return books
  }
});

/** List all published books */
export const listBookPublications = queryField("listBookPublications", {
  type: list("MFBook"),
  args: {
    title: stringArg(),
    genre: stringArg(),
    description: stringArg(),
    seriesId: intArg(),
    authorId: intArg(),
    freeOnly: arg({ type: "Boolean", default: false })
  },

  resolve: async (_, args, __dbCtx) => {
    const { authorId, freeOnly } = args;
    return BooksService.findAllPublishedBooks({
      title: args.title || undefined,
      genre: args.genre || undefined,
      authorId,
      public: true,
      free: freeOnly || false,
      description: args.description || undefined,
      seriesId: args.seriesId || undefined
    });
  }
});

/** List all published series */
export const listSeriesPublications = queryField("listSeriesPublications", {
  type: list("MFSeries"),
  args: {
    title: stringArg(),
    genre: stringArg(),
    description: stringArg(),
    authorId: intArg()
  },

  resolve: async (_, args, __dbCtx) => {
    const { authorId } = args;
    return SeriesService.findAllPublishedSeries({
      title: args.title || undefined,
      genre: args.genre || undefined,
      authorId,
      public: true,
      description: args.description || undefined
    });
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
      if (!book.free) {
        const library = await checkLibrary({ userId, bookId });
        if (!library) return [];
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
      include: { Book: { select: { public: true, free: true } } }
    });
    if (!chapter) return [];

    // fetch scenes from db
    const scenes = () =>
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
    if (userId === chapter.authorId) return scenes();
    else if (!chapter.Book.public) return [];

    // Book is public, so check if it's free
    if (chapter.Book.free) return scenes();

    // Book is not free, so check if user has purchased it
    const bookId = chapter.bookId;
    const library = await checkLibrary({ userId, bookId });
    if (library) return scenes();

    // Book is not free and user has not purchased it
    return [];
  }
});

/**
 * List `Series` by search criteria
 * @param title Name of series to search for
 * @param genre Genre of series to search for
 * @param description Description of series to search for
 * @param authorId Only return series by this author
 * @param publicOnly Only return public series
 * @returns List of `MFSeries` objects from service
 * @throws Error if series not found or series is private and user is not the author
 */
export const listSeries = queryField("listSeries", {
  type: list("MFSeries"),
  args: {
    title: stringArg(),
    genre: stringArg(),
    authorId: intArg(),
    publicOnly: booleanArg(),
    freeOnly: booleanArg(),
    description: stringArg()
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx `DBContext` from `src/context.ts`.
   * @returns List of `MFSeries` objects from service
   * @throws Error if series not found or series is private and user is not the author
   */
  resolve: async (_, args, { user }) => {
    const { title, genre, publicOnly, freeOnly, authorId } = args;
    const series = await SeriesService.findAllSeries({
      title: title || undefined,
      genre: genre || undefined,
      authorId,
      public: !user || publicOnly || false,
      free: freeOnly || false,
      description: args.description || undefined
    });

    // filter out private series if user is not the author
    return series.filter(
      (series) => series.authorId === user?.id || series.public
    );
  }
});
