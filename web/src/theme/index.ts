import createState from "@jackcom/raphsducks";
import { ThemeProps, createGlobalStyle } from "styled-components";
import DARK_THEME from "./theme.dark";
import LIGHT_THEME from "./theme.light";
import { AppTheme } from "shared";

export type UIThemeType = "Dark" | "Light";
const THEME_KEY = "app-theme";

/* Global Application Style Theme */
const THEME: Record<UIThemeType, AppTheme> & { GLOBAL: any } = {
  Dark: DARK_THEME,
  Light: LIGHT_THEME,
  GLOBAL: createGlobalStyle`
  body {
    background-color: ${({ theme: t }: ThemeProps<AppTheme>) =>
      t.colors.bgColor};
    color: ${({ theme }) => theme.colors.primary};
  
    a {
      color: ${({ theme }) => theme.colors.accent};
    }

    .accent { 
      background-color: ${({ theme }) => theme.colors.accent}; 
    }
    .bg-color { 
      background-color: ${({ theme }) => theme.colors.bgColor}; 
    }
    .bg-gradient { 
      background-color: ${({ theme }) => theme.colors.bgGradient}; 
    }
    .error { 
      background-color: ${({ theme }) => theme.colors.error}; 
      color: white;
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
    .warning--text{ 
      color: ${({ theme }) => theme.colors.warning}; 
    }
  }
  `
};

export const GlobalTheme = createState({ theme: "" as UIThemeType });
export type ThemeInstance = ReturnType<typeof GlobalTheme.getState>;

/** Get current UI theme from local storage */
export function getTheme(): UIThemeType {
  const { theme } = GlobalTheme.getState();
  if (!theme.length) {
    return setTheme(
      (window.localStorage.getItem(THEME_KEY) || "Dark") as UIThemeType
    );
  }

  return theme;
}

/** Set current UI theme */
export function setTheme(newTheme: UIThemeType): UIThemeType {
  GlobalTheme.theme(newTheme);
  window.localStorage.setItem(THEME_KEY, newTheme);
  return newTheme;
}

export default THEME;
