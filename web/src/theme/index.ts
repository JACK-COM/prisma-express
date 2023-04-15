import createState from "@jackcom/raphsducks";
import { ThemeProps, createGlobalStyle } from "styled-components";
import DARK_THEME from "./theme.dark";
import LIGHT_THEME from "./theme.light";
import { AppTheme } from "shared";

export type UIThemeType = "Dark" | "Light";
export type GlobalTheme = Record<UIThemeType, AppTheme> & {
  GLOBAL: ReturnType<typeof createGlobalStyle>;
};
const THEME_KEY = "app-theme";

/* Global Application Style Theme */
const THEME: GlobalTheme = {
  Dark: DARK_THEME,
  Light: LIGHT_THEME,
  GLOBAL: createGlobalStyle`
  #root {
    margin: 0;
    width: 100%;
  }

  @media (prefers-reduced-motion: no-preference) {
    a:nth-of-type(2) .logo {
      animation: logo-spin infinite 20s linear;
    }
  }

  /* Main App container */
  .App {
    display: grid;
    grid-template-columns: 160px auto;
    min-height: 100vh;

    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: max-content;
    }
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: $parent;
  } 

  .flex {
    align-items: center;
    display: flex !important;
  } 

  .inline-flex {
    align-items: center;
    display: inline-flex !important;
  } 

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .sticky {
    position: sticky;
    z-index: 999;
  }

  html {
    height: 100vh;
    overflow: hidden;
  }

  body {
    background-color: ${({ theme: t }: ThemeProps<AppTheme>) =>
      t.colors.bgColor};
    color: ${({ theme }) => theme.colors.primary};
    font-family: 'Source Sans 3', sans-serif;
    height: 100%;
    margin: 0;
    overflow-y: auto;

    *:not(code) { 
      box-sizing: border-box;
    }

    .accent { 
      background-color: ${({ theme }) => theme.colors.accent}; 
    }
    .bg-color { 
      background-color: ${({ theme }) => theme.colors.bgColor}; 
    }
    .bg-gradient { 
      background: ${({ theme }) => theme.colors.bgGradient}; 
    }
    .error { 
      background-color: ${({ theme }) => theme.colors.error}; 
      color: white;
    }
    .warning { 
      background-color: ${({ theme }) => theme.colors.warning}; 
      color: white;
    }
    .flex {
      align-items: center;
      display: flex;
    }
    .grey {
      background-color: #9c9c9c;
    }
    .primary { 
      background-color: ${({ theme }) => theme.colors.primary}; 
    }
    .secondary { 
      background-color: ${({ theme }) => theme.colors.secondary}; 
    }
    .warning { 
      background-color: ${({ theme }) => theme.colors.warning}; 
    }
    .accent--text{ 
      color: ${({ theme }) => theme.colors.accent}; 
    }
    .bgColor--text{ 
      color: ${({ theme }) => theme.colors.bgColor}; 
    }
    .error--text{ 
      color: ${({ theme }) => theme.colors.error}; 
    }
    .grey--text {
      color: #9c9c9c;
    }
    .primary--text{ 
      color: ${({ theme }) => theme.colors.primary}; 
    }
    .secondary--text{ 
      color: ${({ theme }) => theme.colors.secondary}; 
    }
    .success--text{ 
      color: ${({ theme }) => theme.colors.success};
    }
    .warning--text{ 
      color: ${({ theme }) => theme.colors.warning}; 
    }
  
    a {
      color: ${({ theme }) => theme.colors.accent};
    }

    hr {
      background-color: ${({ theme }) => theme.colors.semitransparent};
      border: 0;
      height: 0.025rem;
    }
  }

  code {
    background-color: #07C;
    border-radius: ${({ theme }) => theme.presets.round.xs};
    display: inline-block;
    font-family: monospace; 
    padding: ${({ theme }) => `0 ${theme.sizes.xxs}`};
  }
  `
};

export const GlobalTheme = createState({ theme: "" as UIThemeType });
export type ThemeInstance = ReturnType<typeof GlobalTheme.getState>;

/** Get current UI theme from local storage */
export function getTheme(): UIThemeType {
  const { theme } = GlobalTheme.getState();
  if (!theme.length) {
    return setTheme((localStorage.getItem(THEME_KEY) || "Dark") as UIThemeType);
  }

  return theme;
}

/** Set current UI theme */
export function setTheme(newTheme: UIThemeType): UIThemeType {
  localStorage.setItem(THEME_KEY, newTheme);
  GlobalTheme.theme(newTheme);
  return newTheme;
}

export default THEME;
