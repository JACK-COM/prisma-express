import { UpsertExplorationInput } from "graphql/requests/explorations.graphql";
import {
  ExplorationSceneTemplate,
  SlotAction,
  InteractiveSlot,
  SlotInteraction,
  ExplorationCanvasType
} from "utils/types";

/** Create an `Exploration Template` */
export function createExplorationTemplate(): UpsertExplorationInput {
  return {
    title: "",
    config: `{}`,
    description: "",
    Scenes: []
  } as UpsertExplorationInput;
}

/** Create a scene for an `Exploration Template` */
export function createExplorationTemplateScene(
  order = 1
): ExplorationSceneTemplate {
  const config: ExplorationSceneTemplate = {
    title: "New scene",
    config: createExplorationSceneConfig(),
    description: "Text to show when the scene loads",
    order,
    characters: [],
    foreground: [],
    background: []
  };
  return config;
}

/** Create an `on-screen item` for an `Exploration Template` layer */
export function createInteractiveSlot(): InteractiveSlot {
  return {
    xy: [250, 250], // offset to prevent hiding under the toolbar
    scale: [1, 1],
    anchor: [0.5, 0.5],
    url: "",
    interaction: {}
  };
}

/** Create an empty `config` for a scene  */
export function createExplorationSceneConfig(): ExplorationSceneTemplate["config"] {
  return { type: ExplorationCanvasType.STORY };
}

/** Create an `Interaction` for an on-screen item  */
export function createInteraction(): SlotInteraction {
  return { data: {} };
}
