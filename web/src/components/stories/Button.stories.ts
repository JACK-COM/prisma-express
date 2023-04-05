import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Forms/Button";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
  /** Controls for changing/previewing component props */
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"], defaultValue: "md" },
    variant: {
      control: "radio",
      options: [undefined, "accent", "outlined", "transparent"]
    }
  },
  /** Default props for all instances */
  args: {
    children: "Button"
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = { args: { size: "md" } };

export const Round: Story = { args: { round: true, children: "i" } };
