import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import THEME from "./theme/index";
import { GlobalUser } from "./state";
import { useGlobalTheme } from "hooks/GlobalTheme";
import { loadUser } from "api/loadUserData";
import AppHeader from "components/AppHeader";
import FullScreenLoader from "components/Common/FullscreenLoader";
import ActiveNotifications from "components/ActiveNotifications";
import GlobalModalGroup from "components/Modals/GlobalModalGroup";
import { Paths, wildcard } from "routes";
import Home from "routes/Home";

const BookStoreRoute = lazy(() => import("routes/BookStore"));
const CharactersRoute = lazy(() => import("./routes/CharactersRoute"));
const Dashboard = lazy(() => import("./routes/DashboardRoute"));
const Explorations = lazy(() => import("./routes/ExplorationsRoute"));
const LibraryRoute = lazy(() => import("./routes/LibraryRoute"));
const NotFound = lazy(() => import("./routes/NotFound"));
const TimelinesRoute = lazy(() => import("./routes/TimelinesRoute"));
const WorldsRoute = lazy(() => import("./routes/WorldsRoute"));

function App() {
  const { theme } = useGlobalTheme();
  const checkLoggedIn = async () => await loadUser();

  useEffect(() => {
    if (!GlobalUser.getState().email) checkLoggedIn();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <THEME.GLOBAL />

      <Suspense fallback={<FullScreenLoader />}>
        <Router>
          <section id="App" className="App">
            <AppHeader />

            <Routes>
              <Route
                // Application Home + Author dashboard
                index
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <Home />
                  </Suspense>
                }
              />

              <Route
                // Application Home + Author dashboard
                path={wildcard(Paths.Dashboard.Index.path)}
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
                path={wildcard(Paths.Library.Index.path)}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <LibraryRoute />
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
                // Marketplace
                path={wildcard(Paths.BookStore.Index.path)}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <BookStoreRoute />
                  </Suspense>
                }
              />

              <Route
                // Explorations
                path={wildcard(Paths.Explorations.Index.path)}
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <Explorations />
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

      <ActiveNotifications />

      {/* Modals */}
      <GlobalModalGroup />
    </ThemeProvider>
  );
}

export default App;
