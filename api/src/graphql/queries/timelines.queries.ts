/**
 * @file Timelines.Queries
 * @description Queries for the `Timelines`, `Events`, and `TimelineEvents` models
 * @NOTE All three models are combined here because they are related
 */

import { queryField, nonNull, intArg, list, stringArg, arg } from "nexus";
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
   */
  resolve: async (_, { id }, { user }) => {
    const timeline = await TimelinesService.getTimeline({ id });
    if (timeline) {
      const isAuthor =
        timeline?.World?.public || user?.id === timeline?.authorId;
      return !isAuthor ? null : timeline;
    }
    // require public timeline or author
    return null;
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
 * Get all `Events` for a given `Timeline`
 * @param timelineId Timeline ID
 * @returns `MFEvent` objects from service: empty list if not found or not authorized
 */
export const listTimelineEvents = queryField("listTimelineEvents", {
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
 * Search for `Timelines` by `name`, `authorId`, or `worldId`
 * @param name Timeline name
 * @param authorId Timeline `authorId`
 * @param worldId Timeline `worldId`
 * @returns `MFTimeline` objects from service: empty list if not found or not authorized
 */
export const listTimelines = queryField("listTimelines", {
  type: list("MFTimeline"),
  args: { name: stringArg(), authorId: intArg(), worldId: intArg() },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFTimeline` objects from service: empty list if not found or not authorized
   */
  resolve: async (_, args, { user, Timelines, Worlds }) => {
    const { name, worldId } = args;
    // Get timelines for public worlds if no user
    if (!user) {
      const publicWorlds = await Worlds.findMany({ where: { public: true } });
      if (!publicWorlds.length) return [];
      const pubWorldIds = publicWorlds.map((w) => w.id);
      const pubTimelines = await Timelines.findMany({
        where: { worldId: { in: pubWorldIds } },
        include: {
          World: true,
          TimelineEvents: {
            include: { Event: true },
            orderBy: { order: "asc" }
          }
        }
      });
      return pubTimelines;
    }

    // All timelines
    return TimelinesService.findAllTimelines({
      name: name || undefined,
      worldId: worldId || undefined,
      authorId: args.authorId || user.id
    });
  }
});

/**
 * Search for `Events` by `name`, `worldId`, `timelineId`, or `authorId`
 * @param name Event name
 * @param worldId Event `worldId`
 * @param timelineId Event `timelineId`
 * @param authorId Event `authorId`
 * @returns `MFEvent` objects from service: empty list if not found or not authorized
 * @throws Error if events not found or user is not the author
 */
export const listWorldEvents = queryField("listWorldEvents", {
  type: list("MFEvent"),
  args: {
    name: stringArg(),
    authorId: intArg(),
    description: stringArg(),
    characterId: intArg(),
    groupId: intArg(),
    locationId: intArg(),
    worldId: intArg(),
    target: arg({ type: "EventTarget" }),
    polarity: arg({ type: "EventPolarity" })
  },

  /**
   * Query resolver
   * @param _ Source object (ignored in mutations/queries)
   * @param args Args (everything defined in `args` property above)
   * @param _ctx This is `DBContext` from `src/context.ts`. Can be used to access
   * database directly, or to access the authenticated `user` if the request has one.
   * @returns `MFEvent` objects from service: empty list if not found or not authorized
   * @throws Error if events not found or user is not the author
   */
  resolve: async (_, args, { user, Events, Worlds }) => {
    if (user)
      return EventsService.findAllEvents({
        name: args.name || undefined,
        authorId: args.authorId || undefined,
        description: args.description || undefined,
        characterId: args.characterId || undefined,
        groupId: args.groupId || undefined,
        locationId: args.locationId || undefined,
        worldId: args.worldId || undefined,
        polarity: args.polarity || undefined,
        target: args.target || undefined
      });

    const publicWorlds = await Worlds.findMany({ where: { public: true } });
    if (!publicWorlds.length) return [];
    const pubWorldIds = publicWorlds.map((w) => w.id);

    return Events.findMany({
      where: { worldId: { in: pubWorldIds } },
      include: { World: true }
    });
  }
});
