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
  SlotInteractionData,
  explorationTemplateActions
} from "utils/types";
import { createInteractiveSlot } from "routes/ExplorationBuilder.Helpers";
import { GlobalExploration, GlobalModal, MODAL } from "state";
import { RoundButton } from "./Forms/Button";
import MatIcon from "./Common/MatIcon";
import { Accent, Selectable } from "./Common/Containers";
import CreateInteractiveSlotDataForm from "./Form.CreateInteractiveSlotData";
import AWSImagesList from "./AWSImagesList";

export type CreateInteractiveSlotProps = {
  value?: InteractiveSlot;
  onChange?: (data: InteractiveSlot) => void;
  onSlotImageFile?: (data?: File) => void;
};

const { CLICK, DRAG_HZ, DRAG_VT } = ExplorationTemplateEvent;
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
    if (activeSlot) form = { ...activeSlot };
  }

  return form;
};

/** @form Create or edit an `Interactive Slot` in an `Exploration` template */
const CreateInteractiveSlotForm = (props: CreateInteractiveSlotProps) => {
  const { onChange = noOp, onSlotImageFile = noOp } = props;
  const { active } = GlobalModal.getState();
  const editing = active === MODAL.MANAGE_INTERACTIVE_SLOT;
  const imageAction = editing ? "Change" : "Upload";
  const [data, setData] = useState(emptyForm());
  const [interactionData, event, action] = useMemo(() => {
    const { event, action: a, data: d } = data.interaction || {};
    if (event === CLICK) return [d, CLICK, a];
    if (event === DRAG_HZ) return [d, DRAG_HZ, a];
    if (event === DRAG_VT) return [d, DRAG_VT, a];
    return [d, undefined, undefined];
  }, [data]);
  const updateData = (d: typeof data) => {
    setData((p) => ({ ...p, ...d }));
    onChange(d);
  };
  const clearImage = () => {
    onSlotImageFile(undefined);
    return updateData({ ...data, url: undefined });
  };
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateData({ ...data, name: e.target.value });
  const updateImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return clearImage();

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = e.target?.result as string;
      onSlotImageFile(file);
      updateData({ ...data, url: image });
    };
    reader.readAsDataURL(file);
  };
  const updateInteraction = (interaction?: SlotInteraction) => {
    updateData({ ...data, interaction });
  };
  const updateInteractionData = (iData?: SlotInteractionData) => {
    updateInteraction({ ...data.interaction, data: iData });
  };
  const changeClickAction = (clickAction: SlotAction) => {
    if (!clickAction) return updateInteraction({});
    updateInteraction({
      action: clickAction,
      event: CLICK,
      data: clickAction === action ? interactionData : {}
    });
  };
  const changeDragAction = (dragAction: SlotAction) => {
    if (!dragAction) return updateInteraction({});
    updateInteraction({
      action: dragAction,
      event: DRAG_HZ,
      data: dragAction === action ? interactionData : {}
    });
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
      <Hint>
        You can change the slot's size and position in the canvas after saving
        your changes here. If you want to just create a clickable area, you can
        leave the image blank.
      </Hint>
      <hr />

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
            {imageAction} Slot <span className="accent--text">Image</span>
          </span>
          {data.url ? (
            <Hint>
              <Selectable className="flex" onPointerUp={clearImage}>
                <MatIcon icon="clear" className="error--text" />
                <Accent as="b">Clear selected image</Accent>
              </Selectable>
            </Hint>
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={updateImageUrl}
              style={{ padding: "0 0.5rem" }}
            />
          )}
        </Label>
      </FormRow>

      <FormRow columns="repeat(2, 1fr)">
        <Hint>Name of character or slot-purpose</Hint>
      </FormRow>

      <hr />

      {!data.url && (
        <AWSImagesList
          category="worlds"
          listDescription="Choose a previously-uploaded asset for the slot's image"
          onImageSelect={(url) => updateData({ ...data, url })}
        />
      )}

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
                value={event === CLICK ? data.interaction?.action : ""}
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
                value={event === DRAG_HZ ? data.interaction?.action : ""}
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
              onChange={updateInteractionData}
            />
          )}

          <hr className="transparent" />
        </Fieldset>
      )}
    </Form>
  );
};

export default CreateInteractiveSlotForm;
