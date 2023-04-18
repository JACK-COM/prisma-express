import { ChangeEvent } from "react";
import { noOp } from "../utils";
import {
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  Textarea
} from "components/Forms/Form";
import { UpsertSceneData } from "graphql/requests/books.graphql";
import { useGlobalLibrary } from "hooks/GlobalLibrary";

export type CreateSceneProps = {
  data?: Partial<UpsertSceneData>;
  onChange?: (data: Partial<UpsertSceneData>) => void;
};

/** Create or edit a `Scene` */
const CreateSceneForm = (props: CreateSceneProps) => {
  const { data, onChange = noOp } = props;
  const { focusedChapter } = useGlobalLibrary(["focusedChapter"]);
  const updateOrder = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, order: Number(e.target.value) });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, title: e.target.value });
  };
  const updateDescription = (d: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...data, description: d.target.value });
  };

  return (
    <Form>
      <Legend>
        New <span className="accent--text">Scene</span>
      </Legend>
      <Hint>
        Create a <b>Scene</b> in{" "}
        <b className="accent--text">{focusedChapter?.title}</b> (Chapter{" "}
        {focusedChapter?.order}).
      </Hint>

      {/* Title */}
      <FormRow columns="max-content 8fr">
        <Label direction="column">
          <span className="label required">Order</span>
          <Input
            placeholder="The First Dawn"
            type="number"
            value={data?.order || (focusedChapter?.Scenes || [])?.length + 1}
            min={0}
            onChange={updateOrder}
          />
          <Hint>Scene Order</Hint>
        </Label>
        <Label direction="column">
          <span className="label required">Scene Title</span>
          <Input
            placeholder="The First Dawn"
            type="text"
            value={data?.title || ""}
            onChange={updateTitle}
          />
          <Hint>Enter your scene title.</Hint>
        </Label>
      </FormRow>

      {/* Description */}
      <Label direction="column">
        <span className="label required">Short Description</span>
        <Textarea
          value={data?.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>You can add a scene overview, notes, or writing prompts here.</Hint>
    </Form>
  );
};

export default CreateSceneForm;
