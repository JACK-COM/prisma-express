/**
 * @file Character-Relationships.Service
 * @description Database helper service for `CharacterRelationship` model
 */
import { Prisma, CharacterRelationship } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertArgs = Prisma.CharacterRelationshipUpsertArgs;
type CreateCharacterRelationshipInput =
  | UpsertArgs["create"] & UpsertArgs["update"];
type SearchCharacterRelationshipInput = Partial<
  Pick<
    CharacterRelationship,
    "relationship" | "characterId" | "targetId" | "id"
  >
>;

type CharacterRelationshipByIdInput = Pick<CharacterRelationship, "id">;
const { CharacterRelationships } = context;

/** create character-relationship record */
export async function upsertCharacterRelationship(
  newCharacterRelationship: CreateCharacterRelationshipInput
) {
  const data: CreateCharacterRelationshipInput = {
    ...newCharacterRelationship
  };

  return CharacterRelationships.upsert({
    create: data,
    update: data,
    where: { id: newCharacterRelationship.id }
  });
}

/** find all character-relationship records matching params */
export async function findAllCharacterRelationship(
  filter: SearchCharacterRelationshipInput
) {
  const OR: Prisma.CharacterRelationshipFindManyArgs["where"] = {};
  if (filter.id) OR.id = filter.id;
  if (filter.relationship) OR.relationship = { contains: filter.relationship };
  if (filter.characterId) {
    OR.characterId = filter.characterId;
    if (!filter.targetId) OR.targetId = filter.characterId;
  }
  if (filter.targetId) {
    OR.targetId = filter.targetId;
    if (!filter.characterId) OR.characterId = filter.targetId;
  }

  return CharacterRelationships.findMany({ where: { OR } });
}

/** find one character-relationship record matching params */
export async function getCharacterRelationship(
  where: CharacterRelationshipByIdInput
) {
  return CharacterRelationships.findUnique({ where });
}

/** update one character-relationship record matching params */
export async function updateCharacterRelationship(
  where: CharacterRelationshipByIdInput,
  data: CreateCharacterRelationshipInput
) {
  return CharacterRelationships.update({ data, where });
}

/** delete a character-relationship */
export async function deleteCharacterRelationship(
  where: CharacterRelationshipByIdInput
) {
  return CharacterRelationships.delete({ where });
}
