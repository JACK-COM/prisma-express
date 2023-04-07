/**
 * @file TimelineEvent.Service
 * @description Database helper service for `TimelineEvent` model
 */
import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type CreateTimelineEventInput =
    | Prisma.TimelineEventUpsertArgs["create"] & Prisma.TimelineEventUpsertArgs["update"];
type SearchTimelineEventInput = Pick<CreateTimelineEventInput, "order" | "authorId">;
type TimelineEventByIdInput = Pick<World, "id">;
const { TimelineEvents } = context;

/** create timelineEvent record */
export async function upsertTimelineEvent(newTimelineEvent: CreateTimelineEventInput) {
    const data: CreateTimelineEventInput = { ...newTimelineEvent };

    return TimelineEvents.upsert({
        create: data,
        update: data,
        where: { id: newTimelineEvent.id }
    });
}

/** find all timelineEvent records matching params */
export async function findAllTimelineEvent(where: TimelineEventByIdInput | SearchTimelineEventInput) {
    return TimelineEvents.findMany({ where });
}

/** find one timelineEvent record matching params */
export async function getTimelineEvent(where: TimelineEventByIdInput) {
    return TimelineEvents.findUnique({ where });
}

/** update one timelineEvent record matching params */
export async function updateTimelineEvent(
    where: TimelineEventByIdInput,
    data: CreateTimelineEventInput
) {
    return TimelineEvents.update({ data, where });
}

/** delete a timelineEvent */
export async function deleteTimelineEvent(where: TimelineEventByIdInput) {
    return TimelineEvents.delete({ where });
}