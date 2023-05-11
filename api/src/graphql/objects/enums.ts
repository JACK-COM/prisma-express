import { enumType } from "nexus";

export const Authenticator = enumType({
  name: "Authenticator",
  description: "User authentication provider",
  members: {
    google: "google",
    magic: "magic",
    other: "other"
  }
});

export const Climate = enumType({
  name: "Climate",
  description: "The general climate of a setting.",
  members: {
    Warm: "Warm",
    Temperate: "Temperate",
    Polar: "Polar",
    Unspecified: "Unspecified"
  }
});

export const ChapterStatus = enumType({
  name: "ChapterStatus",
  description: "The status of a Chapter",
  members: {
    Draft: "Draft",
    Published: "Published",
    Archived: "Archived"
  }
});

export const EventPolarity = enumType({
  name: "EventPolarity",
  description: "The type of significant Event that occurs in a World.",
  members: {
    PositiveExpected: "PositiveExpected",
    PositiveUnexpected: "PositiveUnexpected",
    Neutral: "Neutral",
    NegativeExpected: "NegativeExpected",
    NegativeUnexpected: "NegativeUnexpected"
  }
});

export const EventTarget = enumType({
  name: "EventTarget",
  description: "The target of a significant Event that occurs in a World",
  members: {
    World: "World", // ( affects all characters in a World )
    Local: "Local", // ( affects only characters in a specific Location )
    Person: "Person" // ( affects one or more specific Characters )
  }
});

export const GroupType = enumType({
  name: "GroupType",
  description: "A super-set of Character types (e.g. trade profession)",
  members: {
    Culture: "Culture",
    Philosophy: "Philosophy",
    Trade: "Trade",
    Other: "Other"
  }
});

export const Richness = enumType({
  name: "Richness",
  description: "Relative abundance of resources.",
  members: {
    Abundant: "Abundant",
    Adequate: "Adequate",
    Sparse: "Sparse",
    Barren: "Barren",
    Unspecified: "Unspecified"
  }
});

export const UserRole = enumType({
  name: "UserRole",
  description: "A type of application user",
  members: {
    Admin: "Admin",
    Moderator: "Moderator",
    Author: "Author",
    Reader: "Reader"
  }
});

export const LocationType = enumType({
  name: "LocationType",
  description: "A type of Location",
  members: {
    Continent: "Continent",
    Country: "Country",
    City: "City",
    Town: "Town",
    Village: "Village",
    Region: "Region",
    Settlement: "Settlement",
    Building: "Building",
    Ruins: "Ruins",
    Other: "Other"
  }
});

export const WorldType = enumType({
  name: "WorldType",
  description: "A type of World (super-set of locations) ",
  members: {
    Universe: "Universe",
    Planet: "Planet",
    Galaxy: "Galaxy",
    Star: "Star",
    Realm: "Realm",
    Other: "Other"
  }
});
