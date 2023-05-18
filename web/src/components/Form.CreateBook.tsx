import { ChangeEvent } from "react";
import { noOp } from "../utils";
import {
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  RadioInput,
  RadioLabel,
  Textarea
} from "components/Forms/Form";
import { UpsertBookData } from "graphql/requests/books.graphql";
import LitCategory from "./Form.LitCategory";
import { buildDescriptionPrompt } from "utils/prompt-builder";
import { getAndShowPrompt } from "api/loadUserData";
import { ButtonWithIcon } from "./Forms/Button";
import { WritingPrompt } from "./WritingPrompt";

export type CreateBookProps = {
  data?: Partial<UpsertBookData>;
  onChange?: (data: Partial<UpsertBookData>) => void;
  onCoverImage?: (data: File | undefined) => void;
};

/** Create or edit a `Book` */
const CreateBookForm = (props: CreateBookProps) => {
  const { data, onChange = noOp, onCoverImage = noOp } = props;
  const updatePublic = (e: boolean) =>
    onChange({ ...data, public: e || false });
  const updatePrice = (price = 0.0) => onChange({ ...data, price });
  const updateDescription = (description: string) => {
    onChange({ ...data, description });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, title: e.target.value });
  };
  const updateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files || [];
    if (file) onCoverImage(file);
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

      {/* Cover Image + Name */}
      <FormRow columns="repeat(2, 1fr)">
        {/* Name */}
        <Label direction="column">
          <span className="label required">
            Book <span className="accent--text">Title</span>
          </span>
          <Input
            placeholder="Omarai: Rise of the Reborn"
            type="text"
            value={data?.title || ""}
            onChange={updateTitle}
          />
        </Label>

        {/* Cover Image */}
        <Label direction="column">
          <span className="label">
            Cover <span className="accent--text">Image</span>
          </span>
          <Input
            type="file"
            accept="image/*"
            onChange={updateImage}
            style={{ padding: "0 0.5rem" }}
          />
        </Label>
      </FormRow>
      <Hint>Enter your exciting (or working) title here.</Hint>
      <hr />

      {/* Genre */}
      <LitCategory
        value={data}
        onChange={(details) => onChange({ ...data, ...details })}
      />
      <hr />

      {/* Public/Private | Free/Paid */}
      <FormRow columns="repeat(2, 1fr)">
        {/* Public/Private */}
        <Label direction="column">
          <span className="label required">
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
            <b>Private</b> books won't appear in search results.
          </Hint>
        </Label>

        {/* Free/Paid */}
        <Label direction="column">
          <span className="label">
            Book <span className="accent--text">Price</span>
          </span>
          <Input
            placeholder="0.99"
            type="number"
            value={data?.price || ""}
            onChange={({ target }) => updatePrice(target.valueAsNumber)}
          />
          <Hint>Leave blank to keep the book free.</Hint>
        </Label>
      </FormRow>
      <hr />

      {/* Description */}
      <Label direction="column">
        <span className="label required">Summary</span>
        <Textarea
          rows={300}
          style={{ width: "100%" }}
          value={data?.description || ""}
          onChange={({ target }) => updateDescription(target.value)}
        />
      </Label>
      <Hint>
        <b>When you publish your book,</b> this section will become the
        publicly-visible summary. Until then, you can enter writing-prompts or
        leave this blank.
      </Hint>

      {!data?.description && (
        <WritingPrompt
          onPrompt={updateDescription}
          additionalData={{ ...data, type: "book" }}
          buttonText="Get description ideas"
        />
      )}
    </Form>
  );
};

export default CreateBookForm;
