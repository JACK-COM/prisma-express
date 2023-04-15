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
    | "free"
    | "genre"
    | "publishDate"
    | "authorId"
  >
>;

const { Series } = context;

/** create series record */
export async function upsertSeries(newSeries: UpsertSeriesInput) {
  const data: UpsertSeriesInput = { ...newSeries };
  const now = DateTime.now().toISO();
  data.created = newSeries.created || now;
  data.lastUpdated = DateTime.now().toISO();
  data.publishDate = newSeries.publishDate || null;

  return data.id
    ? Series.update({
        data,
        where: { id: newSeries.id },
        include: { Books: true }
      })
    : Series.create({ data, include: { Books: true } });
}

/** find all series records matching params */
export async function findAllSeries(filters: SearchSeriesInput) {
  const where: Prisma.SeriesWhereInput = {};
  if (filters.id) where.id = filters.id;
  if (filters.title) where.title = { contains: filters.title };
  if (filters.description)
    where.description = { contains: filters.description };
  if (filters.genre) where.genre = { contains: filters.genre };
  if (filters.authorId) where.authorId = filters.authorId;

  return Series.findMany({ where, include: { Books: true } });
}

/** find one series record matching params */
export async function getSeriesById(id: Series["id"]) {
  return Series.findUnique({ where: { id }, include: { Books: true } });
}

/** delete a series */
export async function deleteSeries(id: number) {
  return Series.delete({ where: { id }, include: { Books: true } });
}
