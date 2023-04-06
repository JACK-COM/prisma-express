import type { Meta, StoryObj } from "@storybook/react";
import {
  CheckboxInput,
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  RadioInput,
  RadioLabel,
  Select,
  Textarea
} from "../Forms/Form";

const meta = {
  title: "Example/Form Components",
  component: Form,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: "fullscreen"
  },
  argTypes: {
    direction: {
      control: "radio",
      options: ["row", "column"],
      name: "Label Direction",
      description:
        "`Label` attribute (stacks label on input, or renders them side by side)"
    }
  }
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormRowStory: Story = {
  name: "Form Row",
  args: { type: "text", direction: "column", columns: 2 },
  render: ({ direction, columns }) => {
    const items: null[] = [];
    for (let index = 0; index < columns; index++) {
      items.push(null);
    }

    return (
      <>
        <FormRow columns={`repeat(${columns}, 1fr)`}>
          {items.map((item, i) => (
            <Label direction={direction} key={i}>
              <span className="label">Text Input</span>
              <Input type="text" placeholder="This is a text Input" />
            </Label>
          ))}
        </FormRow>

        <Hint>
          <code>&lt;FormRow /&gt;</code> does not accept <b>direction</b> as an
          attribute
        </Hint>
      </>
    );
  }
};

export const LabeledCheckbox: Story = {
  name: "Checkbox Inputs",
  args: { data: [1, 2, 3, 4] },
  render: ({ data }) => (
    <Form>
      <Legend>Radio Options</Legend>
      <Hint>This is an option hint</Hint>
      {data.map((o: any, i: number) => (
        <RadioLabel key={i}>
          <span>{o}</span>
          <CheckboxInput />
        </RadioLabel>
      ))}
    </Form>
  )
};

export const LabeledInput: Story = {
  name: "Labeled Input",
  args: { type: "text", direction: "column" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "number", "tel", "password"],
      description: "Input data-type"
    }
  },
  render: ({ type, direction }) => (
    <>
      <Label direction={direction}>
        <span className="label">Input Label</span>
        <Input type={type} placeholder="This is a default Input" />
      </Label>
      <Hint>This is an input hint</Hint>
    </>
  )
};

export const LabeledRadio: Story = {
  name: "Radio Inputs",
  args: { data: [1, 2, 3, 4] },
  render: ({ data }) => (
    <Form>
      <Legend>Radio Options</Legend>
      <Hint>This is an option hint</Hint>
      {data.map((o: any, i: number) => (
        <RadioLabel key={i}>
          <span>{o}</span>
          <RadioInput name="option" />
        </RadioLabel>
      ))}
    </Form>
  )
};

export const LabeledSelect: Story = {
  name: "Labeled Select",
  args: {
    data: [1, 2, 3, 4],
    placeholder: "Select an Item:",
    direction: "column"
  },
  render: ({ data, placeholder, direction }) => (
    <>
      <Label direction={direction}>
        <span className="label">Select Label</span>
        <Select
          placeholder={placeholder}
          data={data}
          itemText={(d) => d}
          itemValue={(d) => d}
        />
      </Label>
      <Hint>This is an input hint</Hint>
    </>
  )
};

export const LabeledTextarea: Story = {
  name: "Labeled Textarea",
  args: {
    data: [1, 2, 3, 4],
    placeholder: "Type as little or as much as you want!",
    direction: "column"
  },
  render: ({ data, placeholder, direction }) => (
    <>
      <Label direction={direction}>
        <span className="label">Enter a blurb of text</span>
        <Textarea placeholder={placeholder} />
      </Label>
      <Hint>This is an input hint</Hint>
    </>
  )
};
