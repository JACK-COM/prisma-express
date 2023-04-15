import { ChangeEvent } from "react";
import { GENRES, noOp } from "../utils";
import {
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  RadioInput,
  RadioLabel,
  Select,
  TinyMCE
} from "components/Forms/Form";
import { UpsertBookData } from "graphql/requests/books.graphql";
import WorkCategory from "./Form.WorkCategory";

export type CreateBookProps = {
  data?: Partial<UpsertBookData>;
  onChange?: (data: Partial<UpsertBookData>) => void;
};

/** Create or edit a `Book` */
const CreateBookForm = (props: CreateBookProps) => {
  const { data, onChange = noOp } = props;
  const updatePublic = (e: boolean) => onChange({ ...data, public: e || false });
  const updateFree = (free: boolean) => onChange({ ...data, free });
  const updateDescription = (description: string) => {
    onChange({ ...data, description });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, title: e.target.value });
  };

  return (
    <Form>
      <Legend>
        {data?.id ? (
          `Edit ${data.title}`
        ) : (
          <>
            New <span className="accent--text">Book</span>
          </>
        )}
      </Legend>
      <Hint>
        Enter top-level information about your <b>Book</b>, like whether it is
        free or can be seen by other users.
      </Hint>

      {/* Name */}
      <Label direction="column">
        <span className="label required">Book Title</span>
        <Input
          placeholder="Omarai: Rise of the Reborn"
          type="text"
          value={data?.title || ""}
          onChange={updateTitle}
        />
      </Label>
      <Hint>Enter your exciting (or working) title here.</Hint>
      <hr />

      {/* Genre */}
      <WorkCategory
        value={data?.genre || ""}
        onChange={(genre) => onChange({ ...data, genre })}
      />

      {/* Public/Private */}
      <FormRow columns="repeat(2, 1fr)">
        <Label direction="column">
          <span className="label">
            Is this book <b className="accent--text">public</b>?
          </span>

          <FormRow>
            <RadioLabel>
              <span>Public</span>
              <RadioInput
                checked={data?.public || false}
                name="isPublic"
                onChange={() => updatePublic(true)}
              />
            </RadioLabel>
            <RadioLabel>
              <span>Private</span>
              <RadioInput
                checked={!data?.public}
                name="isPublic"
                onChange={() => updatePublic(false)}
              />
            </RadioLabel>
          </FormRow>
          <Hint>
            Select <b>Public</b> if you would like other users to cheer your
            progress.
          </Hint>
        </Label>

        {/* Free/Paid */}
        <Label direction="column">
          <span className="label">
            Is this book <b className="accent--text">free</b>?
          </span>

          <FormRow>
            <RadioLabel>
              <span>Free</span>
              <RadioInput
                checked={data?.free || false}
                name="isFree"
                onChange={() => updateFree(true)}
              />
            </RadioLabel>
            <RadioLabel>
              <span>Paid</span>
              <RadioInput
                checked={!data?.free}
                name="isFree"
                onChange={() => updateFree(false)}
              />
            </RadioLabel>
          </FormRow>
          <Hint>
            Select <b>Free</b> if you would like other users to add this to
            their library at no cost.
          </Hint>
        </Label>
      </FormRow>

      {/* Description */}
      <Label direction="column">
        <span className="label required">Summary</span>
        <TinyMCE
          height={300}
          value={data?.description || ""}
          onChange={updateDescription}
        />
      </Label>
      <Hint>
        <b>When you publish your book,</b> this section will become the
        publicly-visible summary. Until then, you can enter writing-prompts or
        leave this blank.
      </Hint>
    </Form>
  );
};

export default CreateBookForm;
