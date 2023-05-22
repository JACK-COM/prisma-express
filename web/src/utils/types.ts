import { Container } from "@pixi/react";
import { ComponentPropsWithRef } from "react";

export type ContentStatus = "live" | "draft" | "hidden";
export type ReporterType = "experiencer" | "observer" | "researcher";
export type UserRole = "Admin" | "Moderator" | "Author" | "Reader";
export type NullableString = Nullable<string>;

/** File Upload category */
export type FileUploadCategory =
  | "users"
  | "characters"
  | "books"
  | "worlds"
  | "chapters"
  | "explorations"
  | "scenes";

/** Saved data from server. Use when an id is expected on an object */
export type APIData<T> = T & {
  id: number; //  @id @default(autoincrement())
};

/** User authentication source (server enum) */
export enum Authenticator {
  google = "google",
  magic = "magic",
  other = "other"
}

/** The general climate of a setting. */
export enum Climate {
  Warm = "Warm",
  Temperate = "Temperate",
  Polar = "Polar",
  Unspecified = "Unspecified"
}

/** The type of significant Event that occurs in a World */
export enum EventPolarity {
  PositiveExpected = "PositiveExpected",
  PositiveUnexpected = "PositiveUnexpected",
  Neutral = "Neutral",
  NegativeExpected = "NegativeExpected",
  NegativeUnexpected = "NegativeUnexpected"
}

export const EventPolarityText = (p: EventPolarity) => {
  const text = {
    [EventPolarity.PositiveExpected]: "Positive (expected)",
    [EventPolarity.PositiveUnexpected]: "Positive (unexpected)",
    [EventPolarity.Neutral]: "Neutral",
    [EventPolarity.NegativeExpected]: "Negative (expected)",
    [EventPolarity.NegativeUnexpected]: "Negative (unexpected)"
  };
  return text[p];
};

export const EventPolarityColors = (p?: EventPolarity) => {
  const colors = {
    [EventPolarity.PositiveUnexpected]: "#00982d",
    [EventPolarity.PositiveExpected]: "#47855a",
    [EventPolarity.Neutral]: "gray",
    [EventPolarity.NegativeExpected]: "#a66359",
    [EventPolarity.NegativeUnexpected]: "#a72d25"
  };
  return p ? colors[p] : "inherit";
};

export const EventPolaritySymbols = (p?: EventPolarity) => {
  const symbols = {
    [EventPolarity.PositiveExpected]: "👍",
    [EventPolarity.PositiveUnexpected]: "🤩",
    [EventPolarity.Neutral]: "🤷",
    [EventPolarity.NegativeExpected]: "👎",
    [EventPolarity.NegativeUnexpected]: "😱"
  };
  return p ? symbols[p] : symbols[EventPolarity.Neutral];
};

export const EventTargetSymbols = (p?: EventTarget) => {
  const symbols = {
    [EventTarget.World]: "public",
    [EventTarget.Local]: "pin_drop",
    [EventTarget.Person]: "face"
  };
  return p ? symbols[p] : symbols[EventTarget.World];
};

/** The target of a significant Event that occurs in a World */
export enum EventTarget {
  /** affects all characters in a World  */
  World = "World",
  /** affects only characters in a specific Location  */
  Local = "Local",
  /** affects one or more specific Characters  */
  Person = "Person"
}

/** A type of Group (super-set of Character types)  */
export enum GroupType {
  /** A race/ethnicity/tribe/nationality of characters */
  Culture = "Culture",
  /** A belief-system (religious/scientific/etc) */
  Philosophy = "Philosophy",
  /** A skilled craft e.g. blacksmithing */
  Trade = "Trade",
  /** Anything that doesn't cleanly fit into the above */
  Other = "Other"
}

/** Used to describe the relative abundance of resources.  */
export enum Richness {
  Abundant = "Abundant",
  Adequate = "Adequate",
  Sparse = "Sparse",
  Barren = "Barren",
  Unspecified = "Unspecified"
}

/** Used to describe a type of location */
export enum LocationType {
  Continent = "Continent",
  Region = "Region",
  Country = "Country",
  City = "City",
  Town = "Town",
  Village = "Village",
  Settlement = "Settlement",
  Ruins = "Ruins",
  Building = "Building",
  Other = "Other"
}

