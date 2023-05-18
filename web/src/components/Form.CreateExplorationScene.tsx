import { ChangeEvent, useEffect, useState } from "react";
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
import useGlobalExploration from "hooks/GlobalExploration";
import { Accent } from "./Common/Containers";
import { WritingPrompt } from "./WritingPrompt";
import { createExplorationTemplateScene } from "routes/ExplorationBuilder.Helpers";
import { GlobalExploration, GlobalModal, GlobalUser, MODAL } from "state";
import { ExplorationSceneTemplate } from "utils/types";

export type CreateExplorationSceneProps = {
  onChange?: (data: ExplorationSceneTemplate) => void;
};

const emptyForm = (): ExplorationSceneTemplate => {
  const { explorationScene, exploration } = GlobalExploration.getState();
  const { active } = GlobalModal.getState();
  const { id: authorId } = GlobalUser.getState();
  const $form = createExplorationTemplateScene();
  $form.authorId = authorId;
  $form.order = (exploration?.Scenes ?? []).length + 1;

  if (active === MODAL.MANAGE_EXPLORATION_SCENE && explorationScene) {
    $form.id = explorationScene.id;
    $form.order = explorationScene.order;
    $form.title = explorationScene.title;
    $form.description = explorationScene.description;
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
