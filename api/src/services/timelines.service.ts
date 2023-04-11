/**
 * @file Timeline.Service
 * @description Database helper service for `Timeline` model
 */
import { Prisma, Timeline } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertTimelineInput =
  | Prisma.TimelineUpsertArgs["create"] & Prisma.TimelineUpsertArgs["update"];
type SearchTimelineInput = Partial<
  Pick<Timeline, "name" | "authorId" | "worldId" | "id">
>;
type TimelineByIdInput = Pick<Timeline, "id">;
const { Timelines } = context;

/** create timeline record */
export async function upsertTimeline(tl: UpsertTimelineInput) {
  const data: UpsertTimelineInput = { ...tl };

  return data.id
    ? Timelines.update({ data, where: { id: data.id } })
    : Timelines.create({ data });
}

/** find all timeline records matching params */
export async function findAllTimelines(filter: SearchTimelineInput) {
  const { id, name, authorId, worldId } = filter;
  const where: Prisma.TimelineWhereInput = {};
  if (id) where.id = id;
  if (name) where.name = { contains: name, mode: "insensitive" };
  if (authorId) where.authorId = authorId;
  if (worldId) where.worldId = worldId;

  return Timelines.findMany({ where, include: { TimelineEvents: true } });
}

/** find one timeline record matching params */
export async function getTimeline(where: TimelineByIdInput) {
  return Timelines.findUnique({ where, include: { TimelineEvents: true } });
}

/** update one timeline record matching params */
export async function updateTimeline(
  where: TimelineByIdInput,
  data: UpsertTimelineInput
) {
  return Timelines.update({ data, where });
}

/** delete a timeline */
export async function deleteTimeline(where: TimelineByIdInput) {
  return Timelines.delete({ where });
}
