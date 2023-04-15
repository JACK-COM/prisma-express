/** All app routes for maximum convenience */
export const Paths = {
  Search: {
    Index: {
      path: "/",
      text: "Search"
    },
    Results: {
      path: "/results",
      text: "Search results"
    }
  },

  Dashboard: {
    Index: {
      path: "/dashboard",
      text: "Dashboard"
    }
  },

  Library: {
    Index: {
      path: "/library",
      text: "Book Library"
    },
    Book: {
      path: "/library/books/:bookId",
      text: "View Book"
    },
    Series: {
      path: "/library/series/:seriesId",
      text: "View Book"
    }
  },

  Timelines: {
    Index: {
      path: "/timelines",
      text: "Timelines"
    },
    Events: {
      path: "/timelines/:timelineId/events",
      text: "Timeline Events"
    }
  },

  Characters: {
    Index: {
      path: "/characters",
      text: "Cast & Characters"
    },
    Relationships: {
      path: "/characters/relationships",
      text: "Relationships"
    }
  },

  Worlds: {
    Index: {
      path: "/worlds",
      text: "Worlds & Settings"
    },
    Events: {
      path: "/worlds/:worldId/events",
      text: "Major World Events"
    },
    Locations: {
      path: "/worlds/:worldId/locations",
      text: "World Locations"
    }
  }
};

/** All app route keys for maximum convenience */
export type AppRoutes = typeof Paths;
export interface RouteDef {
  path: string;
  text: string;
  component?: any;
  render?: (p?: any) => JSX.Element;
}

// Replace id wildcard with actual id
export function insertId(path: string, id: string | number) {
  return path.replace(/:\b(\w*Id)/, id.toString());
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
