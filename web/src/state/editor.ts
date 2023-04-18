import createState from "@jackcom/raphsducks";
import { mergeLists } from "utils";
import {
  APIData,
  Character,
  Location,
  Book,
  Chapter,
  Scene,
  Series,
  World,
  WorldEvent,
  Timeline,
  CharacterRelationship,
  PopulationGroup
} from "utils/types";

/* Convenience */
type APIBook = Partial<APIData<Book>>;
type APIChapter = Partial<APIData<Chapter>>;
type APICharacter = Partial<APIData<Character>>;
type APIEvent = Partial<APIData<WorldEvent>>;
type APIGroup = Partial<APIData<PopulationGroup>>;
type APILocation = Partial<APIData<Location>>;
type APIRelationship = Partial<APIData<CharacterRelationship>>;
type APIScene = Partial<APIData<Scene>>;
type APISeries = Partial<APIData<Series>>;
type APITimeline = Partial<APIData<Timeline>>;
type APIWorld = Partial<APIData<World>>;
/* Convenience */

/** Anything that is currently being edited by the user. */
export const GlobalEditor = createState({
  /** Currently-selected `Book` */
  focusedBook: null as APIBook | null,
  /** Currently-selected `Chapter` */
  focusedChapter: null as APIChapter | null,
  /** Currently-selected `Scene` */
  focusedScene: null as APIScene | null,
  /** Currently-selected `Series` */
  focusedSeries: null as APISeries | null,
  /** Currently-selected `World` */
  focusedWorld: null as APIWorld | null,
  /** Currently-selected `Character` */
  focusedCharacter: null as APICharacter | null,
  /** Currently-selected `Location` */
  focusedLocation: null as APILocation | null,
  /** Currently-selected `Event` */
  focusedEvent: null as APIEvent | null,
  /** Currently-selected `Timeline` */
  focusedTimeline: null as APITimeline | null,
  /** Currently-selected `Relationship` */
  focusedRelationship: null as APIRelationship | null,
  /** Currently-selected `Group` */
  focusedGroup: null as APIGroup | null
});

export type GlobalEditorInstance = ReturnType<typeof GlobalEditor.getState>;
export type GlobalEditorInstanceKey = keyof GlobalEditorInstance;

//  LIST HELPERS

export function clearGlobalEditor() {
  GlobalEditor.multiple({
    focusedBook: null,
    focusedChapter: null,
    focusedCharacter: null,
    focusedEvent: null,
    focusedGroup: null,
    focusedLocation: null,
    focusedRelationship: null,
    focusedScene: null,
    focusedSeries: null,
    focusedTimeline: null,
    focusedWorld: null
  });
}

export function clearEditorBook() {
  GlobalEditor.focusedBook(null);
}

export function clearEditorChapter() {
  GlobalEditor.focusedChapter(null);
}

export function clearEditorCharacter() {
  GlobalEditor.focusedCharacter(null);
}

export function clearEditorEvent() {
  GlobalEditor.focusedEvent(null);
}

export function clearEditorGroup() {
  GlobalEditor.focusedGroup(null);
}

export function clearEditorLocation() {
  GlobalEditor.focusedLocation(null);
}

export function clearEditorRelationship() {
  GlobalEditor.focusedRelationship(null);
}

export function clearEditorScene() {
  GlobalEditor.focusedScene(null);
}

export function clearEditorSeries() {
  GlobalEditor.focusedSeries(null);
}

export function clearEditorTimeline() {
  GlobalEditor.focusedTimeline(null);
}

export function clearEditorWorld() {
  GlobalEditor.focusedWorld(null);
}
