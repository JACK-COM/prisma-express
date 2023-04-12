/**
 * @file timelines.graphql.ts
 * @description GraphQL requests relating to `Events`, `Timelines`, and `TimelineEvents`.
 */

import fetchGQL from "graphql/fetch-gql";
import {
  deleteTimelineEventMutation,
  deleteTimelineMutation,
  upsertEventMutation,
  upsertTimelineEventMutation,
  upsertTimelineMutation
} from "graphql/mutations";
import { listWorldEventsQuery, listTimelinesQuery } from "graphql/queries";
import { APIData, WorldEvent, Timeline, TimelineEvent } from "utils/types";

// Shared ID type
type ItemID = { id?: number };

/** Data required to create/update an `Event` */
export type CreateEventData = ItemID &
  Partial<Pick<WorldEvent, "name" | "characterId" | "groupId">> &
  Pick<WorldEvent, "name" | "polarity" | "target" | "worldId" | "description">;

/** Data required to create/update a `Timeline` */
export type CreateTimelineData = ItemID &
  Partial<Pick<Timeline, "authorId">> &
  Pick<Timeline, "name" | "worldId"> & { events?: CreateTimelineEventData[] };

/** Data required to create/update a timeline event */
export type CreateTimelineEventData = ItemID &
  Partial<Pick<TimelineEvent, "authorId">> &
  Pick<TimelineEvent, "order" | "eventId" | "timelineId">;

// Use fetchGQL to create/update one or more `Events` on the server
export async function upsertEvents(data: Partial<CreateEventData>[]) {
  return fetchGQL<APIData<WorldEvent>[]>({
    query: upsertEventMutation(),
    variables: { data },
    onResolve: ({ upsertEvents: list }, errors) => errors || list,
    fallbackResponse: []
  });
}

// Use fetchGQL to create or update a `Timeline` on the server
export async function upsertTimeline(data: Partial<CreateTimelineData>) {
  return fetchGQL<APIData<Timeline> | null>({
    query: upsertTimelineMutation(),
    variables: { data },
    onResolve: ({ upsertTimeline: tl }, errors) => errors || tl,
    fallbackResponse: null
  });
}

// Use fetchGQL to create or update a list of `TimelineEvents` on the server
export async function upsertTimelineEvents(
  timelineId: number,
  events: Partial<CreateTimelineEventData>[]
) {
  const newTimelineEvent = await fetchGQL<APIData<TimelineEvent> | null>({
    query: upsertTimelineEventMutation(),
    variables: { id: timelineId, events },
    onResolve: ({ upsertTimelineEvents: list }, errors) => errors || list,
    fallbackResponse: null
  });

  return newTimelineEvent;
}

// Use fetchGQL to delete a `Timeline` and all related `TimelineEvents` on the server
export async function deleteTimeline(id: number) {
  const deletedTimeline = await fetchGQL<APIData<Timeline> | null>({
    query: deleteTimelineMutation(),
    variables: { id },
    onResolve: ({ deleteTimeline: tl }, errors) => errors || tl,
    fallbackResponse: null
  });

  return deletedTimeline;
}

// Use fetchGQL to delete a `TimelineEvent` on the server
export async function deleteTimelineEvent(id: number) {
  const deletedTimelineEvent = await fetchGQL<APIData<TimelineEvent> | null>({
    query: deleteTimelineEventMutation(),
    variables: { id },
    onResolve: ({ deleteTimelineEvent: tle }, errors) => errors || tle,
    fallbackResponse: null
  });

  return deletedTimelineEvent;
}

// Use fetchGQL to get a list of `Events` from the server
export async function listWorldEvents(filters: Partial<WorldEvent> = {}) {
  if (!Object.keys(filters).length)
    return "At least one Event filter parameter is required";

  return fetchGQL<APIData<WorldEvent>[]>({
    query: listWorldEventsQuery(),
    variables: { ...filters },
    onResolve: ({ listWorldEvents: list }, errors) => errors || list,
    fallbackResponse: []
  });
}

// Use fetchGQL to get a list of `Timelines` from the server
export async function listTimelines(
  filters?: Partial<Pick<Timeline, "authorId" | "worldId" | "name">>
) {
  const timelines = await fetchGQL<APIData<Timeline>[]>({
    query: listTimelinesQuery(),
    variables: { ...filters },
    onResolve: ({ listTimelines: list }, errors) => errors || list,
    fallbackResponse: []
  });

  console.log(timelines);

  return timelines;
}
