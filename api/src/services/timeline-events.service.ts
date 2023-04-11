/**
 * @file TimelineEvent.Service
 * @description Database helper service for `TimelineEvent` model
 */
import { Prisma, TimelineEvent } from "@prisma/client";
import { context } from "../graphql/context";

export type UpsertTimelineEventInput =
  | Prisma.TimelineEventUpsertArgs["create"] &
      Prisma.TimelineEventUpsertArgs["update"];
type SearchTimelineEventInput = Partial<
  Pick<TimelineEvent, "order" | "authorId" | "timelineId" | "eventId">
>;
type TimelineEventByIdInput = Pick<TimelineEvent, "id">;
const { TimelineEvents } = context;

/** create timelineEvent record */
export async function upsertTimelineEvent(newEvent: UpsertTimelineEventInput) {
  const data: UpsertTimelineEventInput = { ...newEvent };
  return data.id
    ? TimelineEvents.update({ data, where: { id: data.id } })
    : TimelineEvents.create({ data });
}

/** create multiple timelineEvent records */
export async function upsertTimelineEvents(
  newEvents: UpsertTimelineEventInput[]
) {
  return Promise.all(
    newEvents.map((data) =>
      data.id ? upsertTimelineEvent(data) : TimelineEvents.create({ data })
    )
  );
}

/** find all timelineEvent records matching params */
export async function findAllTimelineEvents(filter: SearchTimelineEventInput) {
  const { order, authorId, timelineId, eventId } = filter;
  const where: Prisma.TimelineEventFindManyArgs["where"] = {};
  if (order) where.order = order;
  if (authorId) where.authorId = authorId;
  if (timelineId) where.timelineId = timelineId;
  if (eventId) where.eventId = eventId;

  return TimelineEvents.findMany({
    where,
    include: { Event: true },
    orderBy: { order: "asc" }
  });
}

/** find one timelineEvent record matching params */
export async function getTimelineEvent(where: TimelineEventByIdInput) {
  return TimelineEvents.findUnique({ where });
}

/** update one timelineEvent record matching params */
export async function updateTimelineEvent(
  where: TimelineEventByIdInput,
  data: UpsertTimelineEventInput
) {
  return TimelineEvents.update({ data, where });
}

/** delete a timelineEvent */
export async function deleteTimelineEvent(where: TimelineEventByIdInput) {
  return TimelineEvents.delete({ where });
}
