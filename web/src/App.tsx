import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import "./App.scss";
import THEME from "./theme/index";
import { GlobalUser } from "./state";
import { AUTH_ROUTE } from "./utils";
import AppHeader from "components/AppHeader";
import { useGlobalTheme } from "hooks/GlobalTheme";
import FullScreenLoader from "components/Common/FullscreenLoader";

const Dashboard = lazy(() => import("./routes/Dashboard"));
const Home = lazy(() => import("./routes/Home"));

function App() {
  const { theme } = useGlobalTheme();
  const checkLoggedIn = async () => {
    const fOpts: RequestInit = { method: "post", credentials: "include" };
    const { user } = await fetch(AUTH_ROUTE, fOpts).then((r) => r.json());
    if (user) GlobalUser.multiple(user);
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
                path="/dashboard"
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />

              <Route
                path="*"
                element={
                  <Suspense fallback={<FullScreenLoader />}>
                    <Home />
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
