/** @file GraphQL Queries */

/** graphql `User` fragment */
export const MFUserFragment = `
    id, displayName, email, firstName, lastName, 
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
    id, name, description, climate, fauna, flora, authorId, worldId, 
`;

/** graphql `World` fragment */
export const MFWorldFragment = `
    id, name, description, type, public, authorId, 
    Locations { ${MFLocationFragment} },
    Events { ${MFEventFragment} },
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
    id, title, description, order, genre, authorId, seriesId, public, free,
`;

/** graphql `Series` fragment */
export const MFSeriesFragment = `
    id, name, description, authorId, worldId,
    Books {
      ${MFBookFragment}
    }
`;

/** graphql `ContentLink` fragment */
export const MFContentLinkFragment = `
    id, text, authorId, originId, seriesId, bookId, chapterId, sceneId
`;