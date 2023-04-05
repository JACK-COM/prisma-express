import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { ThemeProvider } from "styled-components";
import viteLogo from "/vite.svg";
import "./App.scss";
import Button from "./components/Forms/Button";
import THEME, { getTheme, GlobalTheme, ThemeInstance } from "./theme/index";

function App() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState(THEME[getTheme()] || {});
  const onTheme = (s: Partial<ThemeInstance>) => {
    if (s.theme !== undefined) setTheme(THEME[s.theme]);
  };

  useEffect(() => {
    /* Listen to theme changes; you can expand on this functionality */
    return GlobalTheme.subscribeToKeys(onTheme, ["theme"]);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <THEME.GLOBAL />

      <section className="App">
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
    </ThemeProvider>
  );
}

export default App;
