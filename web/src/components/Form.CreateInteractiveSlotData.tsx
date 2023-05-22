import { noOp } from "../utils";
import {
  FormRow,
  Hint,
  Input,
  Label,
  Select,
  Textarea
} from "components/Forms/Form";
import {
  ExplorationTemplateEvent,
  SlotAction,
  SlotInteractionChoice,
  SlotInteractionData,
  explorationTemplateActions
} from "utils/types";
import { GlobalExploration } from "state";
import { Accent } from "./Common/Containers";
import MatIcon from "./Common/MatIcon";
import { WideButton } from "./Forms/Button";
import { Fragment } from "react";

export type SlotDataFormProps = {
  /** User-event (click or drag) */
  event: ExplorationTemplateEvent;
  /** Action triggered by event */
  action: SlotAction;
  /** Any data required to perform action */
  value?: SlotInteractionData;
  /** Notify parent on change */
  onChange?: (data: SlotInteractionData) => void;
};

/** @form Create or edit data for an `Interactive Slot` in an `Exploration` template */
const CreateInteractiveSlotDataForm = (props: SlotDataFormProps) => {
  const { value: data = {}, onChange = noOp, event, action } = props;
  const { exploration, explorationScene } = GlobalExploration.getState();
  const { Scenes = [] } = exploration || {};
  const { choices = [] } = data;
  const otherScenes = Scenes.filter((s) => s.id !== explorationScene?.id);
  const clearNavTarget = () => {
    onChange({ ...data, target: undefined, text: undefined });
  };
  const updateNavTarget = (target: number) => {
    if (!target || isNaN(target)) return clearNavTarget();
    const sc = otherScenes.find((s) => s.id === target);
    const text = sc?.title;
    onChange({ ...data, target, text });
  };
  const updateActionText = (text?: string) => {
    onChange({ ...data, text });
  };
  const updateChoices = (ch: SlotInteractionChoice, i: number) => {
    const newChoices = [...choices];
    newChoices[i] = ch;
    onChange({ ...data, choices: newChoices });
  };
  const updateChoiceText = (t: string, ci: number) => {
    updateChoices({ ...choices[ci], text: t }, ci);
  };
  const updateChoiceAction = (a: SlotAction, ci: number) => {
    updateChoices({ ...choices[ci], action: a }, ci);
  };
  const updateChoiceData = (d: SlotInteractionData, ci: number) => {
    updateChoices({ ...choices[ci], data: d }, ci);
  };
  const addDummyChoice = () => {
    const choice: SlotInteractionChoice = {
      text: "Enter text",
      action: SlotAction.NONE,
      data: {} as SlotInteractionData
    };
    onChange({ ...data, choices: [...choices, choice] });
  };

  return (
    <span id="form--interactive-slot-data">
      {action === SlotAction.NAV_SCENE && (
        <Label columns="auto">
          <span className="label flex">Navigate to Scene:</span>
          <Hint>
            Navigate to a new scene when you <Accent as="b">{event}</Accent>{" "}
            this slot.
          </Hint>
          <Select
            aria-invalid={!data.target}
            data={otherScenes}
            value={data?.target || ""}
            itemText={(s) => s.title}
            itemValue={(s) => s.id}
            emptyMessage="No scenes loaded!"
            placeholder="Select target scene:"
            onChange={(s) => updateNavTarget(Number(s))}
          />
        </Label>
      )}

      {action === SlotAction.SHOW_TEXT && (
        <Label columns="auto">
          <span className="label flex">Enter text to show:</span>
          <Hint>
            Show character dialogue or an item description when you{" "}
            <Accent as="b">{event}</Accent> this slot..
          </Hint>
          <Textarea
            aria-invalid={!data.text}
            value={data?.text || ""}
            placeholder="e.g. 'The walls look old and worn.'"
            onChange={({ target }) => updateActionText(target.value)}
          />
        </Label>
      )}

      {action === SlotAction.CHOOSE && (
        <>
          <Label columns="auto">
            <span className="label flex">
              Enter&nbsp;<Accent>Question</Accent>:
            </span>
            <Hint>What will the player be asked?</Hint>
            <Input
              aria-invalid={!data.text}
              value={data?.text || ""}
              placeholder="e.g. 'What is red and blue and green all over?'"
              onChange={({ target }) => updateActionText(target.value)}
            />
          </Label>

          <Hint>
            Give the player options to respond, and{" "}
            <Accent>consequences</Accent> for each response.
          </Hint>

          {choices.length > 0 && (
            <Label columns="auto">
              <span className="label flex">
                Player&nbsp;<Accent>response</Accent>:
              </span>
            </Label>
          )}

          {choices.map((choice, i) => (
            <Fragment key={i}>
              <FormRow columns="repeat(2, 1fr)" gap="0.6rem">
                <Label columns="auto">
                  <span className="label flex">
                    Enter&nbsp;<Accent>choices</Accent>:
                  </span>
                  <Input
                    aria-invalid={!choice.text}
                    value={choice.text || ""}
                    placeholder="e.g. 'A worried cat'"
                    onChange={({ target }) => updateChoiceText(target.value, i)}
                  />
                </Label>

                <Label columns="auto">
                  <span className="label flex">
                    <MatIcon icon="filter_vintage" />
                    &nbsp;<Accent>Consequence</Accent>:
                  </span>

                  <Select
                    data={explorationTemplateActions}
                    value={choice.action || ""}
                    itemText={(d) => d}
                    itemValue={(d) => d}
                    emptyMessage="No actions loaded!"
                    placeholder="Select action:"
                    onChange={(a) => updateChoiceAction(a, i)}
                  />
                </Label>
              </FormRow>

              <CreateInteractiveSlotDataForm
                event={ExplorationTemplateEvent.CLICK}
                action={choice.action}
                value={choice.data}
                onChange={(d) => updateChoiceData(d, i)}
              />
            </Fragment>
          ))}

          <WideButton type="button" variant="outlined" onClick={addDummyChoice}>
            <MatIcon icon="filter_vintage" />
            Add choice
          </WideButton>
        </>
      )}
    </span>
  );
};

export default CreateInteractiveSlotDataForm;
