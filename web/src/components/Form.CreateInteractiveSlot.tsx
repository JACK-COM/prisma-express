import { useEffect, useMemo, useState } from "react";
import { noOp, suppressEvent } from "../utils";
import {
  Fieldset,
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  Legend,
  Select
} from "components/Forms/Form";
import {
  ExplorationTemplateEvent,
  InteractiveSlot,
  SlotAction,
  SlotInteraction,
  explorationTemplateActions
} from "utils/types";
import { createInteractiveSlot } from "routes/ExplorationBuilder.Helpers";
import { GlobalExploration, GlobalModal, MODAL } from "state";
import { RoundButton } from "./Forms/Button";
import MatIcon from "./Common/MatIcon";
import { Accent } from "./Common/Containers";
import CreateInteractiveSlotDataForm from "./Form.CreateInteractiveSlotData";

export type CreateInteractiveSlotProps = {
  value?: InteractiveSlot;
  onChange?: (data: InteractiveSlot) => void;
};

const emptyForm = (): InteractiveSlot => {
  const {
    activeLayer: lbl,
    explorationScene,
    activeSlotIndex
  } = GlobalExploration.getState();
  let form = createInteractiveSlot();
  const { active } = GlobalModal.getState();
  const edit = lbl !== "all" && active === MODAL.MANAGE_INTERACTIVE_SLOT;
  const activeLayer = (
    lbl === "all" ? [] : explorationScene?.[lbl] || []
  ) as InteractiveSlot[];
  form.index = activeLayer.length + 1;

  if (edit && explorationScene != null && activeSlotIndex > -1) {
    const activeSlot = activeLayer[activeSlotIndex];
    form = { ...form, ...activeSlot };
  }

  return form;
};

