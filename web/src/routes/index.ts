const MediaPaths = (root: string) => ({
  Books: {
    path: `${root}/books`,
    text: "Books"
  }
});

/** All app route keys for maximum convenience */
type AppRoute =
  | "Search"
  | "Dashboard"
  | "BooksAndSeries"
  | "Timelines"
  | "Characters"
  | "Worlds";

/** All app routes for maximum convenience */
export const Paths: Record<AppRoute, Record<"Index" | string, RouteDef>> =
  {
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

    BooksAndSeries: {
      Index: {
        path: "/bibliography",
        text: "Books & Series"
      },
      Books: {
        path: "/bibliography/books",
        text: "My Books"
      },
      ManageBook: {
        path: "/bibliography/books/:bookId",
        text: "Manage Book"
      },
      NewBook: {
        path: "/bibliography/books/new",
        text: "New Book"
      },
      NewSeries: {
        path: "/bibliography/series/new",
        text: "New Series"
      },
      Series: {
        path: "/bibliography/series",
        text: "My Series"
      },
      SeriesById: {
        path: "/bibliography/series/:seriesId",
        text: "Manage Series"
      }
    },

    Timelines: {
      Index: {
        path: "/timelines",
        text: "Timelines & Events"
      },
      Events: {
        path: "/timelines/events",
        text: "Major Events"
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
      Locations: {
        path: "/worlds/:worldId/locations",
        text: "World Locations"
      }
    }
  };

export interface RouteDef {
  path: string;
  text: string;
  component?: any;
  render?: (p?: any) => JSX.Element;
}

// Replace id wildcard with actual id
export function insertId(path: string, id: string|number) {
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
