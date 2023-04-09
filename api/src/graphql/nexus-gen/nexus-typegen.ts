/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { DBContext } from "./../context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * UTC Date-time
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "CsDateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * UTC Date-time
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "CsDateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  MFCharacterUpsertInput: { // input type
    authorId?: number | null; // Int
    description: string | null; // String
    groupId?: number | null; // Int
    id?: number | null; // Int
    locationId?: number | null; // Int
    name: string; // String!
    worldId: number; // Int!
  }
  MFLocationUpsertInput: { // input type
    authorId?: number | null; // Int
    climate?: NexusGenEnums['Climate'] | null; // Climate
    description: string; // String!
    fauna?: NexusGenEnums['Richness'] | null; // Richness
    flora?: NexusGenEnums['Richness'] | null; // Richness
    id?: number | null; // Int
    name: string; // String!
    worldId: number; // Int!
  }
  MFWorldUpsertInput: { // input type
    authorId?: number | null; // Int
    description: string; // String!
    id?: number | null; // Int
    name: string; // String!
    public?: boolean | null; // Boolean
    type: NexusGenEnums['WorldType']; // WorldType!
  }
}

export interface NexusGenEnums {
  Authenticator: "google" | "magic" | "other"
  Climate: "Polar" | "Temperate" | "Warm"
  EventPolarity: "NegativeExpected" | "NegativeUnexpected" | "Neutral" | "PositiveExpected" | "PositiveUnexpected"
  EventTarget: "Local" | "Person" | "World"
  GroupType: "Culture" | "Other" | "Philosophy" | "Trade"
  Richness: "Abundant" | "Adequate" | "Barren" | "Sparse"
  UserRole: "Author" | "Reader"
  WorldType: "Other" | "Realm" | "Universe"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  CsDateTime: any
}

