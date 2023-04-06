import type { Meta, StoryObj } from "@storybook/react";
import Button, { RoundButton, ButtonWithIcon } from "components/Forms/Button";
import { MatIcon } from "components/Common/Containers";
import "./Material-Icons.css";

const sizeArgs = () => ({
  size: {
    control: "radio",
    options: ["sm", "md", "lg"],
    defaultValue: "md",
    description:
      "Button size affects padding and width. `lg` buttons are full-width in their parent container."
  }
});

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  /** Storybook HTML Page title */
  title: "Example/Buttons",
  /** React Component reference */
  component: Button,
  tags: ["autodocs"],

  /** Controls for changing/previewing component props */
  argTypes: {
    variant: {
      control: "radio",
      description: "Quick color and border variant",
      options: ["accent", "outlined", "transparent"]
    }
  },

  /** Default props for all instances */
  args: { size: "md", children: "Button" }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args

/** Default button */
export const ButtonDefault: Story = {
  name: "Default Button",
  argTypes: { ...sizeArgs() }
};

/** Rounded button */
export const ButtonRounded: Story = {
  name: "Round Button",
  render: (props) => (
    <RoundButton size={props.size} variant={props.variant}>
      <MatIcon icon="account_circle" />
    </RoundButton>
  )
};

/** Button with Icon */
export const ButtonIconText: Story = {
  name: "Button with Icon + Text",
  args: { icon: "account_circle", text: "Hello" },
  render: (props) => (
    <ButtonWithIcon icon={props.icon} text={props.text} size={props.size} />
  )
};