/** @form Create or edit an `Interactive Slot` in an `Exploration` template */
const CreateInteractiveSlotForm = (props: CreateInteractiveSlotProps) => {
  const { onChange = noOp } = props;
  const { active } = GlobalModal.getState();
  const editing = active === MODAL.MANAGE_INTERACTIVE_SLOT;
  const imageAction = editing ? "Change" : "Upload";
  const [data, setData] = useState(emptyForm());
  const [interactionData, event, action] = useMemo(() => {
    const { click, drag } = data.interaction || {};
    const { CLICK, DRAG } = ExplorationTemplateEvent;
    const d = data.interaction?.data;
    const truthy = (v?: SlotAction) => Boolean(v) && v !== SlotAction.NONE;
    if (truthy(click)) return [d, CLICK, click];
    if (truthy(drag)) return [d, DRAG, drag];
    return [d, undefined, undefined];
  }, [data]);
  const updateData = (d: typeof data) => {
    setData(d);
    onChange(d);
  };
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateData({ ...data, name: e.target.value });
  const updateImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = e.target?.result as string;
        updateData({ ...data, url: image });
      };
      reader.readAsDataURL(file);
    }
  };
  const updateInteraction = (i: Partial<SlotInteraction>) => {
    updateData({ ...data, interaction: { ...data.interaction, ...i } });
  };
  const changeClickAction = (click: SlotAction) => {
    const actionData = click === data.interaction?.drag ? interactionData : {};
    updateInteraction({ click, drag: SlotAction.NONE, data: actionData });
  };
  const changeDragAction = (drag: SlotAction) => {
    const actionData = drag === data.interaction?.click ? interactionData : {};
    updateInteraction({ drag, click: SlotAction.NONE, data: actionData });
  };
  const updateLock = (d: Partial<InteractiveSlot["lock"]>) => {
    const { lock = {} } = data;
    const newLock = { ...lock, ...d };
    updateData({ ...data, lock: newLock });
  };
  const togglePositionLock = () =>
    updateLock({ position: !data.lock?.position });
  const toggleSizeLock = () => updateLock({ size: !data.lock?.size });
  const classForLock = (lock?: boolean) =>
    `${lock ? "success" : "error"}--text`;
  const iconForLock = (lock?: boolean) => (lock ? "lock" : "lock_open");

  useEffect(() => {
    onChange(data);
  }, []);

  return (
    <Form onSubmit={suppressEvent}>
      <FormRow columns="repeat(2, 1fr)">
        {/* Name */}
        <Label direction="column">
          <span className="label required">
            Slot <span className="accent--text">Name</span>
          </span>
          <Input
            placeholder="e.g. Clouds, Jolly Trader, etc."
            type="text"
            value={data?.name || ""}
            onChange={updateName}
          />
        </Label>

        {/* Slot Image */}
        <Label direction="column">
          <span className="label">
            {imageAction} Slot's <span className="accent--text">Image</span>
          </span>
          <Input
            type="file"
            accept="image/*"
            onChange={updateImageUrl}
            style={{ padding: "0 0.5rem" }}
          />
        </Label>
      </FormRow>
      <Hint>
        Modify the slot's size and position in the canvas after saving your
        changes here!
      </Hint>
      <hr className="transparent" />

      {/* CHOICES, ETC */}
      {editing && (
        <Fieldset>
          <Legend>Additional Options</Legend>

          <FormRow columns="repeat(2, 1fr)" gap="0.6rem">
            {/* Drag-lock */}
            <Label columns="24px auto" gap="0.4rem">
              <RoundButton variant="outlined" onClick={togglePositionLock}>
                <MatIcon
                  className={classForLock(data.lock?.position)}
                  icon={iconForLock(data.lock?.position)}
                />
              </RoundButton>
              <span className="label">
                Position {data.lock?.position ? "locked" : "unlocked"}
              </span>
            </Label>

            {/* Resize-lock */}
            <Label columns="24px auto" gap="0.4rem">
              <RoundButton variant="outlined" onClick={toggleSizeLock}>
                <MatIcon
                  className={classForLock(data.lock?.size)}
                  icon={iconForLock(data.lock?.size)}
                />
              </RoundButton>
              <b className="label">
                Size {data.lock?.size ? "locked" : "unlocked"}
              </b>
            </Label>
          </FormRow>
          <Hint>
            Disable <Accent>drag-to-move</Accent> or&nbsp;
            <Accent>scroll-to-resize</Accent> when you are done with this sprite
            in the canvas.
          </Hint>

          <hr />
          {/* let's add some interactions */}
          <Legend>Events and Interactions</Legend>
          <Hint>
            You can allow a user to either click or drag the slot in order to
            trigger an action.
          </Hint>

          <hr className="transparent" />

          {/* Events */}
          <FormRow columns="1fr max-content 1fr" gap="0.8rem">
            {/* Click */}
            <Label columns="auto">
              <span className="label flex">
                <MatIcon icon="touch_app" /> Click:
              </span>

              <Select
                data={explorationTemplateActions}
                value={data.interaction?.click}
                itemText={(d) => d}
                itemValue={(d) => d}
                emptyMessage="No actions loaded!"
                placeholder="Select click action:"
                onChange={changeClickAction}
              />
            </Label>

            {/* Or */}
            <Accent style={{ alignSelf: "center" }}>OR</Accent>

            {/* Drag */}
            <Label columns="auto">
              <span className="label flex">
                <MatIcon icon="drag_indicator" /> Drag:
              </span>

              <Select
                data={explorationTemplateActions}
                value={data.interaction?.drag}
                itemText={(d) => d}
                itemValue={(d) => d}
                emptyMessage="No actions loaded!"
                placeholder="Select drag action:"
                onChange={changeDragAction}
              />
            </Label>
          </FormRow>

          {/* interactions */}
          {event && action && (
            <CreateInteractiveSlotDataForm
              event={event}
              action={action}
              value={interactionData}
              onChange={(d) => updateInteraction({ data: d })}
            />
          )}

          <hr className="transparent" />
        </Fieldset>
      )}
    </Form>
  );
};

export default CreateInteractiveSlotForm;
