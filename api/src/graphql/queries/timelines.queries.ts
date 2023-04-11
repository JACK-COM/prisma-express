/**
 * @file Timelines.Queries
 * @description Queries for the `Timelines`, `Events`, and `TimelineEvents` models
 * @NOTE All three models are combined here because they are related
 */

import { queryField, nonNull, intArg, list, stringArg } from "nexus";
import * as TimelinesService from "../../services/timelines.service";
import * as TimelinesEventsService from "../../services/timeline-events.service";
import * as EventsService from "../../services/events.service";

/**
 * Get a single `Timeline` by ID
 * @param id Timeline ID
 * @returns `MFTimeline` object from service; `null` if not found or not authorized
 */
export const getTimelineById = queryField("getTimelineById", {
  type: "MFTimeline",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimeline` object from service
   * @throws Error if timeline not found or timeline is private and user is not the author
   * @throws Error if timeline not found
   * @throws Error if timeline is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const timeline = await TimelinesService.getTimeline({ id });
    const isAuthor = user?.id === timeline?.authorId;
    // require public timeline or author
    return !timeline || !isAuthor ? null : timeline;
  }
});

/**
 * Get a single `Event` by ID
 * @param id Event ID
 * @returns `MFEvent` object from service: `null` if not found or not authorized
 */
export const getEventById = queryField("getEventById", {
  type: "MFEvent",
  args: { id: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFEvent` object from service
   * @throws Error if event not found, or is private and user is not the author
   */
  resolve: async (_, { id }, { user }) => {
    const event = await EventsService.getEvent({ id });
    const isAuthor = !event?.authorId || user?.id === event?.authorId;
    // require public event or author
    return !isAuthor ? null : event;
  }
});

/**
 * Get all `Timelines` for a given `User`
 * @param userId User ID
 * @returns `MFTimeline` objects from service
 */
export const getAuthorTimelines = queryField("getAuthorTimelines", {
  type: list("MFTimeline"),
  args: { authorId: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimeline` objects from service
   */
  resolve: async (_, { authorId }, { user }) => {
    const isAuthor = user?.id === authorId;
    // require author
    if (!user || !isAuthor) return [];
    return TimelinesService.findAllTimelines({ authorId });
  }
});

/**
 * Get all `Events` for a given `Timeline`
 * @param timelineId Timeline ID
 * @returns `MFEvent` objects from service: empty list if not found or not authorized
 */
export const getTimelineEvents = queryField("getTimelineEvents", {
  type: list("MFTimelineEvent"),
  args: { timelineId: nonNull(intArg()) },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFEvent` objects from service: empty list if not found or not authorized
   */
  resolve: async (_, { timelineId }, { user }) => {
    if (!timelineId) return [];
    const timeline = await TimelinesService.getTimeline({ id: timelineId });
    const isAuthor = user?.id === timeline?.authorId;
    // require public timeline or author
    if (!timeline || !isAuthor) throw new Error("Timeline not found");
    return TimelinesEventsService.findAllTimelineEvents({ timelineId });
  }
});

/**
 * Search for `Timelines` by `name` or `worldId`
 * @param name Timeline name
 * @param worldId Timeline `worldId`
 * @returns `MFTimeline` objects from service: empty list if not found or not authorized
 */
export const searchTimelines = queryField("searchTimelines", {
  type: list("MFTimeline"),
  args: { name: stringArg(), worldId: intArg() },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimeline` objects from service: empty list if not found or not authorized
   */
  resolve: async (_, { name, worldId }, { user }) => {
    if (!user) return [];
    return TimelinesService.findAllTimelines({
      name: name || undefined,
      worldId: worldId || undefined
    });
  }
});
