import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import THEME from "./theme/index";
import { GlobalUser } from "./state";
import { API_AUTH_ROUTE } from "./utils";
import AppHeader from "components/AppHeader";
import { useGlobalTheme } from "hooks/GlobalTheme";
import { loadUser, loadUserData } from "api/loadUserData";
import FullScreenLoader from "components/Common/FullscreenLoader";
import { Paths, wildcard } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import ActiveNotifications from "components/ActiveNotifications";
import ManageBookModal from "components/Modals/ManageBookModal";
import ManageChapterModal from "components/Modals/ManageChapterModal";
import ManageSceneModal from "components/Modals/ManageSceneModal";
import Home from "routes/Home";
import ManageContentLinksModal from "components/Modals/ManageLinksModal";

const CharactersRoute = lazy(() => import("./routes/CharactersRoute"));
const Dashboard = lazy(() => import("./routes/DashboardRoute"));
const LibraryRoute = lazy(() => import("./routes/LibraryRoute"));
const NotFound = lazy(() => import("./routes/NotFound"));
const TimelinesRoute = lazy(() => import("./routes/TimelinesRoute"));
const WorldsRoute = lazy(() => import("./routes/WorldsRoute"));

function App() {
  const { theme } = useGlobalTheme();
  const { active, MODAL } = useGlobalModal();
  const checkLoggedIn = async () => {
    const user = await loadUser();
    await loadUserData({ userId: user?.id });
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
      {active === MODAL.MANAGE_BOOK && (
        <ManageBookModal open={active === MODAL.MANAGE_BOOK} />
      )}

      {active === MODAL.MANAGE_CHAPTER && (
        <ManageChapterModal open={active === MODAL.MANAGE_CHAPTER} />
      )}

      {active === MODAL.MANAGE_SCENE && (
        <ManageSceneModal open={active === MODAL.MANAGE_SCENE} />
      )}

      {active === MODAL.LINK_SCENE && (
        <ManageContentLinksModal open={active === MODAL.LINK_SCENE} />
      )}
    </ThemeProvider>
  );
}

export default App;
