/**
 * @file Event.Service
 * @description Database helper service for `Event` model
 */
import { Prisma, Event } from "@prisma/client";
import { context } from "../graphql/context";

type CreateEventInput =
  | Prisma.EventUpsertArgs["create"] & Prisma.EventUpsertArgs["update"];
type SearchEventInput = Pick<CreateEventInput, "name" | "description">;
type EventByIdInput = Pick<Event, "id">;
const { Events } = context;

/** create event record */
export async function upsertEvent(newEvent: CreateEventInput) {
  const data: CreateEventInput = { ...newEvent };

  return Events.upsert({
    create: data,
    update: data,
    where: { id: newEvent.id }
  });
}

/** find all event records matching params */
export async function findAllEvent(where: EventByIdInput | SearchEventInput) {
  return Events.findMany({ where });
}

/** find one event record matching params */
export async function getEvent(where: EventByIdInput) {
  return Events.findUnique({ where });
}

/** update one event record matching params */
export async function updateEvent(
  where: EventByIdInput,
  data: CreateEventInput
) {
  return Events.update({ data, where });
}

/** delete a event */
export async function deleteEvent(where: EventByIdInput) {
  return Events.delete({ where });
}
