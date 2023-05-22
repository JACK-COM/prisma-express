import createState from "@jackcom/raphsducks";
import { mergeLists } from "utils";
import {
  APIData,
  Exploration,
  ArrayKeys,
  ExplorationScene,
  ExplorationSceneTemplate,
  InteractiveSlot,
  Nullable,
  SlotInteraction,
  SlotInteractionData
} from "utils/types";

type APIExploration = APIData<Exploration>;
type APIExplorationScene = APIData<ExplorationScene>;
export type ActiveSceneData = { data: SlotInteractionData; name: string };

/** Global `Exploration` and exploration canvas state */
export const GlobalExploration = createState({
  /** Selected `Exploration` */
  exploration: null as Nullable<APIExploration>,
  /** List of user or available `Explorations` */
  explorations: [] as APIExploration[],
  /** Selected `Exploration Scene` */
  explorationScene: null as Nullable<ExplorationSceneTemplate>,
  /** Selected canvas layer */
  activeLayer: "all" as ExplorationSceneLayer,
  /** Selected `slot` (canvas item) */
  activeSlotIndex: -1,
  /** Dialogue or text description of a selected on-canvas item */
  sceneData: null as ActiveSceneData | null
});

export const explorationStoreKeys = Object.keys(
  GlobalExploration.getState()
) as ExplorationStoreKey[];
export type ExplorationStore = ReturnType<typeof GlobalExploration.getState>;
export type ExplorationStoreKey = keyof ExplorationStore;
export type ExplorationStoreListKeys = ArrayKeys<ExplorationStore>;
export type ExplorationSceneLayer =
  | "all"
  | "background"
  | "foreground"
  | "characters";

export const setGlobalLayer = (layer: ExplorationSceneLayer) =>
  GlobalExploration.multiple({ activeLayer: layer, activeSlotIndex: -1 });

export function setGlobalSlotIndex(
  activeSlotIndex = -1,
  activeLayer: ExplorationSceneLayer = "all"
) {
  GlobalExploration.multiple({ activeSlotIndex, activeLayer });
}

export function setGlobalSceneData(data: ActiveSceneData | null) {
  GlobalExploration.sceneData(data);
}

/** Update current list of `Explorations`; overwrite selected `Exploration` and `Scene` */
export function setGlobalExploration(exploration: APIExploration | null) {
  const { explorations: old } = GlobalExploration.getState();
  if (!exploration) {
    GlobalExploration.multiple({ exploration: null, explorationScene: null });
    return { exploration: null, explorations: old, explorationScene: null };
  }

  const updates = { exploration, ...updateListWithNewItems(exploration, old) };
  GlobalExploration.multiple(updates);
  return updates;
}

export function addGlobalExplorations(explorations: APIExploration[]) {
  if (!explorations.length) return;
  const state = GlobalExploration.getState();
  const { explorations: old, exploration } = state;
  const newExplorations = mergeLists(old, explorations);
  const updates = replaceItemWithNewList(exploration, newExplorations);
  GlobalExploration.multiple(updates);
  return updates;
}

/** Overwrite current selected `Scene` */
export function setGlobalExplorationScene(
  explorationScene: ExplorationSceneTemplate
) {
  GlobalExploration.multiple({
    explorationScene,
    activeLayer: "all",
    activeSlotIndex: -1,
    sceneData: null
  });
}

export function clearGlobalExploration() {
  GlobalExploration.multiple({ exploration: null });
}
// Select next scene or chapter in list
export function nextGlobalExplorationScene() {
  const { explorationScene } = GlobalExploration.getState();
  const { sceneTemps, updated } = __updateOrGetScenes();
  if (updated) return;
  const sceneIndex = sceneTemps.findIndex((s) => s.id === explorationScene?.id);
  const last = sceneTemps[sceneTemps.length - 1];
  const { order } = explorationScene || { order: 0 };
  const nextScene = explorationScene
    ? sceneTemps.find((s, i) => s.order === order + 1 || i === sceneIndex + 1)
    : last;
  return GlobalExploration.explorationScene(nextScene || last);
}

// Select previous scene or chapter in list
export function prevGlobalExplorationScene() {
  const { explorationScene } = GlobalExploration.getState();
  const { sceneTemps, updated } = __updateOrGetScenes();
  if (updated) return;
  const sceneIndex = sceneTemps.findIndex((s) => s.id === explorationScene?.id);
  const { order } = explorationScene || { order: 0 };
  const prevScene = explorationScene
    ? sceneTemps.find((s, i) => s.order === order - 1 || i === sceneIndex - 1)
    : sceneTemps[0];
  return GlobalExploration.explorationScene(prevScene || sceneTemps[0]);
}

