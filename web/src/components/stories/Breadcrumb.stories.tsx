import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Breadcrumbs from "components/Common/Breadcrumbs";
import "./Material-Icons.css";

const meta = {
  /** Storybook Section */
  title: "Example/Breadcrumbs",
  /** React Component reference */
  component: Breadcrumbs,
  tags: ["autodocs"],
  /** Controls for changing/previewing component props */
  argTypes: {
    data: {
      control: "array",
      description: "Array of route definitions"
    }
  },
  /** Default props for all instances */
  args: {}
} as Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args

/** Default Breadcrumbs */
export const BreadcrumbsDefault: Story = {
  name: "Default Breadcrumbs",
  render: () => (
    <BrowserRouter>
      <Breadcrumbs
        data={[
          { path: "/", text: "Home" },
          { path: "/about", text: "About" },
          { path: "/about/faq", text: "FAQ" },
          { path: "/about/faq/1", text: "FAQ 1" },
          { path: "/about/faq/2", text: "FAQ 2" }
        ]}
      />
    </BrowserRouter>
  )
};
