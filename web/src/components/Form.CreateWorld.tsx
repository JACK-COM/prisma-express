import { useMemo, useState } from "react";
import { noOp } from "../utils";
import { worldTypes, WorldType } from "../utils/types";
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
  Textarea
} from "components/Forms/Form";
import { CreateWorldData } from "graphql/requests/worlds.graphql";
import { Accent } from "./Common/Containers";
import { ButtonWithIcon } from "./Forms/Button";
import { getAndShowPrompt } from "api/loadUserData";
import { DescribableType, buildDescriptionPrompt } from "utils/prompt-builder";
import SelectParentWorld from "./SelectParentWorld";
import { GlobalModal, GlobalWorld, MODAL } from "state";

export type CreateWorldProps = {
  onChange?: (data: Partial<CreateWorldData>) => void;
};

// Whether we're creating a new world or editing an existing one
const isCreating = () => GlobalModal.getState().active === MODAL.CREATE_WORLD;

// Empty/default form data
const emptyForm = (): Partial<CreateWorldData> => {
  const creating = isCreating();
  const { focusedWorld } = GlobalWorld.getState();
  return creating ? { parentWorldId: focusedWorld?.id } : { ...focusedWorld };
};

/** Get valid world types based on the current world type */
const validWorldTypes = (type?: WorldType) => {
  if (!type) return worldTypes;
  const tIndex = worldTypes.indexOf(type);
  return worldTypes.slice(tIndex + Number(isCreating()));
};

/** Create or edit a `World` */
const CreateWorldForm = (props: CreateWorldProps) => {
  const { onChange = noOp } = props;
  const { focusedWorld } = GlobalWorld.getState();
  const [data, setData] = useState<Partial<CreateWorldData>>(emptyForm());
  const hasParent = useMemo(() => {
    const { id, parentWorldId } = data || {};
    return id && parentWorldId;
  }, [data]);
  const onUpdate = (d: Partial<CreateWorldData>) => {
    setData(d);
    onChange(d);
  };
  const updatePublic = (e: boolean) => onUpdate({ ...data, public: e });
  const updateType = (type: WorldType) => onUpdate({ ...data, type });
  const updateDesc = (d: string) => onUpdate({ ...data, description: d });
  const updateTitle = (name: string) => onUpdate({ ...data, name });
  const updateParent = (parentWorldId: number | null) =>
    onUpdate({ ...data, parentWorldId });
  const getDescriptionIdea = async () => {
    const dt = data.type || "place";
    const ideaPrompt = buildDescriptionPrompt({ ...data, type: dt });
    if (!ideaPrompt) return;
    const idea = await getAndShowPrompt(ideaPrompt);
    if (idea) updateDesc(idea);
  };

  return (
    <Form>
      {data?.id ? (
        <Legend>
          Manage <Accent is="b">{data.type}</Accent>
        </Legend>
      ) : (
        <Legend>New World or Universe</Legend>
      )}

      <Hint>
        A <b>World</b> is <b>a collection of unique settings</b> in a story. It
        can be anything from a planet or galaxy to a dimension with neither
        space nor time -- as long as it contains two or more related settings.
      </Hint>

      <FormRow>
        {/* Name */}
        <Label direction="column">
          <span className="label required">
            <span className="accent--text">
              {data.id ? data.type : "World"} Name
            </span>
          </span>
          <Input
            placeholder="The Plains of Omarai"
            type="text"
            value={data?.name || ""}
            onChange={({ target }) => updateTitle(target.value)}
          />
        </Label>
        {/* World Type */}
        <Label direction="column">
          <span className="label required">
            What <Accent>type</Accent> of World is it?
          </span>
          <Select
            data={validWorldTypes(focusedWorld?.type)}
            value={data?.type || ""}
            itemText={(d) => d.valueOf()}
            itemValue={(d) => d}
            placeholder="Select a World Type:"
            onChange={updateType}
          />
        </Label>
      </FormRow>
      <Hint>
        Enter a name for your world. Select{" "}
        <b className="accent--text">Realm</b> if you are creating a mystical or
        transdimensional space.
      </Hint>

      <FormRow>
        {/* Public/Private */}
        <Label direction="column">
          <span className="label">
            Is this world <Accent>public</Accent>?
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

        {/* Parent World */}
        <Label direction="column">
          <span className="label">
            <Accent>Where</Accent> is it? (optional)
          </span>
          <SelectParentWorld
            excludeWorld={data.id}
            targetType={data.type}
            value={data.parentWorldId || undefined}
            onChange={updateParent}
          />
        </Label>
      </FormRow>
      <Hint>
        {hasParent && (
          <span className="error--text">
            This world has a <b>parent</b>!
          </span>
        )}
        You can set the world <b className="accent--text">Public</b> if you
        would like to share it with all users.{" "}
      </Hint>
      <hr />

      {/* Description */}
      <Label direction="column">
        <span className="label required">Short Description</span>
        <Textarea
          rows={300}
          value={data?.description || ""}
          onChange={(e) => updateDesc(e.target.value)}
        />
      </Label>
      <Hint>Describe your world as a series of short writing-prompts.</Hint>
      <hr />

      {!data?.description && (
        <ButtonWithIcon
          type="button"
          onClick={getDescriptionIdea}
          icon="tips_and_updates"
          size="lg"
          text="Get description ideas"
        />
      )}
    </Form>
  );
};

export default CreateWorldForm;
