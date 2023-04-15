/**
 * @file Books.Mutations.ts
 * @description GraphQL Mutations relating to `Series`, `Books`, `Chapters`, and `Paragraphs`.
 */

import { arg, intArg, mutationField, nonNull } from "nexus";
import * as BooksService from "../../services/books.service";
import * as ChaptersService from "../../services/chapters.service";
import * as SeriesService from "../../services/series.service";
import * as ScenesService from "../../services/scenes.service";
import { DateTime } from "luxon";

/**
 * Create or update a new `Series` (and optional books)
 * for a given `User` (Author role) */
export const upsertSeriesMutation = mutationField("upsertSeries", {
  // The GraphQL type returned by this mutation
  type: "MFSeries",

  // Input arguments for this mutation. Every key will be required on the `args` object
  // sent to the mutation by the client
  args: {
    data: nonNull(
      arg({
        type: "MFSeriesUpsertInput",
        description: "The data to create a new series"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFSeries` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a series");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a series");
    }

    const newSeries = await SeriesService.upsertSeries({
      id: data.id || undefined,
      authorId: data.authorId || user.id,
      free: data.free || false,
      public: data.public || false,
      description: data.description,
      genre: data.genre,
      title: data.title
    });

    const { books = [] } = data;
    if (!books?.length) return newSeries;

    // create new books
    await BooksService.upsertBooks(
      books.map((book: any, i) => ({
        ...BooksService.pruneBookData(book, i),
        authorId: newSeries.authorId,
        seriesId: newSeries.id
      }))
    );

    return SeriesService.getSeriesById(newSeries.id);
  }
});

/** Create or update a new `Book` for a given `User` (Author role) */
export const upsertBookMutation = mutationField("upsertBook", {
  // The GraphQL type returned by this mutation
  type: "MFBook",

  // Input arguments for this mutation.
  args: {
    data: nonNull(
      arg({
        type: "MFBookUpsertInput",
        description: "The data to create a new book"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFBook` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication
    if (!user?.id) {
      throw new Error("You must be logged in to create a book");
    }

    // require Author role
    if (user.role !== "Author") {
      throw new Error("Author role required to create a book");
    }

    // Create book
    const newBook = await BooksService.upsertBook({
      ...BooksService.pruneBookData(data),
      id: data.id || undefined,
      authorId: data.authorId || user.id
    });

    // create new chapters
    const { chapters = [] } = data;
    if (!chapters?.length) return newBook;

    await ChaptersService.upsertChapters(
      chapters.map((chapter: any, i) => ({
        ...ChaptersService.pruneChapterData(chapter, i),
        authorId: chapter.authorId || user.id,
        bookId: newBook.id
      }))
    );

    return BooksService.getBookById(newBook.id);
  }
});

/** Create or update a new `Chapter` for a given `User` (Author role) */
export const upsertChapterMutation = mutationField("upsertChapter", {
  // The GraphQL type returned by this mutation
  type: "MFChapter",

  // Input arguments for this mutation.
  args: {
    data: nonNull(
      arg({
        type: "MFChapterUpsertInput",
        description: "The data to create a new chapter"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFChapter` object from service
   */
  resolve: async (_, { data }, { user }) => {
    // require authentication and Author role
    if (!user?.id || user.role !== "Author") {
      throw new Error("Author role required to create a chapter");
    }

    // Create chapter
    const newChapter = await ChaptersService.upsertChapter({
      ...ChaptersService.pruneChapterData(data),
      authorId: data.authorId || user.id,
      bookId: data.bookId || undefined
    });

    // create new scenes
    const { scenes = [] } = data;
    if (!scenes?.length) return newChapter;

    await ScenesService.upsertScenes(
      scenes.map((scene: any, i) => ({
        ...ScenesService.pruneSceneData(scene, i),
        authorId: scene.authorId || user.id,
        chapterId: newChapter.id,
        title: scene.title || "Untitled Scene",
        text: scene.text || "",
        order: scene.order || i + 1
      }))
    );

    return ChaptersService.getChapterById(newChapter.id);
  }
});

/** Create or update a new `Scene` for a given `User` (Author role) */
export const upsertSceneMutation = mutationField("upsertScene", {
  // The GraphQL type returned by this mutation
  type: "MFScene",

  // Input arguments for this mutation.
  args: {
    data: nonNull(
      arg({
        type: "MFSceneUpsertInput",
        description: "The data to create a new scene"
      })
    )
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFScene` object from service
   * @throws Error if user is not logged in or not an Author
   * @throws Error if chapterId is not provided
   */
  resolve: async (_, { data: scene }, { user }) => {
    // require authentication and Author role
    if (!user?.id || user.role !== "Author") {
      throw new Error("Author role required to create a scene");
    }

    // Create scene
    return ScenesService.upsertScene({
      ...ScenesService.pruneSceneData(scene),
      authorId: scene.authorId || user.id,
      chapterId: scene.chapterId,
      title: scene.title || "Untitled Scene",
      text: scene.text || "",
      order: scene.order
    });
  }
});

/** Publish a `Series` for a given `User` (Author role) */
export const publishSeriesMutation = mutationField("publishSeries", {
  // The GraphQL type returned by this mutation
  type: "MFSeries",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFSeries` object from service
   * @throws Error if user is not logged in or not an Author
   */
  resolve: async (_, { id }, { user, Books, Series }) => {
    // require authentication and Author role
    if (!user?.id || user.role !== "Author") {
      throw new Error("Author role required to publish a series");
    }

    // Find series
    const series = await SeriesService.getSeriesById(id);
    if (!series) throw new Error("Series not found");
    // require unpublished series
    else if (series.publishDate) throw new Error("Series is already published");

    // require author/owner
    if (series.authorId !== user.id) {
      throw new Error("You are not the author of this series");
    }

    // require at least one book
    const books = await Books.findMany({ where: { seriesId: id }, take: 1 });
    if (!books?.length) throw new Error("Series does not contain any books");

    // throw error if book does not have content
    await BooksService.checkBookHasContent(books[0]);

    // Publish series
    return await Series.update({
      where: { id },
      data: { publishDate: DateTime.now().toISO() },
      include: { Books: true }
    });
  }
});

/** Publish a `Book` for a given `User` (Author role) */
export const publishBookMutation = mutationField("publishBook", {
  // The GraphQL type returned by this mutation
  type: "MFBook",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFBook` object from service
   */
  resolve: async (_, { id }, { user, Books }) => {
    // require authentication and Author role
    if (!user?.id || user.role !== "Author") {
      throw new Error("Author role required to publish a book");
    }

    // Find book
    const book = await BooksService.getBookById(id);
    if (!book) throw new Error("Book not found");
    // require unpublished book
    else if (book.publishDate) throw new Error("Book is already published");

    // require author/owner
    if (book.authorId !== user.id) {
      throw new Error("You are not the author of this book");
    }

    // throw error if book does not have content
    await BooksService.checkBookHasContent(book);

    // Publish book
    return await Books.update({
      where: { id },
      data: { publishDate: DateTime.now().toISO() },
      include: { Author: true, Chapters: true }
    });
  }
});

/** Delete a `Series` */
export const deleteSeriesMutation = mutationField("deleteSeries", {
  // The GraphQL type returned by this mutation
  type: "MFSeries",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFDeleteResponse` object
   * @throws Error if user is not logged in or not an Author
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user?.id) {
      throw new Error("Unauthenticated user");
    }

    // require author/owner
    const series = await SeriesService.getSeriesById(id);
    if (!series) return null;

    if (series?.authorId !== user.id) {
      throw new Error("You are not the author of this series");
    }

    // Delete series
    return SeriesService.deleteSeries(id);
  }
});

/** Delete a `Book` */
export const deleteBookMutation = mutationField("deleteBook", {
  // The GraphQL type returned by this mutation
  type: "MFBook",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFDeleteResponse` object
   * @throws Error if user is not logged in or not an Author
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user?.id) {
      throw new Error("Unauthenticated user");
    }

    // require author/owner
    const book = await BooksService.getBookById(id);
    if (!book) return null;

    if (book?.authorId !== user.id) {
      throw new Error("You are not the author of this book");
    }

    // Delete book
    return BooksService.deleteBookById(id);
  }
});

/** Delete a `Chapter` */
export const deleteChapterMutation = mutationField("deleteChapter", {
  // The GraphQL type returned by this mutation
  type: "MFChapter",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFDeleteResponse` object
   * @throws Error if user is not logged in or not an Author
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user?.id) {
      throw new Error("Unauthenticated user");
    }

    // require author/owner
    const chapter = await ChaptersService.getChapterById(id);
    if (!chapter) return null;

    if (chapter?.authorId !== user.id) {
      throw new Error("You are not the author of this chapter");
    }

    // Delete chapter
    return ChaptersService.deleteChapterById(id);
  }
});

/** Delete a `Scene` */
export const deleteSceneMutation = mutationField("deleteScene", {
  // The GraphQL type returned by this mutation
  type: "MFScene",

  // Input arguments for this mutation.
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`.
   * @returns `MFDeleteResponse` object
   * @throws Error if user is not logged in or not an Author
   */
  resolve: async (_, { id }, { user }) => {
    // require authentication and Author role
    if (!user?.id) {
      throw new Error("Unauthenticated user");
    }

    // require author/owner
    const scene = await ScenesService.getSceneById(id);
    if (!scene) return null;

    if (scene.authorId !== user.id) {
      throw new Error("You are not the author of this scene");
    }

    // Delete scene
    return ScenesService.deleteScene(id);
  }
});
