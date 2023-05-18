import { useEffect, useState } from "react";
import { GENRES, BookCategory, noOp, suppressEvent } from "../utils";
import {
  Form,
  FormRow,
  Hint,
  Input,
  Label,
  RadioInput,
  RadioLabel,
  Select
} from "components/Forms/Form";
import SelectParentWorld from "./SelectParentWorld";
import SelectParentLocation from "./SelectParentLocation";
import { InteractiveSlot, SlotInteraction } from "utils/types";
import { createInteractiveSlot } from "routes/ExplorationBuilder.Helpers";
import { GlobalExploration } from "state";

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
  const form = createInteractiveSlot();
  const activeLayer = (
    lbl === "all" ? [] : explorationScene?.[lbl] || []
  ) as InteractiveSlot[];
  if (lbl !== "all" && explorationScene != null && activeSlotIndex > -1) {
    const activeSlot = activeLayer[activeSlotIndex];
    if (activeSlot.name) form.name = activeSlot.name;
    if (activeSlot.url) form.url = activeSlot.url;
    if (activeSlot.interaction) form.interaction = activeSlot.interaction;
    if (activeSlot.anchor) form.anchor = activeSlot.anchor;
    if (activeSlot.scale) form.scale = activeSlot.scale;
    if (activeSlot.xy) form.xy = activeSlot.xy;
    if (activeSlot.index) form.index = activeSlot.index;
    else form.index = activeLayer.length + 1;
  }
  if (isNaN(form.index || NaN)) form.index = 1;
  return form;
};

/** @form Create or edit an `Interactive Slot` in an `Exploration` template */
const CreateInteractiveSlotForm = (props: CreateInteractiveSlotProps) => {
  const { onChange = noOp, value } = props;
  const [data, setData] = useState(emptyForm());
  const [interactType, setInteractType] = useState<SlotInteraction>();
  const onData = (d: typeof data) => {
    setData(d);
    onChange(d);
  };
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) =>
    onData({ ...data, name: e.target.value });
  const updateInteraction = (i: SlotInteraction) =>
    onData({ ...data, interaction: i });
  const updateImageUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = e.target?.result as string;
        onData({ ...data, url: image });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    onChange(data);
  }, []);

  return (
    <Form onSubmit={suppressEvent}>
      {/* 
        <FormRow columns="repeat(2, 1fr)">
            Genre 
            <Label direction="column">
            <span className="label required">
                {category} <b className="accent--text">Genre</b>:
            </span>
            <Select
                aria-invalid={!value}
                data={GENRES[category] || []}
                value={value.genre}
                itemText={(d) => d}
                itemValue={(d) => d}
                emptyMessage="No category selected."
                placeholder="Select a genre:"
                onChange={changeGenre}
            />
        </FormRow> */}
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
            Upload Slot <span className="accent--text">Image</span>
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
        When you add an image, you can change its properties in the canvas after
        saving your changes.
      </Hint>
    </Form>
  );
};

export default CreateInteractiveSlotForm;
