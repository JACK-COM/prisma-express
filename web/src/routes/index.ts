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
        path: "/books",
        text: "My Books"
      },
      BookById: {
        path: "/books/:bookId",
        text: "Manage Book"
      },
      NewBook: {
        path: "/books/new",
        text: "New Book"
      },
      NewSeries: {
        path: "/series/new",
        text: "New Series"
      },
      Series: {
        path: "/series",
        text: "My Series"
      },
      SeriesById: {
        path: "/series/:seriesId",
        text: "Manage Series"
      }
    },

    Timelines: {
      Index: {
        path: "/timelines",
        text: "Timelines & Events"
      },
      Events: {
        path: "/events",
        text: "Major Events"
      }
    },

    Characters: {
      Index: {
        path: "/characters",
        text: "Cast & Characters"
      },
      Relationships: {
        path: "/relationships",
        text: "Relationships"
      }
    },

    Worlds: {
      Index: {
        path: "/worlds",
        text: "Worlds & Settings"
      },
      Locations: {
        path: "/locations",
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

/**
 * Trim leading slashes from a string
 * @param s String to trim
 * @returns Trimmed string
 */
export function trimLeadingSlash(s: string) {
  return s.replace(/^\/+/, "");
}

/**
 * Turn a path into a react-router-friendly wildcard path
 * @param s String to trim
 * @returns Trimmed string
 */
export function wildcard(s: string) {
  return `${s}/*`;
}
