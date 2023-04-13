import createState from "@jackcom/raphsducks";
import { APIData, CharacterRelationship, Character } from "utils/types";

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
/** All lists in state */
export type GlobalCharacterListKey = "characters" | "relationships";

/**
 * Update list of characters in state
 * @param newCharacters New characters
 */
export function updateCharacters(newCharacters: APICharacter[]) {
  const { focusedCharacter } = GlobalCharacter.getState();
  if (newCharacters.length !== 1 || !focusedCharacter) {
    return updateCharacterStateList(newCharacters, "characters");
  }

  const characters = updateCharacterStateList(
    newCharacters,
    "characters",
    true
  );
  GlobalCharacter.multiple({ characters, focusedCharacter: newCharacters[0] });
}

/**
 * Update list of relationships in state
 * @param newRelationships New relationships
 */
export function updateRelationships(newRelationships: APIRelationship[]) {
  const { focusedRelationship } = GlobalCharacter.getState();
  if (newRelationships.length !== 1 || !focusedRelationship) {
    return updateCharacterStateList(newRelationships, "relationships");
  }

  const relationships = updateCharacterStateList(
    newRelationships,
    "relationships",
    true
  );
  GlobalCharacter.multiple({
    relationships: relationships,
    focusedRelationship: newRelationships[0]
  });
}

/**
 * Remove `Character` from list in from state
 * @param targetId Id of target object
 */
export function removeCharacter(targetId: number) {
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
 * Update list-key in state
 * @param newItems New items
 */
export function updateCharacterStateList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalCharacterListKey,
  returnList = false
) {
  const state = GlobalCharacter.getState();
  const old = state[key] as T;
  const next = [...old];
  newItems.forEach((w) => {
    const existing = old.findIndex((x) => x.id === w.id);
    if (existing > -1) next[existing] = { ...next[existing], ...w };
    else next.push(w);
  });

  if (returnList) return next;
  GlobalCharacter[key](next);
}

/**
 * Overwrite a list-key in state
 * @param newItems New items for state
 */
export function setCharacterStateList<T extends APIData<any>[]>(
  newItems: T,
  key: GlobalCharacterListKey
) {
  GlobalCharacter[key](newItems);
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
 * Remove item from list in from state
 * @param targetId `Character` id target
 */
function removeFromCharsList(targetId: number, key: GlobalCharacterListKey) {
  const state = GlobalCharacter.getState();
  const old: any[] = state[key];
  const next = old.filter((x) => x.id !== targetId);

  GlobalCharacter[key](next);
}
