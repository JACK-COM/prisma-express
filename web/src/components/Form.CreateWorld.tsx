import { ChangeEvent, useMemo, useState } from "react";
import { noOp } from "../utils";
import { APIData, World, WorldCore, WorldType } from "../utils/types";
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
import { buildDescriptionPrompt } from "utils/prompt-builder";
import { useGlobalWorld } from "hooks/GlobalWorld";

export type CreateWorldProps = {
  onChange?: (data: Partial<CreateWorldData>) => void;
};

/** `WorldTypes` list */
const { Universe, Realm, Galaxy, Planet, Other } = WorldType;
const worldTypes = [Realm, Universe, Galaxy, Planet, Other];
const validateParents = (type: WorldType, worlds: APIData<World>[]) => {
  switch (type) {
    case Planet:
      return worlds.filter(({ type: t }) =>
        [Realm, Universe, Galaxy, Other].includes(t)
      );
    case Galaxy:
      return worlds.filter(({ type: t }) =>
        [Realm, Universe, Other].includes(t)
      );
    case Universe:
    case Realm:
      return worlds.filter(({ type: t }) => [Realm, Other].includes(t));
    default:
      return worlds;
  }
};

/** Create or edit a `World` */
const CreateWorldForm = (props: CreateWorldProps) => {
  const { onChange = noOp } = props;
  const { worlds = [], focusedWorld } = useGlobalWorld([
    "worlds",
    "focusedWorld"
  ]);
  const [data, setData] = useState({ ...focusedWorld });
  const [hasParent, parentName] = useMemo(() => {
    const { id, parentWorldId } = data || {};
    const isChild = id && parentWorldId;
    const pn = isChild
      ? worlds.reduce((agg, w) => {
          if (agg.length) return agg;
          if (w.id === parentWorldId) return w.name;
          const c = w.ChildWorlds.find((cw) => cw.id === parentWorldId);
          return c?.name || agg;
        }, "") || "another world"
      : "";
    return [isChild, pn];
  }, [data]);
  const validParents = useMemo(() => {
    const valid = worlds.filter((w) => w.id !== data?.id);
    if (!data.type) return valid;
    return validateParents(data.type, valid);
  }, [data, focusedWorld]);
  const onUpdate = (d: Partial<CreateWorldData>) => {
    setData(d);
    onChange(d);
  };
  const updatePublic = (e: boolean) => onUpdate({ ...data, public: e });
  const updateType = (type: WorldType) => onUpdate({ ...data, type });
  const updateDesc = (d: string) => onUpdate({ ...data, description: d });
  const updateTitle = (name: string) => onUpdate({ ...data, name });
  const updateParent = (p: number) => onUpdate({ ...data, parentWorldId: p });
  const getDescriptionIdea = async () => {
    const ideaPrompt = buildDescriptionPrompt({ ...data, type: "place" });
    if (!ideaPrompt) return;
    const idea = await getAndShowPrompt(ideaPrompt);
    if (idea) updateDesc(idea);
  };

  return (
    <Form>
      {data?.id ? (
        <Legend>
          Manage <b className="accent--text">{data.type}</b>
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
            data={worldTypes}
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
          <Select
            data={validParents}
            value={data?.parentWorldId || ""}
            itemText={(d) =>
              d.ChildWorlds.length > 0
                ? {
                    groupName: d.name,
                    text: (w) => `${w.name} (${w.type})`,
                    value: (w) => w.id,
                    options: d.ChildWorlds
                  }
                : `${d.name} (${d.type})`
            }
            itemValue={(d) => d.id}
            placeholder="Select Parent World (optional):"
            onChange={(pid) => updateParent(Number(pid))}
          />
        </Label>
      </FormRow>
      <Hint>
        {hasParent && (
          <span className="error--text">
            This world is a <b>child</b> of{" "}
            <b className="accent--text">{parentName}!</b>{" "}
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