/** List of Location types */
export const locationTypes = Object.values(LocationType);

/** The type of World (super-set of locations)  */
export enum WorldType {
  /** A non-dimensional space where causal events still occur */
  Realm = "Realm",
  /** A dimensional causal space (e.g. with planets, stars, etc) */
  Universe = "Universe",
  /** A Galaxy */
  Galaxy = "Galaxy",
  /** A star or star system */
  Star = "Star",
  /** A planet-mass body with many sub-locations */
  Planet = "Planet",
  /** Something other than dimensional and non-dimensional (e.g. star's orbit) */
  Other = "Other"
}

/** List of World types */
export const worldTypes = Object.values(WorldType);

/** Content created by an author */
export type AuthorRelation = { authorId?: number; Author?: APIData<User> };

/** Content relating to a Series */
export type SeriesRelation = { seriesId?: number; Series?: APIData<Series> };

/** Content created by an author */
export type BookRelation = { bookId?: number; Book?: APIData<Book> };

/** Content relating to a `Character` */
export type CharacterRelation = {
  characterId?: number;
  Character?: APIData<Character>;
};

/** An `Exploration` is a CYOA-style exploration of a `World` or `Location`, based on a `Book` */
export type Exploration = {
  title: string;
  description?: string;
  image?: string;
  config?: string; // stringified JSON config data (`ExplorationCanvasConfig`)
  usesAttributes?: string;
  public?: boolean;
  price?: number;
  Scenes: APIData<ExplorationScene>[];
} & AuthorRelation &
  WorldRelation &
  LocationRelation;

/**
 * An `Exploration Scene` links a `Book Scene` to an `Exploration` instance. It contains additional JSON data
 * that is used to render the scene in the context of the exploration. */
export type ExplorationScene = {
  title: string;
  description: string;
  config?: string; // stringified JSON config data (`ExplorationCanvasConfig`)
  order: number;
  background: string; // JSON data for rendering background layer
  foreground: string; // JSON data for rendering foreground layer
  characters: string; // JSON data for rendering characters layer
  explorationId?: number; // ( references Exploration )
  Exploration?: Exploration; // @relation(fields: [explorationId], references: [id], onDelete: Cascade)
} & AuthorRelation;

export enum ExplorationCanvasType {
  STORY = "story",
  MAP = "map"
}
export const explorationCanvasTypes = Object.values(ExplorationCanvasType);

/** Configuration settings for the `Exploration` canvas */
export type ExplorationCanvasConfig = {
  type: ExplorationCanvasType;
  width?: number; // default 2000; required if creating map
  height?: number; // default 2000; required if creating map
};

/** @client  */
export enum SlotAction {
  NONE = "none", // Default no-op action
  CHOOSE = "Choose", // show choice dialog
  HIT_PLAYER = "Hit Player", // hit player with damage
  HIT_TARGET = "Hit Target", // hit selected target with damage
  NAV_SCENE = "Change Scene", // change room
  NAV_LOCATION = "Change Location", // link to another Exploration
  SHOW_TEXT = "Show Text" // show soem text description
}
export const explorationTemplateActions = Object.values(SlotAction).filter(
  (a) => a !== SlotAction.NONE
);

export enum ExplorationTemplateEvent {
  CLICK = "click",
  DRAG_HZ = "horizontal_drag",
  DRAG_VT = "vertical_drag"
}
export const explorationTemplateEvents = Object.values(
  ExplorationTemplateEvent
);

/** @client  */

/**
 * @client An `Exploration Template Scene` describes a type of scene in an `Exploration Template`.
 * It holds multiple `Exploration Template Slots`, each which defines how a `Book Scene` should be rendered.
 */
export type ExplorationSceneTemplate = Omit<
  ExplorationScene,
  | "background"
  | "config"
  | "foreground"
  | "characters"
  | "Author"
  | "Exploration"
