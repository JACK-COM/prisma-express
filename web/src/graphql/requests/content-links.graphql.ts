/**
 * @file content-links.graphql.ts
 * @description GraphQL requests relating to `ContentLinks`.
 */

import fetchGQL from "graphql/fetch-gql";
import {
  deleteContentLinkMutation,
  upsertContentLinksMutation
} from "graphql/mutations";
import { getContentLinkQuery, listContentLinksQuery } from "graphql/queries";
import { APIData, Chapter, ContentLink } from "utils/types";
import { getChapter } from "./books.graphql";

/** Data required to create a content link */
export type UpsertLinkData = { id?: number } & ContentLink;

/**
 * Create a new `ContentLink` or update an existing one.
 * @param data Data required to create a `ContentLink`
 * @returns `MFSceneContentLink` object from service
 * @throws Error if `ContentLink` not found
 */
export async function upsertContentLinks(
  chapterId: number,
  data: UpsertLinkData[]
): Promise<APIData<Chapter> | null> {
  const res = fetchGQL<APIData<ContentLink>[]>({
    query: upsertContentLinksMutation(),
    variables: { data },
    fallbackResponse: [],
    onResolve(x, errors) {
      return errors || x.upsertContentLinks;
    }
  });
  if (typeof res === "string" || !res) return res || "Error creating links";
  return getChapter(chapterId);
}

/**
 * Delete a `ContentLink`.
 * @param id ID of `ContentLink` to delete
 * @returns `MFSceneContentLink` object from service
 */
export async function deleteContentLink(
  id: number
): Promise<APIData<ContentLink>> {
  return fetchGQL<APIData<ContentLink>>({
    query: deleteContentLinkMutation(),
    variables: { id },
    fallbackResponse: undefined,
    onResolve(x, errors) {
      return errors || x.deleteContentLink;
    }
  });
}

type ListContentLinksFilter = Pick<
  ContentLink,
  "bookId" | "authorId" | "chapterId" | "sceneId" | "seriesId"
>;
/**
 * List `ContentLinks`
 * @param data.bookId ID of `Book` to list `ContentLinks` for
 * @param data.authorId Number of `ContentLinks` to return
 * @param data.chapterId ID of `Chapter` to list `ContentLinks` for
 * @param data.sceneId ID of `Scene` to list `ContentLinks` for
 * @param data.seriesId ID of `Series` to list `ContentLinks` for
 */
export async function listContentLinks(
  data: ListContentLinksFilter
): Promise<APIData<ContentLink>[]> {
  return fetchGQL<APIData<ContentLink>[]>({
    query: listContentLinksQuery(),
    variables: { data },
    fallbackResponse: [],
    onResolve(x, errors) {
      return errors || x.listContentLinks;
    }
  });
}

/**
 * Get `ContentLink` by ID
 * @param id ID of `ContentLink` to get
 */
export async function getContentLink(
  id: number
): Promise<APIData<ContentLink>> {
  return fetchGQL<APIData<ContentLink>>({
    query: getContentLinkQuery(),
    variables: { data: { id } },
    fallbackResponse: undefined,
    onResolve(x, errors) {
      return errors || x.getContentLink;
    }
  });
}
