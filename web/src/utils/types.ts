export type ContentStatus = "live" | "draft" | "hidden";
export type ReporterType = "experiencer" | "observer" | "researcher";
export type UserRole = "Admin" | "Moderator" | "Author" | "Reader";
export type NullableString = string | null;

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

/** The type of World (super-set of locations)  */
export enum WorldType {
  /** A dimensional causal space (e.g. with planets, stars, etc) */
  Universe = "Universe",
  /** A non-dimensional space where causal events still occur */
  Realm = "Realm",
  /** Something other than dimensional and non-dimensional */
  Other = "Other"
}

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

/** Content tagged to a `PopulationGroup` */
export type GroupRelation = {
  groupId?: number;
  Group?: APIData<PopulationGroup>;
};

/** Content tagged to a `Location` */
export type LocationRelation = {
  locationId?: number;
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
export type World = {
  public: boolean;
  name: string;
  description: string;
  type: WorldType;
  parentWorldId?: number;
  image?: string;
  Locations: APIData<Location>[];
  Timelines: APIData<Timeline>[];
  Events: APIData<WorldEvent>[];
  Groups: APIData<PopulationGroup>[];
  Characters: APIData<Character>[];
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