export interface NexusGenObjects {
  MFBook: { // root type
    Author?: NexusGenRootTypes['MFUser'] | null; // MFUser
    Chapters: Array<NexusGenRootTypes['MFChapter'] | null>; // [MFChapter]!
    authorId?: number | null; // Int
    created: NexusGenScalars['CsDateTime']; // CsDateTime!
    description: string; // String!
    genre: string; // String!
    id: number; // Int!
    lastSeen: NexusGenScalars['CsDateTime']; // CsDateTime!
    order?: number | null; // Int
    seriesId?: number | null; // Int
    title: string; // String!
  }
  MFChapter: { // root type
    Author?: NexusGenRootTypes['MFUser'] | null; // MFUser
    Book?: NexusGenRootTypes['MFBook'] | null; // MFBook
    Scenes: Array<NexusGenRootTypes['MFScene'] | null>; // [MFScene]!
    authorId?: number | null; // Int
    bookId?: number | null; // Int
    created: NexusGenScalars['CsDateTime']; // CsDateTime!
    description: string; // String!
    id: number; // Int!
    lastSeen: NexusGenScalars['CsDateTime']; // CsDateTime!
    name: string; // String!
    order: number; // Int!
  }
  MFCharacter: { // root type
    CharacterRelationship?: Array<NexusGenRootTypes['MFCharacterRelationship'] | null> | null; // [MFCharacterRelationship]
    authorId?: number | null; // Int
    description: string; // String!
    groupId?: number | null; // Int
    id: number; // Int!
    locationId?: number | null; // Int
    name: string; // String!
    worldId?: number | null; // Int
  }
  MFCharacterRelationship: { // root type
    characterId: number; // Int!
    id: number; // Int!
    relationship: string; // String!
    targetId: number; // Int!
  }
  MFEvent: { // root type
    authorId?: number | null; // Int
    characterId?: number | null; // Int
    description: string; // String!
    groupId?: number | null; // Int
    id: number; // Int!
    locationId?: number | null; // Int
    name: string; // String!
    polarity: NexusGenEnums['EventPolarity']; // EventPolarity!
    target: NexusGenEnums['EventTarget']; // EventTarget!
    worldId: number; // Int!
  }
  MFLocation: { // root type
    Characters?: Array<NexusGenRootTypes['MFCharacter'] | null> | null; // [MFCharacter]
    Events?: Array<NexusGenRootTypes['MFEvent'] | null> | null; // [MFEvent]
    Groups?: Array<NexusGenRootTypes['MFPopulationGroup'] | null> | null; // [MFPopulationGroup]
    Scenes?: Array<NexusGenRootTypes['MFScene'] | null> | null; // [MFScene]
    World?: Array<NexusGenRootTypes['MFWorld'] | null> | null; // [MFWorld]
    authorId?: number | null; // Int
    climate: NexusGenEnums['Climate']; // Climate!
    description: string; // String!
    fauna: NexusGenEnums['Richness']; // Richness!
    flora: NexusGenEnums['Richness']; // Richness!
    id: number; // Int!
    name: string; // String!
    worldId: number; // Int!
  }
  MFParagraph: { // root type
    authorId?: number | null; // Int
    characterId?: number | null; // Int
    id: number; // Int!
    order: number; // Int!
    sceneId?: number | null; // Int
    text: string; // String!
  }
  MFPopulationGroup: { // root type
    Character: Array<NexusGenRootTypes['MFCharacter'] | null>; // [MFCharacter]!
    Event: Array<NexusGenRootTypes['MFEvent'] | null>; // [MFEvent]!
    authorId?: number | null; // Int
    description: string; // String!
    id: number; // Int!
    locationId?: number | null; // Int
    name: string; // String!
    type: NexusGenEnums['GroupType']; // GroupType!
    worldId: number; // Int!
  }
  MFScene: { // root type
    Paragraphs: Array<NexusGenRootTypes['MFParagraph'] | null>; // [MFParagraph]!
    authorId?: number | null; // Int
    chapterId: number; // Int!
    characterId?: number | null; // Int
    description: string; // String!
    eventContextId?: number | null; // Int
    id: number; // Int!
    locationId: number; // Int!
    name: string; // String!
    order: number; // Int!
    timelineId?: number | null; // Int
  }
  MFSeries: { // root type
    Author?: NexusGenRootTypes['MFUser'] | null; // MFUser
    Books: Array<NexusGenRootTypes['MFBook'] | null>; // [MFBook]!
    authorId?: number | null; // Int
    description: string; // String!
    genre: string; // String!
    id: number; // Int!
    order?: number | null; // Int
    title: string; // String!
  }
  MFTimeline: { // root type
    Scenes: Array<NexusGenRootTypes['MFScene'] | null>; // [MFScene]!
    authorId?: number | null; // Int
    description: string; // String!
    id: number; // Int!
    name: string; // String!
    order: number; // Int!
    worldId: number; // Int!
  }
  MFTimelineEvent: { // root type
    Scenes?: Array<NexusGenRootTypes['MFScene'] | null> | null; // [MFScene]
    authorId?: number | null; // Int
    eventId: number; // Int!
    id: number; // Int!
    order: number; // Int!
    timelineId: number; // Int!
  }
  MFUser: { // root type
    authSource: NexusGenEnums['Authenticator']; // Authenticator!
    created: NexusGenScalars['CsDateTime']; // CsDateTime!
    displayName: string; // String!
    email: string; // String!
    id: number; // Int!
    lastSeen: NexusGenScalars['CsDateTime']; // CsDateTime!
    role: NexusGenEnums['UserRole']; // UserRole!
  }
  MFWorld: { // root type
    Event?: Array<NexusGenRootTypes['MFEvent'] | null> | null; // [MFEvent]
    Groups?: Array<NexusGenRootTypes['MFPopulationGroup'] | null> | null; // [MFPopulationGroup]
    Locations?: Array<NexusGenRootTypes['MFLocation'] | null> | null; // [MFLocation]
    Timelines?: Array<NexusGenRootTypes['MFTimeline'] | null> | null; // [MFTimeline]
    authorId?: number | null; // Int
    description: string; // String!
    id: number; // Int!
    name: string; // String!
    public: boolean; // Boolean!
    type: NexusGenEnums['WorldType']; // WorldType!
  }
  Mutation: {};
  Query: {};
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  MFBook: { // field return type
    Author: NexusGenRootTypes['MFUser'] | null; // MFUser
    Chapters: Array<NexusGenRootTypes['MFChapter'] | null>; // [MFChapter]!
    authorId: number | null; // Int
    created: NexusGenScalars['CsDateTime']; // CsDateTime!
    description: string; // String!
    genre: string; // String!
    id: number; // Int!
    lastSeen: NexusGenScalars['CsDateTime']; // CsDateTime!
    order: number | null; // Int
    seriesId: number | null; // Int
    title: string; // String!
  }
  MFChapter: { // field return type
    Author: NexusGenRootTypes['MFUser'] | null; // MFUser
    Book: NexusGenRootTypes['MFBook'] | null; // MFBook
    Scenes: Array<NexusGenRootTypes['MFScene'] | null>; // [MFScene]!
    authorId: number | null; // Int
    bookId: number | null; // Int
    created: NexusGenScalars['CsDateTime']; // CsDateTime!
    description: string; // String!
    id: number; // Int!
    lastSeen: NexusGenScalars['CsDateTime']; // CsDateTime!
    name: string; // String!
    order: number; // Int!
  }
  MFCharacter: { // field return type
    CharacterRelationship: Array<NexusGenRootTypes['MFCharacterRelationship'] | null> | null; // [MFCharacterRelationship]
    authorId: number | null; // Int
    description: string; // String!
    groupId: number | null; // Int
    id: number; // Int!
    locationId: number | null; // Int
    name: string; // String!
    worldId: number | null; // Int
  }
  MFCharacterRelationship: { // field return type
    characterId: number; // Int!
    id: number; // Int!
    relationship: string; // String!
    targetId: number; // Int!
  }
  MFEvent: { // field return type
    authorId: number | null; // Int
    characterId: number | null; // Int
    description: string; // String!
    groupId: number | null; // Int
    id: number; // Int!
    locationId: number | null; // Int
    name: string; // String!
    polarity: NexusGenEnums['EventPolarity']; // EventPolarity!
    target: NexusGenEnums['EventTarget']; // EventTarget!
    worldId: number; // Int!
  }
  MFLocation: { // field return type
    Characters: Array<NexusGenRootTypes['MFCharacter'] | null> | null; // [MFCharacter]
    Events: Array<NexusGenRootTypes['MFEvent'] | null> | null; // [MFEvent]
    Groups: Array<NexusGenRootTypes['MFPopulationGroup'] | null> | null; // [MFPopulationGroup]
    Scenes: Array<NexusGenRootTypes['MFScene'] | null> | null; // [MFScene]
    World: Array<NexusGenRootTypes['MFWorld'] | null> | null; // [MFWorld]
    authorId: number | null; // Int
    climate: NexusGenEnums['Climate']; // Climate!
    description: string; // String!
    fauna: NexusGenEnums['Richness']; // Richness!
    flora: NexusGenEnums['Richness']; // Richness!
    id: number; // Int!
    name: string; // String!
    worldId: number; // Int!
  }
  MFParagraph: { // field return type
    authorId: number | null; // Int
    characterId: number | null; // Int
    id: number; // Int!
    order: number; // Int!
    sceneId: number | null; // Int
    text: string; // String!
  }
  MFPopulationGroup: { // field return type
    Character: Array<NexusGenRootTypes['MFCharacter'] | null>; // [MFCharacter]!
    Event: Array<NexusGenRootTypes['MFEvent'] | null>; // [MFEvent]!
    authorId: number | null; // Int
    description: string; // String!
    id: number; // Int!
    locationId: number | null; // Int
    name: string; // String!
    type: NexusGenEnums['GroupType']; // GroupType!
    worldId: number; // Int!
  }
  MFScene: { // field return type
    Paragraphs: Array<NexusGenRootTypes['MFParagraph'] | null>; // [MFParagraph]!
    authorId: number | null; // Int
    chapterId: number; // Int!
    characterId: number | null; // Int
    description: string; // String!
    eventContextId: number | null; // Int
    id: number; // Int!
    locationId: number; // Int!
    name: string; // String!
    order: number; // Int!
    timelineId: number | null; // Int
  }
  MFSeries: { // field return type
    Author: NexusGenRootTypes['MFUser'] | null; // MFUser
    Books: Array<NexusGenRootTypes['MFBook'] | null>; // [MFBook]!
    authorId: number | null; // Int
    description: string; // String!
    genre: string; // String!
    id: number; // Int!
    order: number | null; // Int
    title: string; // String!
  }
  MFTimeline: { // field return type
    Scenes: Array<NexusGenRootTypes['MFScene'] | null>; // [MFScene]!
    authorId: number | null; // Int
    description: string; // String!
    id: number; // Int!
    name: string; // String!
    order: number; // Int!
    worldId: number; // Int!
  }
  MFTimelineEvent: { // field return type
    Scenes: Array<NexusGenRootTypes['MFScene'] | null> | null; // [MFScene]
    authorId: number | null; // Int
    eventId: number; // Int!
    id: number; // Int!
    order: number; // Int!
    timelineId: number; // Int!
  }
  MFUser: { // field return type
    authSource: NexusGenEnums['Authenticator']; // Authenticator!
    created: NexusGenScalars['CsDateTime']; // CsDateTime!
    displayName: string; // String!
    email: string; // String!
    id: number; // Int!
    lastSeen: NexusGenScalars['CsDateTime']; // CsDateTime!
    role: NexusGenEnums['UserRole']; // UserRole!
  }
  MFWorld: { // field return type
    Event: Array<NexusGenRootTypes['MFEvent'] | null> | null; // [MFEvent]
    Groups: Array<NexusGenRootTypes['MFPopulationGroup'] | null> | null; // [MFPopulationGroup]
    Locations: Array<NexusGenRootTypes['MFLocation'] | null> | null; // [MFLocation]
    Timelines: Array<NexusGenRootTypes['MFTimeline'] | null> | null; // [MFTimeline]
    authorId: number | null; // Int
    description: string; // String!
    id: number; // Int!
    name: string; // String!
    public: boolean; // Boolean!
    type: NexusGenEnums['WorldType']; // WorldType!
  }
  Mutation: { // field return type
    deleteCharacter: NexusGenRootTypes['MFCharacter'] | null; // MFCharacter
    deleteLocation: NexusGenRootTypes['MFLocation'] | null; // MFLocation
    deleteWorld: NexusGenRootTypes['MFWorld'] | null; // MFWorld
    upsertCharacter: NexusGenRootTypes['MFCharacter'] | null; // MFCharacter
    upsertLocation: NexusGenRootTypes['MFLocation'] | null; // MFLocation
    upsertWorld: NexusGenRootTypes['MFWorld'] | null; // MFWorld
  }
  Query: { // field return type
    getCharacterById: NexusGenRootTypes['MFCharacter'] | null; // MFCharacter
    getLocationById: NexusGenRootTypes['MFLocation'] | null; // MFLocation
    getRelationshipById: NexusGenRootTypes['MFCharacterRelationship'] | null; // MFCharacterRelationship
    getWorldById: NexusGenRootTypes['MFWorld'] | null; // MFWorld
    listCharacters: Array<NexusGenRootTypes['MFCharacter'] | null> | null; // [MFCharacter]
    listLocations: Array<NexusGenRootTypes['MFLocation'] | null> | null; // [MFLocation]
    listRelationships: Array<NexusGenRootTypes['MFCharacterRelationship'] | null> | null; // [MFCharacterRelationship]
    listWorlds: Array<NexusGenRootTypes['MFWorld'] | null> | null; // [MFWorld]
  }
}

