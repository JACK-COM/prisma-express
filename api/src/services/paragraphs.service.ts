/**
 * @file Paragraph.Service
 * @description Database helper service for `Paragraph` model
 */

import { Prisma, Paragraph } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertParagraphInput =
  | Prisma.ParagraphUpsertArgs["create"] & Prisma.ParagraphUpsertArgs["update"];
type SearchParagraphInput = { id?: number } & Partial<
  Pick<Paragraph, "authorId" | "text" | "characterId" | "sceneId">
>;
type ParagraphByIdInput = Pick<Paragraph, "id">;

const { Paragraphs } = context;

/** create paragraph record */
export async function upsertParagraph(newParagraph: UpsertParagraphInput) {
  const data: UpsertParagraphInput = { ...newParagraph };
  return data.id
    ? Paragraphs.update({ data, where: { id: data.id } })
    : Paragraphs.create({ data });
}

/** create multiple paragraph record */
export async function upsertParagraphs(newParagraphs: UpsertParagraphInput[]) {
  return Promise.all(
    newParagraphs.map((data) =>
      data.id ? upsertParagraph(data) : Paragraphs.create({ data })
    )
  );
}

/** find all paragraph records matching params */
export async function findAllParagraph(filter: SearchParagraphInput) {
  const { id, authorId, text, characterId, sceneId } = filter;
  const where: Prisma.ParagraphFindManyArgs["where"] = {};
  if (id) where.id = id;
  if (authorId) where.authorId = authorId;
  if (text) where.text = { contains: text, mode: "insensitive" };
  if (characterId) where.characterId = characterId;
  if (sceneId) where.sceneId = sceneId;

  return Paragraphs.findMany({ where });
}

/** find one paragraph record matching params */
export async function getParagraph(where: ParagraphByIdInput) {
  return Paragraphs.findUnique({ where });
}

/** update one paragraph record matching params */
export async function updateParagraph(
  where: ParagraphByIdInput,
  data: UpsertParagraphInput
) {
  return Paragraphs.update({ data, where });
}

/** delete a paragraph */
export async function deleteParagraph(where: ParagraphByIdInput) {
  return Paragraphs.delete({ where });
}
