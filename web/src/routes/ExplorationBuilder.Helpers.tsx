import { UpsertExplorationInput } from "graphql/requests/explorations.graphql";
import {
  ExplorationSceneTemplate,
  SlotAction,
  InteractiveSlot,
  SlotInteraction
} from "utils/types";

/** Create an `Exploration Template` */
export function createExplorationTemplate(): UpsertExplorationInput {
  return {
    title: "",
    description: "",
    Scenes: []
  };
}

/** Create a scene for an `Exploration Template` */
export function createExplorationTemplateScene(
  order = 1
): ExplorationSceneTemplate {
  return {
    title: "New scene",
    description: "Text to show when the scene loads",
    order,
    characters: [],
    foreground: [],
    background: []
  };
}

/** Create an `on-screen item` for an `Exploration Template` layer */
export function createInteractiveSlot(): InteractiveSlot {
  return {
    xy: [250, 250], // offset to prevent hiding under the toolbar
    scale: [1, 1],
    anchor: [0.5, 0.5],
    url: "",
    interaction: { click: SlotAction.NONE, drag: SlotAction.NONE }
  };
}

/** Create an `Interaction` for an on-screen item  */
export function createInteraction(): SlotInteraction {
  return {
    click: SlotAction.NONE,
    data: {}
  };
}
