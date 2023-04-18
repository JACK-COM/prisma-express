/**
 * @file Libraries.Service
 * @description Database helper service for `Libraries` model
 */

import { Prisma, Library } from "@prisma/client";
import { context } from "../graphql/context";
import { DateTime } from "luxon";

type UpsertLibraryInput =
  | Prisma.LibraryUpsertArgs["create"] & Prisma.LibraryUpsertArgs["update"];
type SearchLibraryInput = Partial<
  Pick<Library, "id" | "userId" | "seriesId" | "publicPurchase" | "bookId">
> & { id?: Library["id"][]; beforeDate?: Date; afterDate?: Date };
type LibraryByIdInput = Pick<Library, "id">;

const { Libraries } = context;

/** create `Library` record */
export async function upsertLibrary(newLibrary: UpsertLibraryInput) {
  const data: UpsertLibraryInput = { ...newLibrary };
  data.purchaseDate = data.purchaseDate || DateTime.now().toISO();
  return data.id
    ? Libraries.update({
        data,
        where: { id: newLibrary.id },
        include: { Book: true, Series: true }
      })
    : Libraries.create({ data, include: { Book: true, Series: true } });
}

/** create `Library` records */
export async function upsertLibraries(newLibraries: UpsertLibraryInput[]) {
  return newLibraries.map(upsertLibrary);
}

/** find all `Library` records matching params */
export async function findAllLibraries(filters: SearchLibraryInput) {
  const where: Prisma.LibraryWhereInput = {};
  if (filters.id) where.id = { in: filters.id };
  if (filters.userId) where.userId = filters.userId;
  if (filters.bookId) where.bookId = filters.bookId;
  if (filters.seriesId) where.seriesId = filters.seriesId;
  if (filters.publicPurchase) where.publicPurchase = filters.publicPurchase;

  const AND: Prisma.LibraryWhereInput["AND"] = [];
  if (filters.beforeDate)
    AND.push({ purchaseDate: { lt: filters.beforeDate } });
  if (filters.afterDate) AND.push({ purchaseDate: { gt: filters.afterDate } });
  if (AND.length) where.AND = AND;

  return Libraries.findMany({ where, include: { Book: true, Series: true } });
}

/** find one `Library` record by id */
export async function getLibraryById(id: LibraryByIdInput["id"]) {
  return Libraries.findUnique({
    where: { id },
    include: { Book: true, Series: true }
  });
}

/** delete one `Library` record matching params */
export async function deleteLibraryById(id: LibraryByIdInput["id"]) {
  return Libraries.delete({ where: { id } });
}

/** opts for checking if a user `Library` contains an item */
type CheckLibraryInput = {
  userId?: Library["userId"] | null;
  bookId?: Library["bookId"] | null;
  seriesId?: Library["seriesId"] | null;
};

/** Check if a user `Library` contains an item */
export async function checkLibrary(opts: CheckLibraryInput) {
  if (!opts.userId) return null;
  else if (!opts.bookId && !opts.seriesId) return null;
  const where: Prisma.LibraryWhereInput = { userId: opts.userId };
  if (opts.bookId) where.bookId = opts.bookId;
  if (opts.seriesId) where.seriesId = opts.seriesId;

  return Libraries.findFirst({ where });
}
