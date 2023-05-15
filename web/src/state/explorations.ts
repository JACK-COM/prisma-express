import createState from "@jackcom/raphsducks";
import { ArrayKeys, ExplorationSceneTemplate } from "utils/types";
import { ExplorationTemplateSceneSlotType } from "utils/types";
import { APIData, Exploration, InteractiveSlotWithPosition } from "utils/types";

type APIExploration = APIData<Exploration>;

export const GlobalExploration = createState({
  exploration: null as APIExploration | null,
  explorationScene: null as ExplorationSceneTemplate | null,
  explorations: [] as APIExploration[]
});

export const explorationStoreKeys = Object.keys(
  GlobalExploration.getState()
) as ExplorationStoreKey[];
export type ExplorationStore = ReturnType<typeof GlobalExploration.getState>;
export type ExplorationStoreKey = keyof ExplorationStore;
export type ExplorationStoreListKeys = ArrayKeys<ExplorationStore>;

export function setFocusedExploration(exploration: APIExploration) {
  const { explorations: old } = GlobalExploration.getState();
  const explorations = old.map((e) =>
    e.id === exploration.id ? exploration : e
  );
  GlobalExploration.multiple({
    exploration,
    explorations,
    explorationScene: null
  });
}

export function setFocusedExplorationScene(
  explorationScene: ExplorationSceneTemplate
) {
  GlobalExploration.multiple({ explorationScene });
}

export function clearFocusedExploration() {
  GlobalExploration.multiple({ exploration: null });
}

export function setExplorations(explorations: APIExploration[]) {
  GlobalExploration.multiple({ explorations });
}
