/**
 * @file Timelines.Mutations
 * @description Mutations for the `Timelines`, `Events`, and `TimelineEvents` models
 * @NOTE All three models are combined here because they are related.
 */

import { mutationField, nonNull, intArg } from "nexus";
import * as TimelinesService from "../../services/timelines.service";
import * as TimelinesEventsService from "../../services/timeline-events.service";
import * as EventsService from "../../services/events.service";

/**
 * Create or update a new `Timeline` along with its events
 * @param name Timeline name
 * @param worldId Timeline's `World` ID
 * @param authorId Timeline's author ID
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
  resolve: async (_, { data }, { user }) => {
    if (!user?.id) throw new Error("User not authenticated");
    const authorId = user.id;
    const { id, name, worldId, events = [] } = data;

    // confirm unique name or worldId if this is a new timeline
    if (!id) {
      const exists = await TimelinesService.findAllTimelines({ name, worldId });
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
 * Delete a `Timeline` and all its events
 * @param id Timeline ID
 * @returns `MFTimeline` object from service
 * @throws Error if timeline does not exist
 * @throws Error if timeline does not belong to user
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