export interface NexusGenFieldTypeNames {
  MFBook: { // field return type name
    Author: 'MFUser'
    Chapters: 'MFChapter'
    authorId: 'Int'
    created: 'CsDateTime'
    description: 'String'
    genre: 'String'
    id: 'Int'
    lastSeen: 'CsDateTime'
    order: 'Int'
    seriesId: 'Int'
    title: 'String'
  }
  MFChapter: { // field return type name
    Author: 'MFUser'
    Book: 'MFBook'
    Scenes: 'MFScene'
    authorId: 'Int'
    bookId: 'Int'
    created: 'CsDateTime'
    description: 'String'
    id: 'Int'
    lastSeen: 'CsDateTime'
    name: 'String'
    order: 'Int'
  }
  MFCharacter: { // field return type name
    CharacterRelationship: 'MFCharacterRelationship'
    authorId: 'Int'
    description: 'String'
    groupId: 'Int'
    id: 'Int'
    locationId: 'Int'
    name: 'String'
    worldId: 'Int'
  }
  MFCharacterRelationship: { // field return type name
    characterId: 'Int'
    id: 'Int'
    relationship: 'String'
    targetId: 'Int'
  }
  MFEvent: { // field return type name
    authorId: 'Int'
    characterId: 'Int'
    description: 'String'
    groupId: 'Int'
    id: 'Int'
    locationId: 'Int'
    name: 'String'
    polarity: 'EventPolarity'
    target: 'EventTarget'
    worldId: 'Int'
  }
  MFLocation: { // field return type name
    Characters: 'MFCharacter'
    Events: 'MFEvent'
    Groups: 'MFPopulationGroup'
    Scenes: 'MFScene'
    World: 'MFWorld'
    authorId: 'Int'
    climate: 'Climate'
    description: 'String'
    fauna: 'Richness'
    flora: 'Richness'
    id: 'Int'
    name: 'String'
    worldId: 'Int'
  }
  MFParagraph: { // field return type name
    authorId: 'Int'
    characterId: 'Int'
    id: 'Int'
    order: 'Int'
    sceneId: 'Int'
    text: 'String'
  }
  MFPopulationGroup: { // field return type name
    Character: 'MFCharacter'
    Event: 'MFEvent'
    authorId: 'Int'
    description: 'String'
    id: 'Int'
    locationId: 'Int'
    name: 'String'
    type: 'GroupType'
    worldId: 'Int'
  }
  MFScene: { // field return type name
    Paragraphs: 'MFParagraph'
    authorId: 'Int'
    chapterId: 'Int'
    characterId: 'Int'
    description: 'String'
    eventContextId: 'Int'
    id: 'Int'
    locationId: 'Int'
    name: 'String'
    order: 'Int'
    timelineId: 'Int'
  }
  MFSeries: { // field return type name
    Author: 'MFUser'
    Books: 'MFBook'
    authorId: 'Int'
    description: 'String'
    genre: 'String'
    id: 'Int'
    order: 'Int'
    title: 'String'
  }
  MFTimeline: { // field return type name
    Scenes: 'MFScene'
    authorId: 'Int'
    description: 'String'
    id: 'Int'
    name: 'String'
    order: 'Int'
    worldId: 'Int'
  }
  MFTimelineEvent: { // field return type name
    Scenes: 'MFScene'
    authorId: 'Int'
    eventId: 'Int'
    id: 'Int'
    order: 'Int'
    timelineId: 'Int'
  }
  MFUser: { // field return type name
    authSource: 'Authenticator'
    created: 'CsDateTime'
    displayName: 'String'
    email: 'String'
    id: 'Int'
    lastSeen: 'CsDateTime'
    role: 'UserRole'
  }
  MFWorld: { // field return type name
    Event: 'MFEvent'
    Groups: 'MFPopulationGroup'
    Locations: 'MFLocation'
    Timelines: 'MFTimeline'
    authorId: 'Int'
    description: 'String'
    id: 'Int'
    name: 'String'
    public: 'Boolean'
    type: 'WorldType'
  }
  Mutation: { // field return type name
    deleteCharacter: 'MFCharacter'
    deleteLocation: 'MFLocation'
    deleteWorld: 'MFWorld'
    upsertCharacter: 'MFCharacter'
    upsertLocation: 'MFLocation'
    upsertWorld: 'MFWorld'
  }
  Query: { // field return type name
    getCharacterById: 'MFCharacter'
    getLocationById: 'MFLocation'
    getRelationshipById: 'MFCharacterRelationship'
    getWorldById: 'MFWorld'
    listCharacters: 'MFCharacter'
    listLocations: 'MFLocation'
    listRelationships: 'MFCharacterRelationship'
    listWorlds: 'MFWorld'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    deleteCharacter: { // args
      id: number; // Int!
    }
    deleteLocation: { // args
      id: number; // Int!
    }
    deleteWorld: { // args
      id: number; // Int!
    }
    upsertCharacter: { // args
      data: NexusGenInputs['MFCharacterUpsertInput']; // MFCharacterUpsertInput!
    }
    upsertLocation: { // args
      data: NexusGenInputs['MFLocationUpsertInput']; // MFLocationUpsertInput!
    }
    upsertWorld: { // args
      data: NexusGenInputs['MFWorldUpsertInput']; // MFWorldUpsertInput!
    }
  }
  Query: {
    getCharacterById: { // args
      id: number; // Int!
    }
    getLocationById: { // args
      id: number; // Int!
    }
    getRelationshipById: { // args
      id: number; // Int!
    }
    getWorldById: { // args
      id: number; // Int!
    }
    listCharacters: { // args
      authorId?: number | null; // Int
      description?: string | null; // String
      id?: number | null; // Int
      name?: string | null; // String
      worldId?: number | null; // Int
    }
    listLocations: { // args
      authorId?: number | null; // Int
      description?: string | null; // String
      id?: number | null; // Int
      name?: string | null; // String
      worldId: number; // Int!
    }
    listRelationships: { // args
      characterId?: number | null; // Int
      id?: number | null; // Int
      relationship?: string | null; // String
      targetId?: number | null; // Int
    }
    listWorlds: { // args
      authorId?: number | null; // Int
      description?: string | null; // String
      id?: number | null; // Int
      name?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: DBContext;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}