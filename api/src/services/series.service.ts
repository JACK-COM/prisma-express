/**
 * @file Series.Service
 * @description Database helper service for `Series` model
 */

import { Prisma, Series } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertSeriesInput =
  | Prisma.SeriesUpsertArgs["create"] & Prisma.SeriesUpsertArgs["update"];
type SearchSeriesInput = Partial<
  Pick<Series, "id" | "title" | "description" | "genre" | "authorId">
>;
type SeriesByIdInput = Pick<Series, "id">;
const { Series } = context;

/** create series record */
export async function upsertSeries(newSeries: UpsertSeriesInput) {
  const data: UpsertSeriesInput = { ...newSeries };
  return data.id
    ? Series.update({ data, where: { id: newSeries.id } })
    : Series.create({ data });
}

/** create multiple series records */
export async function upsertMultipleSeries(newSeries: UpsertSeriesInput[]) {
  return Promise.all(newSeries.map((series) => upsertSeries(series)));
}

/** find all series records matching params */
export async function findAllSeries(
  where: SeriesByIdInput | SearchSeriesInput
) {
  return Series.findMany({ where });
}

/** find one series record matching params */
export async function getSeries(where: SeriesByIdInput) {
  return Series.findUnique({ where });
}

/** update one series record matching params */
export async function updateSeries(
  where: SeriesByIdInput,
  data: UpsertSeriesInput
) {
  return Series.update({ data, where });
}

/** delete a series */
export async function deleteSeries(where: SeriesByIdInput) {
  return Series.delete({ where });
}
