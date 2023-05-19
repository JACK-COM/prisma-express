import { useState } from "react";
import { GENRES, BookCategory, noOp } from "../utils";
import {
  FormRow,
  Hint,
  Label,
  RadioInput,
  RadioLabel,
  Select
} from "components/Forms/Form";
import SelectParentWorld from "./SelectParentWorld";
import SelectParentLocation from "./SelectParentLocation";

type CategoryData = {
  genre?: string;
  worldId?: number;
  locationId?: number;
};
export type LitCategoryProps = {
  value?: CategoryData;
  onChange?: (data: CategoryData) => void;
};

/** Create or edit a `Book` */
const LitCategory = (props: LitCategoryProps) => {
  const { onChange = noOp, value = {} } = props;
  const [category, setCategory] = useState<BookCategory>(BookCategory.Fiction);
  const changeLocation = (e: number | null) =>
    onChange({ ...value, locationId: e || undefined });
  const changeWorld = (e: number | null) =>
    onChange({ ...value, worldId: e || undefined });
  const changeGenre = (e: string) => onChange({ ...value, genre: e });
  const changeCategory = (e: BookCategory) => {
    setCategory(e);
    onChange({ ...value, genre: "" });
  };

  return (
    <>
      <FormRow columns="repeat(2,1fr)">
        {/* Category */}
        <Label direction="column">
          <span className="label required">
            <span className="accent--text">Category</span>:
          </span>

          <FormRow columns="repeat(2, 1fr)">
            {[BookCategory.Fiction, BookCategory.Nonfiction].map((c) => (
              <RadioLabel key={c.valueOf()}>
                <span>{c}</span>
                <RadioInput
                  checked={category === c}
                  name="bookCategory"
                  onChange={() => changeCategory(c)}
                />
              </RadioLabel>
            ))}
          </FormRow>
        </Label>

        {/* Genre */}
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
        </Label>
      </FormRow>
      <Hint>
        Use this to narrow down your genre choices. Select <b>Other</b> if you
        aren't sure!
      </Hint>

      <hr />
      {/* World/Location */}
      {category === BookCategory.Fiction && (
        <FormRow columns="repeat(2,1fr)">
          {/* World */}
          <Label direction="column">
            <span className="label">
              <b className="accent--text">World</b>:
            </span>
            <SelectParentWorld
              placeholder="Select world:"
              value={value.worldId}
              onChange={changeWorld}
            />
          </Label>

          {/* Location */}
          {value.worldId && (
            <Label direction="column">
              <span className="label">
                <b className="accent--text">Location</b>:
              </span>
              <SelectParentLocation
                worldId={value.worldId}
                value={value.locationId}
                onChange={changeLocation}
              />
            </Label>
          )}
        </FormRow>
      )}
    </>
  );
};

export default LitCategory;
