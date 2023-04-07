/**
 * @file Characters.Service
 * @description Database helper service for `Character` model
 */
import { Prisma, Character } from "@prisma/client";
import { context } from "../graphql/context";

type CreateCharacterInput =
  | Prisma.CharacterUpsertArgs["create"] & Prisma.CharacterUpsertArgs["update"];
type SearchCharacterInput = Pick<CreateCharacterInput, "name" | "description">;
type CharacterByIdInput = Pick<Character, "id">;
const { Characters } = context;

/** create character record */
export async function upsertCharacter(newCharacter: CreateCharacterInput) {
  const data: CreateCharacterInput = { ...newCharacter };

  return Characters.upsert({
    create: data,
    update: data,
    where: { id: newCharacter.id }
  });
}

/** find all character records matching params */
export async function findAllCharacter(
  where: CharacterByIdInput | SearchCharacterInput
) {
  return Characters.findMany({ where });
}

/** find one character record matching params */
export async function getCharacter(where: CharacterByIdInput) {
  return Characters.findUnique({ where });
}

/** update one character record matching params */
export async function updateCharacter(
  where: CharacterByIdInput,
  data: CreateCharacterInput
) {
  return Characters.update({ data, where });
}

/** delete a character */
export async function deleteCharacter(where: CharacterByIdInput) {
  return Characters.delete({ where });
}
