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
import { UpsertSeriesData } from "graphql/requests/books.graphql";

export type CreateSeriesProps = {
  data?: Partial<UpsertSeriesData>;
  onChange?: (data: Partial<UpsertSeriesData>) => void;
};

/** Create or edit a `Series` */
const CreateSeriesForm = (props: CreateSeriesProps) => {
  const { data, onChange = noOp } = props;
  const updatePublic = (e: boolean) => onChange({ ...data, public: e });
  const updateFree = (free: boolean) => onChange({ ...data, free });
  const updateGenre = (genre: string) => onChange({ ...data, genre });
  const updateDescription = (description: string) => {
    onChange({ ...data, description });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, title: e.target.value });
  };

  return (
    <Form>
      <Legend>
        {data?.id ? `Edit ${data.title}` : "New Series or Universe"}
      </Legend>
      <Hint>
        A <b>Book Series</b> is a collection of <b>Books</b>, like a trilogy.
      </Hint>

      {/* Name */}
      <Label direction="column">
        <span className="label required">Series Title</span>
        <Input
          placeholder="Legends of Omarai"
          type="text"
          value={data?.title || ""}
          onChange={updateTitle}
        />
      </Label>
      <Hint>Enter your exciting (or working) title here.</Hint>

      {/* Genre */}
      <Label direction="column">
        <span className="label required">Series Genre</span>
        <Select
          data={GENRES.ALL}
          value={data?.genre || ""}
          itemText={(d) => d.valueOf()}
          itemValue={(d) => d}
          placeholder="Select a genre:"
          onChange={updateGenre}
        />
      </Label>
      <Hint>
        Select a <b>fiction</b> or <b>nonfiction</b> genre from the list. Select{" "}
        <b>Other</b> if you aren't sure!
      </Hint>

      {/* Public/Private */}
      <Label direction="column">
        <span className="label">
          Is this book <b>public</b>?
        </span>
        <Hint>
          Select <b>Public</b> if you would like other users to cheer your
          progress.
        </Hint>

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
      </Label>

      {/* Free/Paid */}
      <Label direction="column">
        <span className="label">
          Is this book <b>free</b>?
        </span>
        <Hint>
          Select <b>Free</b> if you would like other users to add this to their
          library at no cost.
        </Hint>

        <FormRow>
          <RadioLabel>
            <span>Public</span>
            <RadioInput
              checked={data?.free || false}
              name="isFree"
              onChange={() => updateFree(true)}
            />
          </RadioLabel>
          <RadioLabel>
            <span>Private</span>
            <RadioInput
              checked={!data?.free}
              name="isFree"
              onChange={() => updateFree(false)}
            />
          </RadioLabel>
        </FormRow>
      </Label>

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
        You can enter writing-prompts in the early stages. But{" "}
        <b>when you publish your book,</b> this section will become the
        publicly-visible summary.
      </Hint>
    </Form>
  );
};

export default CreateSeriesForm;
