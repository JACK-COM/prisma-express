const MediaPaths = (root: string) => ({
  Books: {
    path: `${root}/books`,
    text: "Books"
  }
});

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
  Timelines: {
    Index: {
      path: "/timelines",
      text: "Timelines"
    }
  }
};

export interface RouteDef {
  path: string;
  text: string;
  component?: any;
  render?: (p?: any) => JSX.Element;
}
