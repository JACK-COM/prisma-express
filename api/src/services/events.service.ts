/**
 * @file Event.Service
 * @description Database helper service for `Event` model
 */
import { Prisma, Event } from "@prisma/client";
import { context } from "../graphql/context";

export type UpsertEventInput =
  | Prisma.EventUpsertArgs["create"] & Prisma.EventUpsertArgs["update"];
type EventByIdInput = Pick<Event, "id">;
type SearchEventInput = Partial<
  Pick<
    Event,
    | "id"
    | "name"
    | "description"
    | "authorId"
    | "worldId"
    | "groupId"
    | "locationId"
    | "characterId"
    | "polarity"
    | "target"
  >
>;
const { Events } = context;

/** create event record */
export async function upsertEvent(newEvent: UpsertEventInput) {
  const data: UpsertEventInput = { ...newEvent };
  return data.id
    ? Events.update({ data, where: { id: data.id } })
    : Events.create({ data });
}

/** Create multiple event records */
export async function upsertEvents(newEvents: UpsertEventInput[]) {
  return Promise.all(newEvents.map(upsertEvent));
}

/** find all event records matching params */
export async function findAllEvents(filter: SearchEventInput) {
  const {
    id,
    name,
    description,
    authorId,
    worldId,
    groupId,
    locationId,
    characterId,
    polarity,
    target
  } = filter;
  const where: Prisma.EventFindManyArgs["where"] = {};
  if (id) where.id = id;
  if (name) where.name = { contains: name };
  if (description) where.description = { contains: description };
  if (characterId) where.characterId = characterId;

  where.OR = [];
  if (authorId) where.OR.push({ authorId });
  if (worldId) where.OR.push({ worldId });
  if (groupId) where.OR.push({ groupId });
  if (locationId) where.OR.push({ locationId });
  if (polarity) where.OR.push({ polarity });
  if (target) where.OR.push({ target });

  return Events.findMany({ where });
}

/** find one event record matching params */
export async function getEvent(where: EventByIdInput) {
  return Events.findUnique({ where, include: { World: true } });
}

/** update one event record matching params */
export async function updateEvent(
  where: EventByIdInput,
  data: UpsertEventInput
) {
  return Events.update({ data, where });
}

/** delete a event */
export async function deleteEvent(where: EventByIdInput) {
  return Events.delete({ where });
}
