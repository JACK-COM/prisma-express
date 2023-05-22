/** @file GraphQL Queries */

/** graphql `User` fragment */
export const MFUserFragment = `
    id, displayName, email, firstName, lastName, image
`;

/** graphql `Character` fragment */
export const MFCharacterFragment = `
    id, name, description, authorId, groupId, locationId, worldId, 
`;

/** graphql `Character Relationship` fragment */
export const MFRelationshipFragment = `
    id, characterId, targetId, relationship, 
    Character { ${MFCharacterFragment} }
`;

/** graphql World `Event` fragment */
export const MFEventFragment = `
    id, name, description, target, polarity, authorId, characterId, groupId, locationId, worldId
`;

/** graphql `TimelineEvent` fragment (event linked to timeline) */
export const MFTimelineEventFragment = `
    id, order, timelineId, eventId, authorId,
    Event { ${MFEventFragment} }
`;

/** graphql `Location` fragment */
export const MFLocationFragment = `
    id, name, description, type, climate, fauna, flora, authorId, worldId, parentLocationId,
    ChildLocations {id, name, description, climate, fauna, flora, authorId, worldId, parentLocationId }
`;

/** graphql `World` fragment */
export const MFWorldFragment = `
    id, name, description, type, public, authorId, image, parentWorldId, 
    Locations { ${MFLocationFragment} },
    Events { ${MFEventFragment} },
    childWorldsCount,
    ChildWorlds { id, name, description, type, public, image, authorId }
`;

/** graphql `Timeline` fragment */
export const MFTimelineFragment = `
    id, name, authorId, worldId, 
    World { ${MFWorldFragment} },
    TimelineEvents { ${MFTimelineEventFragment} }
`;

/** graphql `Scene` fragment */
export const MFSceneFragment = `
    id, order, title, description, text, authorId, chapterId, characterId, eventContextId, timelineId
`;

/** graphql `Chapter` fragment */
export const MFChapterFragment = `
    id, order, title, description, authorId, bookId
`;

/** graphql `Book` fragment */
export const MFBookFragment = `
    id, title, description, order, genre, authorId, seriesId, locationId, worldId, public, image, free,
`;

/** graphql `Series` fragment */
export const MFSeriesFragment = `
    id, title, description, authorId, 
    Books { ${MFBookFragment} }
`;

/** graphql `ContentLink` fragment */
export const MFContentLinkFragment = `
    id, text, authorId, originId, seriesId, bookId, chapterId, sceneId
`;

/** search result fragment */
export const MFSearchResultFragment = `
    books { ${MFBookFragment} },
    series { ${MFSeriesFragment} }
`;
/** Exploration Scene Fragment */
export const MFExplorationSceneFragment = `
    id, title, config, description, order, authorId, background, foreground, characters, explorationId
`;

/** Exploration Fragment */
export const MFExplorationFragment = `
    id, title, description, usesAttributes, authorId, locationId, worldId, public, image, free,
`;
