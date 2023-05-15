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
import { buildDescriptionPrompt } from "utils/prompt-builder";
import { getAndShowPrompt } from "api/loadUserData";
import { UpsertExplorationInput } from "graphql/requests/explorations.graphql";
import { ButtonWithIcon } from "./Forms/Button";
import SelectParentWorld from "./SelectParentWorld";
import SelectParentLocation from "./SelectParentLocation";

export type CreateExplorationProps = {
  data?: Partial<UpsertExplorationInput>;
  onChange?: (data: Partial<UpsertExplorationInput>) => void;
  onCoverImage?: (data: File | undefined) => void;
};

/** Create or edit an `Exploration` */
const CreateExplorationForm = (props: CreateExplorationProps) => {
  const { data, onChange = noOp, onCoverImage = noOp } = props;
  const updatePublic = (e: boolean) =>
    onChange({ ...data, public: e || false });
  const updatePrice = (price: number = 0.0) => onChange({ ...data, price });
  const updateDescr = (d: string) => onChange({ ...data, description: d });
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, title: e.target.value });
  };
  const updateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files || [];
    if (file) onCoverImage(file);
  };
  const updateWorld = (i: number) => onChange({ ...data, worldId: i });
  const updateLocation = (i: number) => onChange({ ...data, locationId: i });
  const getSummaryIdea = async () => {
    const ideaPrompt = buildDescriptionPrompt({ ...data, type: "adventure" });
    if (!ideaPrompt) return;
    const idea = await getAndShowPrompt(ideaPrompt, false);
    if (idea) updateDescr(idea);
  };

  return (
    <Form>
      <Legend>
        {data?.id ? (
          `Edit ${data.title}`
        ) : (
          <>
            New <span className="accent--text">Exploration</span>
          </>
        )}
      </Legend>
      <Hint>
        Describe and configure your <b>Exploration</b>.
      </Hint>

      {/* Name */}
      <FormRow columns="repeat(2, 1fr)">
        <Label direction="column">
          <span className="label required">
            Exploration <span className="accent--text">Title</span>
          </span>
          <Input
            placeholder="The Frigid Sands of North Omarai"
            type="text"
            value={data?.title || ""}
            onChange={updateTitle}
          />
        </Label>
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

      <FormRow columns="repeat(2,1fr)">
        {/* World */}
        <Label direction="column">
          <span className="label">
            <b className="accent--text">World</b>:
          </span>
          <SelectParentWorld
            placeholder="Select world:"
            value={data?.worldId || ""}
            onChange={updateWorld}
          />
        </Label>

        {/* Location */}
        {data?.worldId && (
          <Label direction="column">
            <span className="label">
              <b className="accent--text">Location</b>:
            </span>
            <SelectParentLocation
              worldId={data.worldId}
              value={data.locationId || ""}
              onChange={updateLocation}
            />
          </Label>
        )}
      </FormRow>
      {/* Public/Private | Free/Paid */}
      <FormRow columns="repeat(2, 1fr)">
        <Label direction="column">
          <span className="label">
            Is this <b className="accent--text">public</b>?
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
        </Label>

        {/* Free/Paid */}
        <Label direction="column">
          <span className="label">
            Exploration <b className="accent--text">Price</b>?
          </span>
          <Input
            placeholder="0.00"
            type="text"
            value={data?.price || ""}
            onChange={({ target }) => updatePrice(Number(target.value))}
          />
        </Label>
      </FormRow>
      <Hint>
        Select <b>Public</b> if you would like other users to access the
        Exploration. Leave <b>price</b> blank (or enter <b>0</b>) to make this
        Exploration free.
      </Hint>

      {/* Description */}
      <Label direction="column">
        <span className="label required">Summary</span>
        <Textarea
          rows={300}
          style={{ width: "100%" }}
          value={data?.description || ""}
          onChange={({ target }) => updateDescr(target.value)}
        />
      </Label>
      <Hint>
        <b>This is your publicly-visible summary</b>. If the Exploration is
        private, you can enter writing-prompts and ideas, or leave this blank.
      </Hint>

      {!data?.description && (
        <ButtonWithIcon
          type="button"
          onClick={getSummaryIdea}
          icon="tips_and_updates"
          size="lg"
          text="Get description ideas"
        />
      )}
    </Form>
  );
};

export default CreateExplorationForm;
