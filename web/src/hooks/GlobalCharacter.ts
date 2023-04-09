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
  "selectedCharacter",
  "selectedRelationship",
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
    /** @helper Select a `Relationship` */
    setGlobalRelationship: (l: APIData<CharacterRelationship> | null) =>
      GlobalCharacter.selectedRelationship(l),
    /** @helper Select a `Character` */
    setGlobalCharacter: (w: APIData<Character> | null) =>
      GlobalCharacter.selectedCharacter(w),
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
