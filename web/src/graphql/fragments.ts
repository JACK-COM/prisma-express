/** @file GraphQL Queries */

/** graphql `User` fragment */
export const MFUserFragment = `
    id, displayName, email, 
`;

/** graphql `World` fragment */
export const MFWorldFragment = `
    id, name, description, type, public, authorId, 
`;

/** graphql `Character` fragment */
export const MFCharacterFragment = `
    id, name, description, authorId, groupId, locationId, worldId, 
`;

/** graphql `Character Relationship` fragment */
export const MFRelationshipFragment = `
    id, characterId, targetId, relationship, 
`;

/** graphql `World` fragment */
export const MFLocationFragment = `
    id, name, description, climate, fauna, flora, authorId, worldId, 
`;
