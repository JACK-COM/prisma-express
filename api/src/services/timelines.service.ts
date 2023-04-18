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
    ? Timelines.update({
        data,
        where: { id: data.id },
        include: {
          World: true,
          TimelineEvents: {
            include: { Event: true },
            orderBy: { order: "asc" }
          }
        }
      })
    : Timelines.create({ data });
}

/** find all timeline records matching params */
export async function findAllTimelines(filter: SearchTimelineInput) {
  const { id, name, authorId, worldId } = filter;
  const where: Prisma.TimelineWhereInput = {};
  if (id) where.id = id;
  if (name) where.name = { contains: name, mode: "insensitive" };
  where.OR = [];
  if (worldId) where.worldId = worldId;
  else where.OR.push({ World: { public: true } });
  if (authorId) {
    where.OR.push(
      { World: { public: false }, authorId },
      { World: { public: true }, authorId }
    );
  }

  return await Timelines.findMany({
    where,
    include: {
      World: true,
      TimelineEvents: {
        include: { Event: true },
        orderBy: { order: "asc" }
      }
    }
  });
}

/** find one timeline record matching params */
export async function getTimeline(where: TimelineByIdInput) {
  return await Timelines.findUnique({
    where,
    include: {
      World: true,
      TimelineEvents: {
        include: { Event: true },
        orderBy: { order: "asc" }
      }
    }
  });
}

/** update one timeline record matching params */
export async function updateTimeline(
  where: TimelineByIdInput,
  data: UpsertTimelineInput
) {
  return Timelines.update({
    data,
    where,
    include: {
      World: true,
      TimelineEvents: {
        include: { Event: true },
        orderBy: { order: "asc" }
      }
    }
  });
}

/** delete a timeline */
export async function deleteTimeline(where: TimelineByIdInput) {
  return Timelines.delete({ where });
}
