import type { Meta, StoryObj } from "@storybook/react";
import ImageLoader from "components/Common/ImageLoader";
import "./Material-Icons.css";

const meta = {
  /** Storybook Section */
  title: "Example/Images",

  /** React Component reference */
  component: ImageLoader,

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
} as Meta<typeof ImageLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ImageLoader */
export const ImageLoaderStory: Story = {
  name: "ImageLoader (default image)",
  argTypes: {},
  args: {
    src: "https://source.unsplash.com/random/400x400",
    title: "Image Title",
    icon: false,
    width: 400,
  },
  render: (props) => (
    <ImageLoader
      src={props.src}
      title={props.title}
      width={props.width}
      height={props.height}
    />
  )
};