function __updateOrGetScenes() {
  const { exploration, explorationScene } = GlobalExploration.getState();
  const { Scenes: scenes } = exploration || { Scenes: [] };
  if (!exploration || !scenes.length) return { updated: false, sceneTemps: [] };
  const sceneTemps = scenes.map(convertAPISceneToTemplate);
  const first = sceneTemps[0];
  if (!explorationScene) {
    GlobalExploration.explorationScene(first);
    return { updated: true, sceneTemps };
  }

  return { updated: false, sceneTemps };
}

/** Overwrite current list of `Explorations`, as well as selected `Exploration` and `Scene` */
export function setGlobalExplorations(explorations: APIExploration[]) {
  const state = GlobalExploration.getState();
  const { exploration: active, explorationScene: activeScene } = state;
  const exploration = active
    ? explorations.find((e) => e.id === active.id) || null
    : null;
  const scenes = (exploration?.Scenes || []).map(convertAPISceneToTemplate);
  const fallback = scenes[0] || null;
  const explorationScene =
    activeScene && scenes.length
      ? scenes.find((s) => s.id === activeScene.id) || fallback
      : fallback;
  const updates = { explorations, exploration, explorationScene };
  GlobalExploration.multiple(updates);
  return updates;
}

// Convert scene API data to a `ExplorationSceneTemplate`
export function convertAPISceneToTemplate(
  scene: APIExplorationScene
): ExplorationSceneTemplate {
  const background = scene.background ? JSON.parse(scene.background) : [];
  const foreground = scene.foreground ? JSON.parse(scene.foreground) : [];
  const characters = scene.characters ? JSON.parse(scene.characters) : [];
  const u = {
    ...scene,
    config: scene.config ? JSON.parse(scene.config) : {},
    background: Array.isArray(background) ? background.filter(Boolean) : [],
    foreground: foreground.filter(Boolean),
    characters: characters.filter(Boolean)
  };
  return u;
}

// Convert a `ExplorationSceneTemplate` to a scene for the API
export function convertTemplateToAPIScene(
  scene: ExplorationSceneTemplate
): APIExplorationScene {
  const reindexAndStringify = (arr: InteractiveSlot[]) =>
    arr
      ? JSON.stringify(
          arr.filter(Boolean).map((s, i) => ({ ...s, index: i + 1 }))
        )
      : "";
  const background = reindexAndStringify(scene.background);
  const foreground = reindexAndStringify(scene.foreground);
  const characters = reindexAndStringify(scene.characters);
  return {
    ...scene,
    config: JSON.stringify(scene.config),
    background,
    foreground,
    characters
  } as APIExplorationScene;
}

/** Update list of explorations (and selected scene) with a newly updated exploration */
function updateListWithNewItems(
  selected: APIExploration,
  explorations: APIExploration[]
) {
  const { explorationScene: activeScene } = GlobalExploration.getState();
  const newScenes = selected.Scenes.map(convertAPISceneToTemplate);
  const fallback = newScenes[0] || null;
  const newExplorations =
    explorations.length === 0
      ? [selected]
      : explorations.map((e) => (e.id === selected.id ? selected : e));
  const explorationScene = activeScene
    ? newScenes.find((s) => s.id === activeScene.id) || fallback
    : fallback;
  return { explorations: newExplorations, explorationScene };
}

/** Replace active exploration and scene with equivalents from updated list */
function replaceItemWithNewList(
  selected: APIExploration | null,
  explorations: APIExploration[]
) {
  const { explorationScene: activeScene } = GlobalExploration.getState();
  const defaults: Partial<ExplorationStore> = {
    exploration: null,
    activeSlotIndex: -1,
    activeLayer: "all",
    explorationScene: null,
    sceneData: null
  };
  if (!selected) return defaults;
  const newSelected = explorations.find((e) => e.id === selected.id);
  if (!newSelected) return defaults;
  if (!activeScene || !newSelected.Scenes)
    return { ...defaults, exploration: newSelected };

  const newScenes = newSelected.Scenes.map(convertAPISceneToTemplate);
  const fallback = newScenes[0] || null;
  const explorationScene = newScenes.find((s) => s.id === activeScene.id)
    ? activeScene
    : fallback;
  return { ...defaults, exploration: newSelected, explorationScene };
}
