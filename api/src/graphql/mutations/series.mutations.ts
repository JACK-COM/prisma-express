/**
 * @file Series.Mutations.ts
 * @description GraphQL Mutations relating to `Series`.
 */

import { arg, intArg, mutationField, nonNull } from "nexus";
import * as BooksService from "../../services/books.service";
import * as SeriesService from "../../services/series.service";
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
      price: data.price || 0.0,
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
