import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter as Router } from "react-router-dom";
import { LinkWithIcon, ButtonLink } from "components/Forms/Button";
import "./Material-Icons.css";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  /** Storybook HTML Page title */
  title: "Example/Links",
  /** React Component reference */
  component: LinkWithIcon,
  tags: ["autodocs"],

  /** Default props for all instances */
  args: { external: false, href: "#", icon: "public", text: "Go to Web" }
} satisfies Meta<typeof LinkWithIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args

/** Default button */
export const LinkDefault: Story = {
  name: "Default Link",
  render: ({ href, text }) => <ButtonLink href={href}>{text}</ButtonLink>
};

/** Link with an Icon */
export const LinkIcon: Story = {
  name: "Icon Link",
  render: (props) => (
    <Router>
      <LinkWithIcon
        icon={props.icon}
        text={props.text}
        external={props.external}
        href={props.href}
      />
    </Router>
  )
};
