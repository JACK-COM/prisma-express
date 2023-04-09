/** @file GraphQL Queries */

/** graphql `User` fragment */
export const MFUserFragment = `
    id, displayName, email, 
`;

/** graphql `World` fragment */
export const MFWorldFragment = `
    id, name, description, type, public, authorId, 
`;

/** graphql `World` fragment */
export const MFLocationFragment = `
    id, name, description, climate, fauna, flora, authorId, worldId, 
`;
