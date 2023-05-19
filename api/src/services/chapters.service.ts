/**
 * @file Chapters.Service
 * @description Database helper service for `Chapter` model
 */
import { Prisma, Chapter } from "@prisma/client";
import { context } from "../graphql/context";
import { DateTime } from "luxon";

type ChapterUpsertInput = Prisma.ChapterUpsertArgs["create"] &
  Prisma.ChapterUpsertArgs["update"] & { id?: Chapter["id"] };
type SearchChapterInput = Partial<
  Pick<Chapter, "title" | "description" | "authorId" | "bookId">
> & { id?: Chapter["id"][] };

const { Chapters } = context;
const ChapterAuthor: Prisma.ChapterInclude = { Author: true };
const ChapterContents: Prisma.ChapterInclude = {
  ...ChapterAuthor,
  Scenes: { include: { Links: true }, orderBy: { order: "asc" } }
};

/** create or update `Chapter` record */
export async function upsertChapter(chapter: ChapterUpsertInput) {
  const data: ChapterUpsertInput = { ...chapter };
  const now = DateTime.now().toISO();
  if (!data.id) data.created = now;
  data.lastUpdated = DateTime.now().toISO();

  return chapter.id
    ? Chapters.update({
        data,
        where: { id: chapter.id },
        include: ChapterContents
      })
    : Chapters.create({ data });
}

/** create or update `Chapter` records */
export async function upsertChapters(chapters: ChapterUpsertInput[]) {
  return chapters.map(upsertChapter);
}

/** find all `Chapter` records matching params */
export async function findAllChapters(filters: SearchChapterInput) {
  const where: Prisma.ChapterWhereInput = {};
  if (filters.authorId) where.authorId = filters.authorId;
  if (filters.id?.length) where.id = { in: filters.id };
  if (filters.bookId) where.bookId = filters.bookId;
  if (filters.title) where.title = { contains: filters.title };
  if (filters.description)
    where.description = { contains: filters.description };

  return Chapters.findMany({ where, include: ChapterAuthor });
}

/** find one `Chapter` record matching params */
export async function getChapterById(id: Chapter["id"]) {
  return Chapters.findUnique({ where: { id }, include: ChapterContents });
}

/** delete one `Chapter` record matching params */
export async function deleteChapterById(id: Chapter["id"]) {
  return Chapters.delete({ where: { id }, include: ChapterContents });
}

export function pruneChapterData(chapter: any, i = 0) {
  return {
    id: chapter.id || undefined,
    authorId: chapter.authorId || undefined,
    title: chapter.title || `Chapter ${i + 1}`,
    description: chapter.description || "",
    order: chapter.order || i,
    bookId: chapter.bookId || undefined,
    status: chapter.status || "Draft"
  } as ChapterUpsertInput;
}
