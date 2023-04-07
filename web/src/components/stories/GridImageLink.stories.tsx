import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import GridImageLink from "components/Common/GridImageLink";
import "./Material-Icons.css";
import styled from "styled-components";
import ImageLoader from "components/Common/ImageLoader";

const meta = {
  /** Storybook Section */
  title: "Example/Images",
  /** React Component reference */
  component: GridImageLink,
  /** Auto-generate docs */
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
} as Meta<typeof GridImageLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Storybook size restriction */
const FixedSizeGridImage = styled(GridImageLink)`
  width: 400px;
`;

/** Default GridImageLink */
export const GridImageLinkStory: Story = {
  name: "Grid Image Link",
  argTypes: {
    order: {
      description: "Arrangement of image and text",
      control: "radio",
      options: ["image-first", "text-first"]
    }
  },
  args: {
    image: "https://source.unsplash.com/random/400x400",
    order: "image-first",
    title: "Grid Image Title"
  },
  render: (props) => (
    <BrowserRouter>
      <FixedSizeGridImage
        href="#"
        image={props.image}
        title={props.title}
        order={props.order}
      />
    </BrowserRouter>
  )
};
