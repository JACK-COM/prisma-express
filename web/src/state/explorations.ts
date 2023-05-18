import createState from "@jackcom/raphsducks";
import { mergeLists } from "utils";
import {
  ArrayKeys,
  ExplorationScene,
  ExplorationSceneTemplate,
  Nullable
} from "utils/types";
import { APIData, Exploration } from "utils/types";

type APIExploration = APIData<Exploration>;
type APIExplorationScene = APIData<ExplorationScene>;

export const GlobalExploration = createState({
  exploration: null as Nullable<APIExploration>,
  explorations: [] as APIExploration[],
  explorationScene: null as Nullable<ExplorationSceneTemplate>,
  activeLayer: "all" as ExplorationSceneLayer,
  activeSlotIndex: -1
});

export const explorationStoreKeys = Object.keys(
  GlobalExploration.getState()
) as ExplorationStoreKey[];
export type ExplorationStore = ReturnType<typeof GlobalExploration.getState>;
export type ExplorationStoreKey = keyof ExplorationStore;
export type ExplorationStoreListKeys = ArrayKeys<ExplorationStore>;
export type ExplorationSceneLayer = "all" | "background" | "foreground" | "characters";;

export const setGlobalLayer = (layer: ExplorationSceneLayer) =>
  GlobalExploration.multiple({ activeLayer: layer, activeSlotIndex: -1 });

export const setGlobalSlotIndex = (
  activeSlotIndex = -1,
  activeLayer: ExplorationSceneLayer = "all"
) => GlobalExploration.multiple({ activeSlotIndex, activeLayer });

/** Update current list of `Explorations`; overwrite selected `Exploration` and `Scene` */
export function setGlobalExploration(exploration: APIExploration | null) {
  const state = GlobalExploration.getState();
  const { explorations: old, explorationScene: activeScene } = state;
  if (!exploration) {
    GlobalExploration.multiple({ exploration: null, explorationScene: null });
    return { exploration: null, explorations: old, explorationScene: null };
  }

  const newScenes = exploration.Scenes.map(convertToSceneTemplate);
  const fallback = newScenes[0] || null;
  const explorations =
    old.length === 0
      ? [exploration]
      : old.map((e) => (e.id === exploration.id ? exploration : e));
  const explorationScene = activeScene
    ? newScenes.find((s) => s.id === activeScene.id) || fallback
    : fallback;

  GlobalExploration.multiple({ exploration, explorations, explorationScene });
  return { exploration, explorations, explorationScene };
}

/** Overwrite current selected `Scene` */
export function setGlobalExplorationScene(
  explorationScene: ExplorationSceneTemplate
) {
  GlobalExploration.multiple({ explorationScene });
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
  const sceneTemps = scenes.map(convertToSceneTemplate);
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
  const scenes = (exploration?.Scenes || []).map(convertToSceneTemplate);
  const fallback = scenes[0] || null;
  const explorationScene =
    activeScene && scenes.length
      ? scenes.find((s) => s.id === activeScene.id) || fallback
      : fallback;
  const updates = { explorations, exploration, explorationScene };
  GlobalExploration.multiple(updates);
  return updates;
}

// Convert a scene to a `ExplorationSceneTemplate`
export function convertToSceneTemplate(
  scene: APIExplorationScene
): ExplorationSceneTemplate {
  const background = scene.background ? JSON.parse(scene.background) : {};
  const foreground = scene.foreground ? JSON.parse(scene.foreground) : [];
  const characters = scene.characters ? JSON.parse(scene.characters) : [];
  return {
    ...scene,
    background,
    foreground,
    characters
  };
}

// Convert a `ExplorationSceneTemplate` to a scene for the API
export function convertTemplateToAPIScene(
  scene: ExplorationSceneTemplate
): APIExplorationScene {
  const background = scene.background ? JSON.stringify(scene.background) : "";
  const foreground = scene.foreground ? JSON.stringify(scene.foreground) : "";
  const characters = scene.characters ? JSON.stringify(scene.characters) : "";
  return {
    ...scene,
    background,
    foreground,
    characters
  } as APIExplorationScene;
}
