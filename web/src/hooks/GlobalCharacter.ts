import {
  CharacterFilters,
  listCharacters
} from "graphql/requests/characters.graphql";
import { useEffect, useState } from "react";
import {
  GlobalCharacter,
  GlobalCharacterInstance,
  GlobalCharacterInstanceKey,
  clearGlobalCharacter,
  updateRelationships,
  updateCharacters
} from "state";
import { setCharacterStateList } from "state/character";
import { APIData, Character, CharacterRelationship } from "utils/types";

type HookState = Partial<GlobalCharacterInstance>;
const allKeys: GlobalCharacterInstanceKey[] = [
  "focusedCharacter",
  "focusedRelationship",
  "characters",
  "relationships"
];

/** Reusable subscription to `Character` state  */
export function useGlobalCharacter(
  keys: GlobalCharacterInstanceKey[] = allKeys
) {
  const gState = GlobalCharacter.getState();
  const init = keys.reduce((agg, k) => ({ ...agg, [k]: gState[k] }), {});
  const [state, setState] = useState<HookState>(init);
  const onCharacter = (s: HookState) => setState((prev) => ({ ...prev, ...s }));

  useEffect(() => GlobalCharacter.subscribeToKeys(onCharacter, keys), []);

  return {
    ...state,

    // Helpers
    /** @helper De-select the globally-selected `Character` */
    clearGlobalCharacter,
    loadCharacters,
    /** @helper Select a `Relationship` */
    setGlobalRelationship: (l: APIData<CharacterRelationship> | null) =>
      GlobalCharacter.focusedRelationship(l),
    /** @helper Select a `Character` */
    setGlobalCharacter: (w: APIData<Character> | null) =>
      GlobalCharacter.focusedCharacter(w),
    /** @helper Set a list of `Characters` */
    setGlobalCharacters: (w: APIData<Character>[]) =>
      setCharacterStateList(w, "characters"),
    /** @helper Set a list of `Character Relationships` */
    setGlobalRelationships: (w: APIData<CharacterRelationship>[]) =>
      setCharacterStateList(w, "relationships"),
    /** @helper Replace one or more `Character Relationships` in state */
    updateRelationships,
    /** @helper Replace one or more `Characters` in state */
    updateCharacters
  };
}

/** Load initial character data */
async function loadCharacters(authorId: number) {
  const { characters, focusedCharacter: focused } = GlobalCharacter.getState();
  if (characters.length > 1) return GlobalCharacter.characters([...characters]);

  const apiChars = await listCharacters({ authorId });
  const next = focused && apiChars.find((c) => c.id === focused.id);
  if (next) {
    GlobalCharacter.multiple({
      characters: apiChars,
      focusedCharacter: focused
    });
  } else GlobalCharacter.characters(apiChars);
}
