import { UpsertExplorationInput } from "graphql/requests/explorations.graphql";
import {
  ExplorationSceneTemplate,
  InteractiveSlotWithPosition
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
    description: "Player sees this text when the scene loads",
    order,
    characters: [],
    foreground: [],
    background: { url: "" }
  };
}

/** Create a `character` or `foreground item` for an `Exploration Template` */
export function createInteractiveSlot(): InteractiveSlotWithPosition {
  return { xy: [0, 0], url: "", interactions: [] };
}
