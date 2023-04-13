import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import THEME from "./theme/index";
import { GlobalUser } from "./state";
import { AUTH_ROUTE } from "./utils";
import AppHeader from "components/AppHeader";
import { useGlobalTheme } from "hooks/GlobalTheme";
import FullScreenLoader from "components/Common/FullscreenLoader";
import { Paths, wildcard } from "routes";

const CharactersRoute = lazy(() => import("./routes/CharactersRoute"));
const Dashboard = lazy(() => import("./routes/Dashboard"));
const NotFound = lazy(() => import("./routes/NotFound"));
const TimelinesRoute = lazy(() => import("./routes/TimelinesRoute"));
const WorldsRoute = lazy(() => import("./routes/WorldsRoute"));

function App() {
  const { theme } = useGlobalTheme();
  const checkLoggedIn = async () => {
    const fOpts: RequestInit = { method: "post", credentials: "include" };
    const { user } = await fetch(AUTH_ROUTE, fOpts).then((r) => r.json());
    if (user) GlobalUser.multiple({ ...user, authenticated: true });
  };

  useEffect(() => {
    if (!GlobalUser.getState().email) checkLoggedIn();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <THEME.GLOBAL />

      <Suspense fallback={<FullScreenLoader />}>
        <Router>
          <section className="App">
            <AppHeader />

            <Routes>
              <Route
                // Application Home + Author dashboard
                index
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />

              <Route
                // Application Home + Author dashboard
                path={Paths.Dashboard.Index.path}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />

              <Route
                // Events and Timelines
                path={wildcard(Paths.Timelines.Index.path)}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <TimelinesRoute />
                  </Suspense>
                }
              />

              <Route
                // Books and Series
                path={wildcard(Paths.BooksAndSeries.Index.path)}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />

              <Route
                // Cast and Characters
                path={wildcard(Paths.Characters.Index.path)}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <CharactersRoute />
                  </Suspense>
                }
              />

              <Route
                // Worlds and settings
                path={wildcard(Paths.Worlds.Index.path)}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <WorldsRoute />
                  </Suspense>
                }
              />

              <Route
                // Not Found
                path="*"
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </section>
        </Router>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
