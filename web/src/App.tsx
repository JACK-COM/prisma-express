import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import { ThemeProvider } from "styled-components";
import viteLogo from "/vite.svg";
import "./App.scss";
import Button from "./components/Forms/Button";
import THEME, { getTheme, GlobalTheme, ThemeInstance } from "./theme/index";
import { GlobalUser } from "./state";
import { AUTH_ROUTE } from "./utils";
import AppNav from "./components/AppNav";

function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState(THEME[getTheme()] || {});
  const checkLoggedIn = async () => {
    const fOpts: RequestInit = { method: "post", credentials: "include" };
    const { user } = await fetch(AUTH_ROUTE, fOpts).then((r) => r.json());
    if (user) GlobalUser.multiple(user);
  };
  /* Listen to theme changes */
  const onTheme = (s: Partial<ThemeInstance>) => {
    if (s.theme !== undefined) setTheme(THEME[s.theme]);
  };

  useEffect(() => {
    if (!GlobalUser.getState().email) checkLoggedIn();
    return GlobalTheme.subscribeToKeys(onTheme, ["theme"]);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <THEME.GLOBAL />

      <Router>
        <section className="App">
          <AppNav />
  
          <div>
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <Button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </Button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </section>
      </Router>
    </ThemeProvider>
  );
}

export default App;
