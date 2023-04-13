export type ContentStatus = "live" | "draft" | "hidden";
export type ReporterType = "experiencer" | "observer" | "researcher";
export type UserRole = "Author" | "Reader";
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
  Polar = "Polar"
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
  return p ? colors[p] : 'inherit';
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
  Barren = "Barren"
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
  created: string; //  @default(now()) // Account creation date
  lastSeen: string; //  @default(now()) // Last login date
  Books?: Book[];
  Chapters?: Chapter[];
  Characters?: Character[];
  Events?: Event[];
  Groups?: PopulationGroup[];
  Locations?: Location[];
  Paragraphs?: Paragraph[];
  Scenes?: Scene[];
  Timelines?: Timeline[];
  Worlds?: World[];
  Series?: Series[];
};

/** A `Book` is a collection of `Chapters` */
export type Book = {
  order?: number;
  title: string;
  description: string;
  genre: string;
  seriesId?: number;
  Chapters: Chapter[];
  Series?: Series[];
} & AuthorRelation;

/** A `Chapter` is a collection of `Scenes` */
export type Chapter = {
  order: number;
  name: string;
  description: string;
  Scenes: Scene[];
} & AuthorRelation &
  BookRelation;

/** A `Character` is a significant actor in a story */
export type Character = {
  name: string;
  description: string;
  Event: APIData<WorldEvent>[];
  Scene: APIData<Scene>[];
  Paragraph: APIData<Paragraph>[];
} & AuthorRelation &
  GroupRelation &
  LocationRelation &
  WorldRelation;

/** A `CharacterRelationship` associates two `Characters` */
export type CharacterRelationship = {
  characterId: number; // ( references Character  )
  targetId: number; // ( references Character | no relation )
  relationship: string;
  Character?: Character; // @relation(fields: [characterId], references: [id], onDelete: Cascade)
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
  Characters: Character[];
  Events: Event[];
  Groups: PopulationGroup[];
  Scenes: Scene[];
} & AuthorRelation &
  WorldRelation;

/** A Paragraph is a literal paragraph in a story. They can be combined to create scenes. */
export type Paragraph = {
  order: number;
  text: string;
  sceneId?: number;
  Scene?: Scene;
} & AuthorRelation &
  CharacterRelation;

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

/** A Scene is a collection of Paragraphs where one or more Characters interact with (each other or a) distinct setting within a Location. A Scene happens in the context of a Story Chapter. */
export type Scene = {
  order: number;
  name: string;
  description: string;
  chapterId: number;
  Chapter?: Chapter;
  eventContextId?: number;
  EventContext: TimelineEvent;
  Paragraphs: Paragraph[];
} & AuthorRelation &
  CharacterRelation &
  LocationRelation &
  TimelineRelation;

/** A Series is a collection of two or more Books. */
export type Series = {
  order: number;
  title: string;
  description: string;
  genre: string;
  Books: Book[];
} & AuthorRelation;

/** A `Timeline` is named Event-sequence in a `World` */
export type Timeline = {
  name: string;
  TimelineEvents?: TimelineEvent[];
} & AuthorRelation &
  WorldRelation;

/** A record that associates `Events` to `Timelines` */
export type TimelineEvent = {
  eventId: number;
  timelineId: number;
  order: number;
  Event?: WorldEvent;
} & AuthorRelation &
  Pick<TimelineRelation, "Timeline">;

/** A `World` is the superset of locations where a story occurs */
export type World = {
  public: boolean;
  name: string;
  description: string;
  type: WorldType;
  Location: APIData<Location>[];
  Timeline: APIData<Timeline>[];
  Events: APIData<WorldEvent>[];
  Groups: APIData<PopulationGroup>[];
  Characters: APIData<Character>[];
} & AuthorRelation;

export type PermissionProps = { permissions: UserRole };
