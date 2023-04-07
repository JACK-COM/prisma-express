/**
 * @file Character-Relationships.Service
 * @description Database helper service for `CharacterRelationship` model
 */
import { Prisma, CharacterRelationship } from "@prisma/client";
import { context } from "../graphql/context";

type UpsertArgs = Prisma.CharacterRelationshipUpsertArgs;
type CreateCharacterRelationshipInput =
  | UpsertArgs["create"] & UpsertArgs["update"];
type SearchCharacterRelationshipInput = Pick<
  CreateCharacterRelationshipInput,
  "relationship"
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
  where: CharacterRelationshipByIdInput | SearchCharacterRelationshipInput
) {
  return CharacterRelationships.findMany({ where });
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
