import { API_DL_BOOK_ROUTE } from "utils";
/** All app routes for maximum convenience */
export const Paths = {
  Search: {
    Index: { path: "/", text: "Search" },
    Results: { path: "/results", text: "Search results" }
  },

  Dashboard: {
    Index: { path: "/dashboard", text: "Home" },
    Settings: { path: "/dashboard/settings", text: "Settings" }
  },

  Library: {
    Index: { path: "/library", text: "Book Library" },
    BookDeepLink: {
      path: "/library/books/:bookId/link/:chapterOrder/:sceneOrder",
      text: "View Book"
    },
    BookEditor: { path: "/library/books/:bookId/edit", text: "Edit Book" },
    BookPreview: { path: "/library/books/:bookId/view", text: "View Book" },
    Series: { path: "/library/series/:seriesId", text: "View Book" }
  },

  BookStore: { Index: { path: "/bookstore", text: "Marketplace" } },

  Timelines: {
    Index: { path: "/timelines", text: "Timelines" },
    Events: { path: "/timelines/:timelineId/events", text: "Timeline Events" }
  },

  Characters: {
    Index: { path: "/characters", text: "Cast & Characters" },
    Relationships: { path: "/characters/relationships", text: "Relationships" }
  },

  Worlds: {
    Index: { path: "/worlds", text: "Worlds & Settings" },
    LocationsList: {
      path: "/worlds/:worldId/locations",
      text: "World Locations"
    },
    ViewLocation: {
      path: "/worlds/:worldId/locations/:locationId/view",
      text: "Location"
    }
  },

  Explorations: {
    Index: {
      path: "/explorations",
      text: "Explore Locations"
    },
    Build: {
      path: "/explorations/:explorationId/build",
      text: "Build Exploration"
    },
    Run: {
      path: "/explorations/:explorationId/run",
      text: "Run Exploration"
    }
  }
};

/** All app route keys for maximum convenience */
export type AppRoutes = typeof Paths;
export interface AppRouteDef {
  path: string;
  text: string;
  component?: any;
  render?: (p?: any) => JSX.Element;
}

export function downloadBookURL(bookId: number) {
  return insertId(API_DL_BOOK_ROUTE, bookId);
}

// Replace id wildcard with actual id
export function insertId(path: string, id: string | number, idKey?: string) {
  return idKey
    ? path.replace(`:${idKey}`, id.toString())
    : path.replace(/:\b(\w*Id)/, id.toString());
}

// Replace category wildcard with actual value
export function insertCategory(path: string, category: string) {
  return path.replace(/:\b(\w*category)/, category);
}

/**
 * Trim leading slashes from a string
 * @param s String to trim
 * @returns Trimmed string
 */
export function trimLeadingSlash(s: string) {
  return s.replace(/^\/+/, "");
}

/**
 * Trim parent segment from a path
 * @param s String to trim
 * @returns Trimmed string
 */
export function trimParent(s: string, parent: string) {
  const exp = new RegExp(`^\/${parent}\/`);
  return s.replace(exp, "");
}

/**
 * Turn a path into a react-router-friendly wildcard path
 * @param s String to trim
 * @returns Trimmed string
 */
export function wildcard(s: string) {
  return `${s}/*`;
}
