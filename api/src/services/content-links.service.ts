/**
 * @file Content-Links.Service
 * @description Database helper service for `ContentLink` model
 */
import { Prisma, ContentLink } from "@prisma/client";
import { context } from "../graphql/context";
import { DateTime } from "luxon";

export type ContentLinkUpsertInput = Prisma.ContentLinkUpsertArgs["create"] &
  Prisma.ContentLinkUpsertArgs["update"] & { id?: ContentLink["id"] };
type SearchContentLinkInput = Partial<
  Pick<
    ContentLink,
    "text" | "authorId" | "seriesId" | "bookId" | "chapterId" | "sceneId"
  >
> & { id?: ContentLink["id"][] };

const { ContentLinks } = context;

/** create or update `ContentLink` record */
export async function upsertContentLink(link: ContentLinkUpsertInput) {
  const data = { ...link };
  const now = DateTime.now().toISO();
  data.created = link.created || now;
  data.lastUpdated = DateTime.now().toISO();

  return link.id
    ? ContentLinks.update({ data, where: { id: link.id } })
    : ContentLinks.create({ data });
}

/** create or update `ContentLink` records */
export async function upsertContentLinks(links: ContentLinkUpsertInput[]) {
  return Promise.all(links.map(upsertContentLink));
}

/** find a single `ContentLink` record by id */
export async function getContentLinkById(id: ContentLink["id"]) {
  return ContentLinks.findUnique({ where: { id } });
}

/** find multiple `ContentLink` records matching filters */
export async function findManyContentLinks(filters: SearchContentLinkInput) {
  const where: Prisma.ContentLinkWhereInput = {};
  if (filters.id) where.id = { in: filters.id };
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.seriesId) where.seriesId = filters.seriesId;
  if (filters.bookId) where.bookId = filters.bookId;
  if (filters.chapterId) where.chapterId = filters.chapterId;
  if (filters.sceneId) where.sceneId = filters.sceneId;
  if (filters.text) where.text = { contains: filters.text };

  return ContentLinks.findMany({ where });
}

/** find a single `ContentLink` record matching filters */
export async function findOneContentLink(filters: SearchContentLinkInput) {
  const where: Prisma.ContentLinkWhereInput = {};
  if (filters.id) where.id = { in: filters.id };
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.seriesId) where.seriesId = filters.seriesId;
  if (filters.bookId) where.bookId = filters.bookId;
  if (filters.chapterId) where.chapterId = filters.chapterId;
  if (filters.sceneId) where.sceneId = filters.sceneId;
  if (filters.text) where.text = { contains: filters.text };

  return ContentLinks.findFirst({ where });
}

/** delete a single `ContentLink` record */
export async function deleteContentLink(id: ContentLink["id"]) {
  return ContentLinks.delete({ where: { id } });
}
