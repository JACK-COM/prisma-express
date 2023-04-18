import { listCharacters } from "graphql/requests/characters.graphql";
import { useEffect, useState } from "react";
import {
  GlobalCharacter,
  GlobalCharacterInstance,
  GlobalCharacterInstanceKey,
  clearGlobalCharacter,
  updateRelationships,
  updateCharacters
} from "state";

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
    /** @helper Replace one or more `Character Relationships` in state */
    updateRelationships,
    /** @helper Replace one or more `Characters` in state */
    updateCharacters
  };
}
