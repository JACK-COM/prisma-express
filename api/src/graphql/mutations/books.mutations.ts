/**
 * @file Books.Mutations.ts
 * @description GraphQL Mutations relating to `Books`.
 */

import { arg, intArg, mutationField, nonNull } from "nexus";
import * as BooksService from "../../services/books.service";
import * as ChaptersService from "../../services/chapters.service";
import { DateTime } from "luxon";

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
    const bookData = BooksService.pruneBookData({
      ...data,
      id: data.id || undefined,
      public: data.public || false
    });
    if (!bookData.authorId) bookData.authorId = user.id;
    const newBook = await BooksService.upsertBook(bookData);

    // create new chapters
    const { chapters = [] } = data;
    if (!chapters?.length) return newBook;

    await ChaptersService.upsertChapters(
      chapters.map((chapter, i) =>
        ChaptersService.pruneChapterData(
          {
            ...chapter,
            authorId: chapter.authorId || user.id,
            bookId: newBook.id
          },
          i
        )
      )
    );

    return BooksService.getBookById(newBook.id);
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
