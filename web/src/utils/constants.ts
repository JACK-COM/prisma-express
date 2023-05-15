import manifest from "../../package.json";
import { UserRole } from "./types";

export * from "./constants.books";
export const APP_VERSION = manifest.version;
export const APP_VERSION_KEY = "appv";
export const API_BASE = "http://localhost:4001";
export const API_AUTH_ROUTE = `${API_BASE}/authenticated`;
export const API_DL_BOOK_ROUTE = `${API_BASE}/books/:bookId/download`;
export const API_FILE_DELETE_ROUTE = `${API_BASE}/files/:category/delete`;
export const API_FILE_UPLOAD_ROUTE = `${API_BASE}/files/:category/upload`;
export const API_PROMPT = `${API_BASE}/books/writing-prompt`;
export const GRAPHQL_URL = `${API_BASE}/graphql`;
export const USER_ROLES: UserRole[] = ["Author", "Reader"];

// EXPLORATION stuff
/* export const EXPLORATION_TEMPLATES: ExplorationTemplate[] = [
  {
    type: ExplorationType.NOVEL,
    description: "A Graphic Novel-style exploration",
    sceneTypes: [
      {
        type: ExplorationTemplateSceneType.ROOM,
        description: "A room depicted as a graphic novel panel",
        slots: [...explorationTemplateSceneSlotTypes]
      },
      {
        type: ExplorationTemplateSceneType.DIALOGUE,
        description:
          "A dialogue between characters depicted as a graphic novel panel",
        slots: [
          ExplorationTemplateSceneSlotType.BACKGROUND,
          ExplorationTemplateSceneSlotType.FOREGROUND,
          ExplorationTemplateSceneSlotType.CHARACTER,
          ExplorationTemplateSceneSlotType.TEXT,
          ExplorationTemplateSceneSlotType.CHOICE
        ]
      },
      {
        type: ExplorationTemplateSceneType.MAP,
        description: "A map of the world",
        slots: [...explorationTemplateSceneSlotTypes]
      }
    ]
  }
]; */