> & {
  id?: number;
  /* JSON data for rendering scenes */
  config?: ExplorationCanvasConfig;
  /** scene background image (stringify to server; json.parse on load) */
  background: InteractiveSlot[];
  /** scene characters (stringify to server; json.parse on load) */
  characters: InteractiveSlot[];
  /** scene foreground images (stringify to server; json.parse on load) */
  foreground: InteractiveSlot[];
};
export type InternalPointLike = [x: number, y: number];

export type InteractiveSlotCore = {
  /** Slot name */
  name?: string;
  /** Slot coordinates, merged  */
  xy?: InternalPointLike;
} & Pick<ComponentPropsWithRef<typeof Container>, "scale" | "anchor">;

export type InteractiveSlot = {
  /** Slot image asset */
  url?: string;
  /** Slot index in scene */
  index?: number;
  /** Events and consequences triggered by this slot */
  interaction?: SlotInteraction;
  /** Disable position and size editing */
  lock?: { position?: boolean; size?: boolean };
} & InteractiveSlotCore;

export type SlotInteraction = {
  /** Interaction Event data */
  data?: SlotInteractionData;
  /** Interaction Event types */
  event?: ExplorationTemplateEvent;
  action?: SlotAction;
};
export type SlotInteractionChoice = {
  text: string;
  action: SlotAction;
  data?: SlotInteractionData;
};
export type SlotInteractionData = {
  /** Any text to show when interaction begins (attributed to slot-origin) */
  text?: string;
  /** Event target scene id */
  target?: number;
  /** Optional choices that can be made by triggering this slot */
  choices?: SlotInteractionChoice[];
};

/**
 * @client An `Exploration Template Scene Slot` describes a single slot in an `Exploration Template`.
 * It defines what data is required to fill the slot, which will in turn render an asset.
 */
export enum ExplorationTemplateSceneSlotType {
  /** A background image slot */
  BACKGROUND = "Background",
  /** A foreground image slot */
  FOREGROUND = "Foreground",
  /** A character image slot */
  CHARACTER = "Character",
  /** A text slot */
  TEXT = "Text",
  /** A choice slot */
  CHOICE = "Choice"
}

export const explorationTemplateSceneSlotTypes = Object.values(
  ExplorationTemplateSceneSlotType
);

/** Content tagged to a `PopulationGroup` */
export type GroupRelation = {
  groupId?: number;
  Group?: APIData<PopulationGroup>;
};

/** Content tagged to a `Location` */
export type LocationRelation = {
  locationId?: Nullable<number>;
  Location?: APIData<Location>;
};

/** Content added to a `Timeline` */
export type TimelineRelation = {
  timelineId?: number;
  Timeline?: APIData<Timeline>;
};

/** Content belonging to a `World` */
export type WorldRelation = { worldId?: number; World?: APIData<World> };

/** Confidential data required to create a User */
export type CreateUserInput = {
  authSource: Authenticator; // Authenticator (google, magic, other)
  password: string; //  @db.VarChar(255) // Account password
} & User;

/** App User (author) */
export type User = {
  email: string; //  @unique @db.VarChar(255)
  displayName: string;
  image?: string;
  created: string; //  @default(now()) // Account creation date
  lastSeen: string; //  @default(now()) // Last login date
  role: UserRole;
  Books?: APIData<Book>[];
  Chapters?: APIData<Chapter>[];
  Characters?: APIData<Character>[];
  Events?: APIData<Event>[];
  Groups?: APIData<PopulationGroup>[];
  Locations?: APIData<Location>[];
  Scenes?: APIData<Scene>[];
  Timelines?: APIData<Timeline>[];
  Worlds?: APIData<World>[];
  Series?: APIData<Series>[];
};

/** A `Book` is a collection of `Chapters` */
export type Book = {
  order?: number;
  image?: string;
  title: string;
  description: string;
  genre: string;
  public: boolean;
  free: boolean;
  price: number;
  worldId?: number; // partial world relation
  locationId?: number; // partial location relation
  Chapters: APIData<Chapter>[];
} & AuthorRelation &
  SeriesRelation;

/** A `Chapter` is a collection of `Scenes` */
export type Chapter = {
  order: number;
  image?: string;
  title: string;
  description: string;
  Scenes: APIData<Scene>[];
  Links: APIData<ContentLink>[];
} & AuthorRelation &
  BookRelation;

