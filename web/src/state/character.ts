import createState from "@jackcom/raphsducks";
import { mergeLists } from "utils";
import {
  APIData,
  CharacterRelationship,
  Character,
  ArrayKeys
} from "utils/types";

/* Convenience */
type APICharacter = APIData<Character>;
type APIRelationship = APIData<CharacterRelationship>;
/* Convenience */

/** Any global state relating to characters fetched/viewed by the user */
export const GlobalCharacter = createState({
  /** List of user (or public) characters */
  characters: [] as APICharacter[],
  /** List of selected character's relationships to other characters */
  relationships: [] as APIRelationship[],
  /** Selected `character` in application */
  focusedCharacter: null as APICharacter | null,
  /** Selected `character relationship` in application */
  focusedRelationship: null as APIRelationship | null
});

export type GlobalCharacterInstance = ReturnType<
  typeof GlobalCharacter.getState
>;
export type GlobalCharacterInstanceKey = keyof GlobalCharacterInstance;
export type GlobalCharacterListKey = ArrayKeys<GlobalCharacterInstance>;

/**
 * Update list of characters in state
 * @param chars New characters
 */
export function updateCharacters(chars: APICharacter[], skipUpdate = false) {
  const { focusedCharacter } = GlobalCharacter.getState();
  const updates: Partial<GlobalCharacterInstance> = {
    characters: updateCharacterStateList(chars, "characters")
  };

  if (chars.length === 1 && Boolean(focusedCharacter)) {
    updates.focusedCharacter = chars[0];
  }

  if (!skipUpdate) GlobalCharacter.multiple(updates);
  return updates;
}

/**
 * Update list of relationships in state
 * @param rels New relationships
 */
export function updateRelationships(
  rels: APIRelationship[],
  skipUpdate = false
) {
  const { focusedRelationship } = GlobalCharacter.getState();
  const updates: Partial<GlobalCharacterInstance> = {
    relationships: updateCharacterStateList(rels, "relationships")
  };
  if (rels.length === 1 && focusedRelationship) {
    updates.focusedRelationship = rels[0];
  }

  if (!skipUpdate) GlobalCharacter.multiple(updates);
  return updates;
}

/**
 * Remove `Character` from list in from state
 * @param targetId Id of target object
 */
export function removeCharacterFromState(targetId: number) {
  return removeFromCharsList(targetId, "characters");
}

/**
 * Remove location from list in from state
 * @param targetId Id of target object
 */
export function removeRelationship(targetId: number) {
  return removeFromCharsList(targetId, "relationships");
}

/**
 * Clear selected character
 */
export function clearGlobalCharacter() {
  GlobalCharacter.multiple({
    focusedCharacter: null,
    focusedRelationship: null,
    relationships: []
  });
}

/**
 * Update list-key in state
 * @param newItems New items
 */
function updateCharacterStateList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalCharacterListKey
) {
  const state = GlobalCharacter.getState();
  const old = state[key] as T;
  const next = mergeLists(old, newItems);

  return next;
}

/**
 * Remove item from list in from state
 * @param targetId `Character` id target
 */
function removeFromCharsList(targetId: number, key: GlobalCharacterListKey) {
  const state = GlobalCharacter.getState();
  const old: any[] = state[key];
  const next = old.filter((x) => x.id !== targetId);

  GlobalCharacter[key](next);
}
