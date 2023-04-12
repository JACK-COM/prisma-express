/**
 * @file Timelines.Mutations
 * @description Mutations for the `Timelines`, `Events`, and `TimelineEvents` models
 * @NOTE All three models are combined here because they are related.
 */

import { mutationField, nonNull, intArg, list } from "nexus";
import * as TimelinesService from "../../services/timelines.service";
import * as TimelinesEventsService from "../../services/timeline-events.service";
import * as EventsService from "../../services/events.service";

/**
 * Create or update one or more `Events`
 * @param data.name Event name
 * @param data.worldId Event world ID
 * @param data.polarity Event polarity (positive, negative, neutral)
 * @param data.target Event target type (character, location, etc.; optional)
 */
export const upsertEvents = mutationField("upsertEvents", {
  type: list("MFEvent"),
  description: "Create or update one or more `Events`",
  args: { data: nonNull(list("MFEventUpsertInput")) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFEvent` object from service
   * @throws Error if event not found, or is private and user is not the author
   */
  resolve: async (_, { data }, { user }) => {
    if (!user?.id) throw new Error("User not authenticated");
    if (!data.length) return [];

    return EventsService.upsertEvents(
      data.map((e) => ({
        ...e,
        authorId: e?.authorId || user.id,
        description: e?.description || ""
      })) as EventsService.UpsertEventInput[]
    );
  }
});

/**
 * Create or update a new `Timeline` along with its events
 * @param data.name Timeline name
 * @param data.worldId Timeline's `World` ID
 * @param data.authorId Timeline's author ID
 * @param data.events Timeline events (optional)
 * @returns `MFTimeline` object from service
 * @throws Error if timeline name is not unique and timeline has no `worldId`
 */
export const upsertTimeline = mutationField("upsertTimeline", {
  type: "MFTimeline",
  description: "Create a new `Timeline` along with its events",
  args: { data: nonNull("MFTimelineUpsertInput") },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimeline` object from service
   * @throws Error if timeline name is not unique and timeline has no `worldId`
   */
  resolve: async (_, { data }, { user, Timelines }) => {
    if (!user?.id) throw new Error("User not authenticated");
    const authorId = user.id;
    const { id, name, worldId, events = [] } = data;

    // confirm unique name or worldId if this is a new timeline
    if (!id) {
      const exists = await Timelines.findMany({
        where: { AND: [{ name }, { worldId }] }
      })[0];
      if (exists) throw new Error("This world has a timeline with this name");
    }

    // create/update timeline
    const timelineData = { name, worldId, authorId };
    const timeline = await TimelinesService.upsertTimeline(timelineData);

    // Exit if no new events
    if (!events?.length) return timeline;

    // create/update events if present
    const newEvents = await EventsService.upsertEvents(
      events.map((event) => ({
        ...event,
        id: event.id || undefined,
        description: event.description || "No description"
      }))
    );

    // find existing timeline events to update
    const existingEvents = await TimelinesEventsService.findAllTimelineEvents({
      timelineId: timeline.id
    });

    // create/update timeline events
    await TimelinesEventsService.upsertTimelineEvents(
      // convert to `UpsertTimelineEventInput` format
      newEvents.map((ev, i) => {
        return (
          existingEvents.find((te) => te.eventId === ev.id) || {
            timelineId: timeline.id,
            eventId: ev.id,
            order: i,
            authorId
          }
        );
      }) as TimelinesEventsService.UpsertTimelineEventInput[]
    );

    // return new timeline with events
    return TimelinesService.getTimeline({ id: timeline.id });
  }
});

/**
 * Update a `Timeline`'s events
 * @param id Timeline ID
 * @param events Timeline events
 * @returns `MFTimeline` object from service
 * @throws Error if timeline does not exist, or does not belong to user
 */
export const upsertTimelineEvents = mutationField("upsertTimelineEvents", {
  type: list("MFTimelineEvent"),
  description: "Update a `Timeline`'s events",
  args: {
    id: nonNull(intArg()),
    events: list(nonNull("MFTimelineEventUpsertInput"))
  },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimeline` object from service
   * @throws Error if timeline does not exist, or does not belong to user
   */
  resolve: async (_, { id, events }, { user }) => {
    // Exit if no new events
    if (!events?.length) return [];

    // confirm user is authenticated
    if (!user?.id) throw new Error("User not authenticated");

    // confirm timeline exists and belongs to user
    const timeline = await TimelinesService.getTimeline({ id });
    if (!timeline || timeline.authorId !== user.id) {
      throw new Error("Timeline not found");
    }

    // create or update new `TimelineEvents`
    return TimelinesEventsService.upsertTimelineEvents(
      events.map((event, i) => ({
        ...event,
        id: event.id || undefined,
        order: event.order || i,
        timelineId: id,
        authorId: user.id
      }))
    );
  }
});

/**
 * Delete a `Timeline` and all its events
 * @param id Timeline ID
 * @returns `MFTimeline` object from service
 * @throws Error if timeline does not exist, or does not belong to user
 */
export const deleteTimeline = mutationField("deleteTimeline", {
  type: "MFTimeline",
  description: "Delete a `Timeline` and all its events",
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimeline` object from service
   * @throws Error if timeline does not exist
   * @throws Error if timeline does not belong to user
   */
  resolve: async (_, { id }, { user }) => {
    if (!user?.id) throw new Error("User not authenticated");
    const timeline = await TimelinesService.getTimeline({ id });
    if (!timeline) throw new Error("Timeline not found");
    if (timeline.authorId !== user.id) throw new Error("Not authorized");
    return TimelinesService.deleteTimeline(timeline);
  }
});

/**
 * Delete a `TimelineEvent`
 * @param id TimelineEvent ID
 * @returns `MFTimelineEvent` object from service
 * @throws Error if timeline event does not exist, or does not belong to user
 */
export const deleteTimelineEvent = mutationField("deleteTimelineEvent", {
  type: "MFTimelineEvent",
  description: "Delete a `TimelineEvent`",
  args: { id: nonNull(intArg()) },

  /**
   * Mutation resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimelineEvent` object from service
   * @throws Error if timeline event does not exist, or does not belong to user
   */
  resolve: async (_, { id }, { user }) => {
    if (!user?.id) throw new Error("User not authenticated");
    const event = await TimelinesEventsService.getTimelineEvent({ id });
    if (!event) throw new Error("Event not found");
    if (event.authorId !== user.id) throw new Error("Not authorized");
    return TimelinesEventsService.deleteTimelineEvent(event);
  }
});