/** A `Character` is a significant actor in a story */
export type Character = {
  name: string;
  description: string;
  image?: string;
  Event: APIData<WorldEvent>[];
  Scene: APIData<Scene>[];
} & AuthorRelation &
  GroupRelation &
  LocationRelation &
  WorldRelation;

/** A `CharacterRelationship` associates two `Characters` */
export type CharacterRelationship = {
  characterId: number; // ( references Character  )
  targetId: number; // ( references Character | no relation )
  relationship: string;
} & CharacterRelation &
  AuthorRelation;

/** A `ContentLink` allows an author to link to a book scene */
export type ContentLink = {
  bookId: number;
  text: string;
  originId: number;
  seriesId?: number;
  chapterId?: number;
  sceneId?: number;
  authorId?: number;
};

/** `Event` (`WorldEvent` in UI) is a significant `World` occurrence */
export type WorldEvent = {
  name: string;
  description: string;
  target: EventTarget;
  polarity: EventPolarity;
} & AuthorRelation &
  CharacterRelation &
  GroupRelation &
  LocationRelation &
  WorldRelation;

/* A Location is typically a place on a world */
export type Location = {
  name: string;
  description: string;
  climate: Climate;
  fauna: Richness;
  flora: Richness;
  type: LocationType;
  parentLocationId?: number;
  westOf?: number;
  eastOf?: number;
  northOf?: number;
  southOf?: number;
  near?: number;
  Characters: Character[];
  Events: Event[];
  Groups: PopulationGroup[];
} & AuthorRelation &
  WorldRelation;

/** A `PopulationGroup` is a collection of Characters in a World or other location. */
export type PopulationGroup = {
  name: string;
  description: string;
  type: GroupType;
  Character: Character[];
  Event: Event[];
} & AuthorRelation &
  LocationRelation &
  WorldRelation;

/** A Scene is a collection of paragraphs where one or more Characters interact with (each other or a) distinct setting within a Location. A Scene happens in the context of a Story Chapter. */
export type Scene = {
  order: number;
  title: string;
  description: string;
  text: string;
  image?: string;
  chapterId: number;
  Chapter?: APIData<Chapter>;
  eventContextId?: number;
  EventContext: APIData<TimelineEvent>;
  Links: APIData<ContentLink>[]; // ( references ContentLink  )
} & AuthorRelation &
  CharacterRelation &
  LocationRelation &
  TimelineRelation;

/** A Series is a collection of two or more Books. */
export type Series = {
  title: string;
  description: string;
  public: boolean;
  free: boolean;
  genre: string;
  image?: string;
  Books: APIData<Book>[];
} & AuthorRelation;

/** A `Timeline` is named Event-sequence in a `World` */
export type Timeline = {
  name: string;
  TimelineEvents?: APIData<TimelineEvent>[];
} & AuthorRelation &
  WorldRelation;

/** A record that associates `Events` to `Timelines` */
export type TimelineEvent = {
  eventId: number;
  timelineId: number;
  order: number;
  Event?: APIData<WorldEvent>;
} & AuthorRelation &
  Pick<TimelineRelation, "Timeline">;

/** A `World` is the superset of locations where a story occurs */
export type WorldCore = {
  public: boolean;
  name: string;
  description: string;
  type: WorldType;
  image?: string;
};
export type World = WorldCore & {
  childWorldsCount: number;
  parentWorldId?: number | null;
  Locations: APIData<Location>[];
  Timelines: APIData<Timeline>[];
  Events: APIData<WorldEvent>[];
  Groups: APIData<PopulationGroup>[];
  Characters: APIData<Character>[];
  ChildWorlds: APIData<WorldCore>[];
} & AuthorRelation;

export type PermissionProps = { permissions: UserRole };

/** A `Library` associates a User with one or more Books */
export type LibraryPurchase = {
  userId: number;
  bookId?: number;
  seriesId?: number;
  order: number;
  publicPurchase: boolean;
  Book?: APIData<Book>;
  Series?: APIData<Series>;
};

/* HELPERS */

// An inferred type that extracts all array keys from a type
export type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

// A generally nullable type
export type Nullable<T> = T | null;
