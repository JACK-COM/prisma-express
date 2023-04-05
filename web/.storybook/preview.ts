import { ThemeProvider } from "styled-components";
import { withThemeFromJSXProvider } from "@storybook/addon-styling";
import type { Preview } from "@storybook/react";
import THEME from "../src/theme/index";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
};

export default preview;

export const decorators = [
  withThemeFromJSXProvider({
    GlobalStyles: THEME.GLOBAL,
    defaultTheme: "Dark",
    Provider: ThemeProvider,
    themes: {
      Dark: THEME.Dark,
      Light: THEME.Light
    }
  })
];
