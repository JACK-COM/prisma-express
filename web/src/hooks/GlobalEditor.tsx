import { useEffect, useState } from "react";
import {
  GlobalEditorInstance,
  GlobalEditorInstanceKey,
  GlobalEditor,
  clearEditorBook,
  clearEditorChapter,
  clearEditorCharacter,
  clearEditorEvent,
  clearEditorGroup,
  clearEditorLocation,
  clearEditorRelationship,
  clearEditorScene,
  clearEditorSeries,
  clearEditorTimeline,
  clearEditorWorld,
  clearGlobalEditor
} from "state";

const ALL_KEYS: GlobalEditorInstanceKey[] = Object.keys(
  GlobalEditor.getState()
) as GlobalEditorInstanceKey[];
type HookState = Partial<GlobalEditorInstance>;

/**
 * Subscribe to `GlobalEditor` state
 */
export default function useGlobalEditor(
  keys: GlobalEditorInstanceKey[] = ALL_KEYS
) {
  const editorState = GlobalEditor.getState();
  const init = keys.reduce(
    (acc, key) => ({ ...acc, [key]: editorState[key] }),
    {} as HookState
  );
  const [state, setState] = useState(init);
  const onChange = (change: Partial<typeof state>) =>
    setState({ ...state, ...change });

  useEffect(() => GlobalEditor.subscribeToKeys(onChange, keys), []);

  return {
    ...state,

    // Helpers

    clearEditorBook,
    clearEditorChapter,
    clearEditorCharacter,
    clearEditorEvent,
    clearEditorGroup,
    clearEditorLocation,
    clearEditorRelationship,
    clearEditorScene,
    clearEditorSeries,
    clearEditorTimeline,
    clearEditorWorld,
    clearGlobalEditor
  };
}
