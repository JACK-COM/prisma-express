/**
 * @file Timeline.Service
 * @description Database helper service for `Timeline` model
 */
import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type CreateTimelineInput =
    | Prisma.TimelineUpsertArgs["create"] & Prisma.TimelineUpsertArgs["update"];
type SearchTimelineInput = Pick<CreateTimelineInput, "name" | "authorId">;
type TimelineByIdInput = Pick<World, "id">;
const { Timelines } = context;

/** create timeline record */
export async function upsertTimeline(newTimeline: CreateTimelineInput) {
    const data: CreateTimelineInput = { ...newTimeline };

    return Timelines.upsert({
        create: data,
        update: data,
        where: { id: newTimeline.id }
    });
}

/** find all timeline records matching params */
export async function findAllTimeline(where: TimelineByIdInput | SearchTimelineInput) {
    return Timelines.findMany({ where });
}

/** find one timeline record matching params */
export async function getTimeline(where: TimelineByIdInput) {
    return Timelines.findUnique({ where });
}

/** update one timeline record matching params */
export async function updateTimeline(
    where: TimelineByIdInput,
    data: CreateTimelineInput
) {
    return Timelines.update({ data, where });
}

/** delete a timeline */
export async function deleteTimeline(where: TimelineByIdInput) {
    return Timelines.delete({ where });
}