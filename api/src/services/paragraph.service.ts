/**
 * @file Paragraph.Service
 * @description Database helper service for `Paragraph` model
 */

import { Prisma, World } from "@prisma/client";
import { context } from "../graphql/context";

type CreateParagraphInput =
    | Prisma.ParagraphUpsertArgs["create"] & Prisma.ParagraphUpsertArgs["update"];
type SearchParagraphInput = Pick<CreateParagraphInput, "order" | "authorId">;
type ParagraphByIdInput = Pick<World, "id">;
const { Paragraphs } = context;

/** create paragraph record */
export async function upsertParagraph(newParagraph: CreateParagraphInput) {
    const data: CreateParagraphInput = { ...newParagraph };

    return Paragraphs.upsert({
        create: data,
        update: data,
        where: { id: newParagraph.id }
    });
}

/** find all paragraph records matching params */
export async function findAllParagraph(where: ParagraphByIdInput | SearchParagraphInput) {
    return Paragraphs.findMany({ where });
}

/** find one paragraph record matching params */
export async function getParagraph(where: ParagraphByIdInput) {
    return Paragraphs.findUnique({ where });
}

/** update one paragraph record matching params */
export async function updateParagraph(
    where: ParagraphByIdInput,
    data: CreateParagraphInput
) {
    return Paragraphs.update({ data, where });
}

/** delete a paragraph */
export async function deleteParagraph(where: ParagraphByIdInput) {
    return Paragraphs.delete({ where });
}