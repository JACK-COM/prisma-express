import { useState } from "react";
import { GENRES, BookCategory, noOp } from "../utils";
import {
  FormRow,
  Hint,
  Label,
  Legend,
  RadioInput,
  RadioLabel,
  Select
} from "components/Forms/Form";

export type WorkCategoryProps = {
  value?: string;
  onChange?: (data: string) => void;
};

/** Create or edit a `Book` */
const WorkCategory = (props: WorkCategoryProps) => {
  const { onChange = noOp, value = "" } = props;
  const [category, setCategory] = useState<BookCategory>(BookCategory.Fiction);
  const changeCategory = (e: BookCategory) => {
    setCategory(e);
    onChange("");
  };

  return (
    <>
      <FormRow columns="repeat(2, 1fr)">
        {/* Category */}
        <Label direction="column">
          <span className="label required">Select a category:</span>

          <FormRow columns="repeat(2, 1fr)">
            <RadioLabel>
              <span>Fiction</span>
              <RadioInput
                checked={category === BookCategory.Fiction}
                name="bookCategory"
                onChange={() => changeCategory(BookCategory.Fiction)}
              />
            </RadioLabel>

            <RadioLabel>
              <span>Nonfiction</span>
              <RadioInput
                checked={category === BookCategory.Nonfiction}
                name="bookCategory"
                onChange={() => changeCategory(BookCategory.Nonfiction)}
              />
            </RadioLabel>
          </FormRow>
          <Hint>Use this to narrow down your genre choices.</Hint>
        </Label>

        {/* Genre */}
        <Label direction="column">
          <span className="label required">
            Book Genre (<b className="accent--text">{category}</b>)
          </span>
          <Select
            aria-invalid={!value}
            data={GENRES[category] || []}
            value={value}
            itemText={(d) => d}
            itemValue={(d) => d}
            emptyMessage="No category selected."
            placeholder="Select a genre:"
            onChange={onChange}
          />
          <Hint>
            Select <b>Other</b> if you aren't sure!
          </Hint>
        </Label>
      </FormRow>

      <hr />
    </>
  );
};

export default WorkCategory;
