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
import { UpsertChapterData } from "graphql/requests/books.graphql";
import { useGlobalLibrary } from "hooks/GlobalLibrary";

export type CreateChapterProps = {
  data?: Partial<UpsertChapterData>;
  onChange?: (data: Partial<UpsertChapterData>) => void;
};

/** Create or edit a `Chapter` */
const CreateChapterForm = (props: CreateChapterProps) => {
  const { data, onChange = noOp } = props;
  const { focusedBook } = useGlobalLibrary(["focusedBook"]);
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
        New <span className="accent--text">Chapter</span>
      </Legend>
      <Hint>
        Create a <b>Chapter</b> in{" "}
        <b className="accent--text">{focusedBook?.title}</b>.
      </Hint>

      {/* Title */}
      <FormRow columns="max-content 8fr">
        <Label direction="column">
          <span className="label required">Chapter Number</span>
          <Input
            placeholder="The First Dawn"
            type="number"
            value={data?.order || 0}
            min={0}
            onChange={updateOrder}
          />
          <Hint>Enter your chapter title.</Hint>
        </Label>
        <Label direction="column">
          <span className="label required">Chapter Title</span>
          <Input
            placeholder="The First Dawn"
            type="text"
            value={data?.title || ""}
            onChange={updateTitle}
          />
          <Hint>Enter your chapter title.</Hint>
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
      <Hint>
        You can add a chapter overview, notes, or writing prompts here.
      </Hint>
    </Form>
  );
};

export default CreateChapterForm;
