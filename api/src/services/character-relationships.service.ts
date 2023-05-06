/**
 * @file Character-Relationships.Service
 * @description Database helper service for `CharacterRelationship` model
 */
import { Prisma, CharacterRelationship } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertArgs = Prisma.CharacterRelationshipUpsertArgs;
type UpsertRelationshipInput = UpsertArgs["create"] & UpsertArgs["update"];
type SearchCharacterRelationshipInput =
  | Pick<UpsertRelationshipInput, "id"> &
      Partial<
        Pick<CharacterRelationship, "relationship" | "characterId" | "targetId">
      >;
type CharacterRelationshipByIdInput = Pick<CharacterRelationship, "id">;

const { CharacterRelationships } = context;
const CharacterSrc: Prisma.CharacterRelationshipInclude = { Character: true };

/** create `Character-Relationship` record */
export async function upsertCharacterRelationships(
  newItems: UpsertRelationshipInput[]
): Promise<CharacterRelationship[]> {
  const rels: Promise<CharacterRelationship>[] = [];
  newItems.forEach((data) => {
    const where = { id: data.id };
    if (data.id) rels.push(CharacterRelationships.update({ data, where }));
    else rels.push(CharacterRelationships.create({ data }));
  });

  return Promise.all(rels);
}

/** find all `Character-Relationship` records matching params */
export async function findAllCharacterRelationship(
  filter: SearchCharacterRelationshipInput
) {
  const where: Prisma.CharacterRelationshipFindManyArgs["where"] = {};
  const { characterId, id, targetId, relationship } = filter;
  if (id) where.id = id;
  if (relationship) where.relationship = { contains: relationship };

  where.OR = [];
  if (characterId) where.OR.push({ characterId }, { targetId: characterId });
  if (targetId) where.OR.push({ targetId }, { characterId: targetId });

  return CharacterRelationships.findMany({ where, include: CharacterSrc });
}

/** find one `Character-Relationship` record matching params */
export async function getCharacterRelationship(
  where: CharacterRelationshipByIdInput
) {
  return CharacterRelationships.findUnique({ where, include: CharacterSrc });
}

/** update one `Character-Relationship` record matching params */
export async function updateCharacterRelationship(
  where: CharacterRelationshipByIdInput,
  data: UpsertRelationshipInput
) {
  return CharacterRelationships.update({ data, where, include: CharacterSrc });
}

/** delete a `Character-Relationship` */
export async function deleteCharacterRelationship(
  where: CharacterRelationshipByIdInput
) {
  return CharacterRelationships.delete({ where, include: { Character: true } });
}
