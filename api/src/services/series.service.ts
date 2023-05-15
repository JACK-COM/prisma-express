/**
 * @file Series.Service
 * @description Database helper service for `Series` model
 */

import { Prisma, Series } from "@prisma/client";
import { context } from "../graphql/context";
import { DateTime } from "luxon";

type UpsertSeriesInput =
  | Prisma.SeriesUpsertArgs["create"] & Prisma.SeriesUpsertArgs["update"];
type SearchSeriesInput = Partial<
  Pick<
    Series,
    | "id"
    | "title"
    | "description"
    | "public"
    | "genre"
    | "publishDate"
    | "authorId"
  >
> & {
  minPrice?: number;
  maxPrice?: number;
  published?: boolean;
  free?: boolean;
};

const { Series } = context;
// const SeriesInclude: Prisma.SeriesInclude = { Books: true };
const SeriesInclude: Pick<Required<Prisma.SeriesInclude>, "Books"> = {
  Books: true
};

/** create series record */
export async function upsertSeries(newSeries: UpsertSeriesInput) {
  const data: UpsertSeriesInput = { ...newSeries };
  const now = DateTime.now().toISO();
  if (!data.id) data.created = now;
  data.lastUpdated = DateTime.now().toISO();
  data.publishDate = newSeries.publishDate || null;

  return data.id
    ? Series.update({
        data,
        where: { id: newSeries.id },
        include: SeriesInclude
      })
    : Series.create({ data, include: SeriesInclude });
}

/** find all series records matching params */
export async function findAllSeries(filters: SearchSeriesInput) {
  const where: Prisma.SeriesWhereInput = buildWhereInput(filters);
  return Series.findMany({ where, include: SeriesInclude });
}

/** find all published `Series` records matching params */
export async function findAllPublishedSeries(filters: SearchSeriesInput) {
  const where: Prisma.SeriesWhereInput = buildWhereInput(filters);
  where.publishDate = { lte: DateTime.now().toISO() };
  return Series.findMany({ where, include: SeriesInclude });
}

function buildWhereInput(filters: SearchSeriesInput) {
  const where: Prisma.SeriesWhereInput = {};
  if (filters.id) where.id = filters.id;
  if (filters.title) where.title = { contains: filters.title };
  if (filters.description)
    where.description = { contains: filters.description };
  if (filters.genre) where.genre = { contains: filters.genre };
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.published) where.publishDate = { lte: DateTime.now().toISO() };

  const { minPrice, maxPrice, free = false } = filters;
  where.OR = [];
  if (free) where.OR.push({ price: 0 }, { price: null });
  if (minPrice || maxPrice || filters.free !== undefined) {
    where.price = {};
    if (minPrice) where.price.gte = filters.minPrice;
    if (maxPrice) where.price.lte = filters.maxPrice;
  }

  if (!where.OR.length) delete where.OR;
  return where;
}

/** find one series record matching params */
export async function getSeriesById(id: Series["id"]) {
  return Series.findUnique({ where: { id }, include: SeriesInclude });
}

/** delete a series */
export async function deleteSeries(id: number) {
  return Series.delete({ where: { id }, include: SeriesInclude });
}
