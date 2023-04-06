import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter as Router } from "react-router-dom";
import AppHeader from "../AppHeader";

const meta = {
  title: "Example/Header",
  component: AppHeader,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: "fullscreen"
  }
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {
  name: "App Header",
  render: () => (
    <Router>
      <AppHeader />
    </Router>
  )
};
