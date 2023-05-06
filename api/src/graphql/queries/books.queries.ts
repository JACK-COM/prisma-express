/**
 * @file Books.Queries
 * @description GraphQL queries relating to `Series` and `Books`.
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
import * as SeriesService from "../../services/series.service";
import { checkLibrary } from "../../services/libraries.service";
import { DateTime } from "luxon";

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
    const [book, inLibrary] = await Promise.all([
      BooksService.getBookById(id),
      checkLibrary({ bookId: id, userId: user?.id })
    ]);
    // require public book or author
    if (!book || (user && book.authorId === user?.id)) return book;

    // allow scenes if published or in library
    if (book.publishDate || book.public) {
      const isPublished = book.publishDate
        ? DateTime.now() > DateTime.fromJSDate(book.publishDate)
        : false;
      const allowScenes = book.public && (isPublished || inLibrary);
      if (allowScenes) return book;
      const Chapters = book.Chapters?.map((c) => ({ ...c, Scenes: [] })) || [];
      return { ...book, Chapters };
    }

    // remove scenes
    return null;
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
    const { authorId } = args;
    const books = await BooksService.findAllBooks({
      title: args.title || undefined,
      genre: args.genre || undefined,
      authorId,
      public: !user || args.public || undefined,
      free: args.free || undefined,
      description: args.description || undefined,
      seriesId: args.seriesId || undefined
    });

    // filter out private books if user is not the author
    return books;
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
