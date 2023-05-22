import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { noOp } from "../utils";
import {
  Fieldset,
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
import useGlobalExploration from "hooks/GlobalExploration";
import { Accent } from "./Common/Containers";
import { WritingPrompt } from "./WritingPrompt";
import {
  createExplorationSceneConfig,
  createExplorationTemplateScene
} from "routes/ExplorationBuilder.Helpers";
import { GlobalExploration, GlobalModal, GlobalUser, MODAL } from "state";
import {
  ExplorationCanvasConfig,
  ExplorationCanvasType,
  ExplorationSceneTemplate,
  explorationCanvasTypes
} from "utils/types";

export type CreateExplorationSceneProps = {
  onChange?: (data: ExplorationSceneTemplate) => void;
};

const emptyForm = (): ExplorationSceneTemplate => {
  const { explorationScene, exploration } = GlobalExploration.getState();
  const { active } = GlobalModal.getState();
  const { id: authorId } = GlobalUser.getState();
  let $form = createExplorationTemplateScene();
  $form.authorId = authorId;
  $form.order = (exploration?.Scenes ?? []).length + 1;
  if (active === MODAL.MANAGE_EXPLORATION_SCENE && explorationScene) {
    $form = { ...explorationScene };
  }
  if (exploration && !$form.explorationId) $form.explorationId = exploration.id;
  return $form;
};

/** Create or edit a `ExplorationScene` */
const CreateExplorationSceneForm = (props: CreateExplorationSceneProps) => {
  const { onChange = noOp } = props;
  const { explorationScene } = useGlobalExploration(["explorationScene"]);
  const initialFormData = emptyForm();
  const [data, setData] = useState(initialFormData);
  const config = useMemo(
    () =>
      (data.config ||
        createExplorationSceneConfig()) as ExplorationCanvasConfig,
    [data]
  );
  const update = (data: ExplorationSceneTemplate) => {
    setData(data);
    onChange(data);
  };
  const updateOrder = (e: ChangeEvent<HTMLInputElement>) => {
    update({ ...data, order: Number(e.target.value) });
  };
  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    update({ ...data, title: e.target.value });
  };
  const updateDescription = (description: string) =>
    update({ ...data, description });
  const updateConfigWidth = (v: number) =>
    onChange({ ...data, config: { ...config, width: v } });
  const updateConfigHeight = (v: number) =>
    onChange({ ...data, config: { ...config, height: v } });
  const updateConfigType = (type: ExplorationCanvasType) => {
    const next: ExplorationCanvasConfig = { type };
    if (type === ExplorationCanvasType.MAP) {
      next.width = 2000;
      next.height = 2000;
    }
    update({ ...data, config: next });
  };

  useEffect(() => {
    update(initialFormData);
  }, []);

  return (
    <Form>
      <Legend>
        New <span className="accent--text">Exploration Scene</span>
      </Legend>
      <Hint>
        Create a <b>ExplorationScene</b> in{" "}
        <b className="accent--text">{explorationScene?.title}</b> (Chapter{" "}
        {explorationScene?.order}).
      </Hint>

      {/* Title */}
      <FormRow columns="max-content 8fr">
        <Label direction="column">
          <span className="label required">
            <Accent>Order</Accent>
          </span>
          <Input
            placeholder="The First Dawn"
            type="number"
            value={data?.order || 1}
            min={0}
            onChange={updateOrder}
          />
          <Hint>Exploration Scene Order</Hint>
        </Label>
        <Label direction="column">
          <span className="label required">
            Exploration Scene <Accent>Title</Accent>
          </span>
          <Input
            placeholder="The First Dawn"
            type="text"
            value={data?.title || ""}
            onChange={updateTitle}
          />
          <Hint>Enter your scene title.</Hint>
        </Label>
      </FormRow>

      <hr className="transparent" />

      <Fieldset>
        <Legend>Canvas Settings</Legend>
        <FormRow columns="repeat(3, 1fr)">
          <Label direction="column">
            <span className="label">
              Scene <b className="accent--text">type</b>?
            </span>

            <FormRow>
              {explorationCanvasTypes.map((ct, i) => (
                <RadioLabel key={i}>
                  <span>{ct}</span>
                  <RadioInput
                    checked={config.type === ct}
                    name="canvasType"
                    onChange={() => updateConfigType(ct)}
                  />
                </RadioLabel>
              ))}
            </FormRow>
          </Label>

          {config.type === ExplorationCanvasType.MAP && (
            <>
              {/* Width */}
              <Label direction="column">
                <span className="label">
                  Canvas <b className="accent--text">width</b>?
                </span>
                <Input
                  placeholder="2000"
                  type="text"
                  value={config.width || ""}
                  onChange={({ target }) =>
                    updateConfigWidth(Number(target.value))
                  }
                />
              </Label>

              {/* height */}
              <Label direction="column">
                <span className="label">
                  Canvas <b className="accent--text">height</b>?
                </span>
                <Input
                  placeholder="2000"
                  type="text"
                  value={config.height || ""}
                  onChange={({ target }) =>
                    updateConfigHeight(Number(target.value))
                  }
                />
              </Label>
            </>
          )}
        </FormRow>
      </Fieldset>

      {/* Description */}
      <Label direction="column">
        <span className="label required">
          Short <Accent>Description</Accent>
        </span>
        <Textarea
          value={data?.description || ""}
          onChange={({ target }) => updateDescription(target.value)}
        />
      </Label>

      {/* Prompt */}
      {!data?.description && (
        <WritingPrompt
          additionalData={{ ...data, type: "scene" }}
          onPrompt={updateDescription}
        />
      )}
      <Hint>You can add a scene overview, notes, or writing prompts here.</Hint>
    </Form>
  );
};

export default CreateExplorationSceneForm;
