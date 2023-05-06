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
  const where: Prisma.EventFindManyArgs["where"] = buildWhereInput(filter);

  return Events.findMany({ where });
}

function buildWhereInput(filter: SearchEventInput) {
  const { id, authorId, worldId, characterId } = filter;
  const where: Prisma.EventFindManyArgs["where"] = {};
  if (id) where.id = id;
  if (characterId) where.characterId = characterId;
  where.AND = [];
  if (worldId) where.AND.push({ worldId });
  if (authorId) where.AND.push({ authorId });

  const { name, description, groupId, locationId, polarity, target } = filter;
  where.OR = [];
  if (name) where.OR.push({ name: { contains: name } });
  if (description) where.OR.push({ description: { contains: description } });
  if (groupId) where.OR.push({ groupId });
  if (locationId) where.OR.push({ locationId });
  if (polarity) where.OR.push({ polarity });
  if (target) where.OR.push({ target });

  if (where.AND.length === 0) delete where.AND;
  if (where.OR.length === 0) delete where.OR;
  return where;
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
