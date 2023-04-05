import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Forms/Button";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
  /** Controls for changing/previewing component props */
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] }
  },
  /** Default props for all instances */
  args: {
    children: "Button"
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Main: Story = { args: {} };

export const Accent: Story = {
  args: { variant: "accent" }
};

export const Outlined: Story = {
  args: { variant: "outlined" }
};

export const Round: Story = { args: { round: true, children: "i" } };

export const Large: Story = {
  args: { size: "lg" }
};

export const Medium: Story = {
  args: { size: "md" }
};

export const Small: Story = {
  args: { size: "sm" }
};
