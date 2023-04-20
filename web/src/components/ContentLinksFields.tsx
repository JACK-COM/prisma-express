import { ChangeEvent, useMemo } from "react";
import { FormRow, Hint, Input, Label, Select } from "components/Forms/Form";
import { Fieldset } from "components/Forms/Form";
import { UpsertLinkData } from "graphql/requests/content-links.graphql";
import { APIData, Chapter, Scene } from "utils/types";
import styled from "styled-components";
import { GlobalLibrary } from "state";

export type ContentLinksFieldProps = {
  data: Partial<UpsertLinkData>;
  index?: number;
  onChanged: (d: Partial<UpsertLinkData>, i: number) => void;
};

const Fields = styled(Fieldset)`
  .collapse--vertical {
    display: none;
  }
`;
const FieldRow = styled(FormRow)`
  align-items: start;

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

/** Link a focused `Scene` to another scene in the same book. */
export function LinkSceneFormFields(props: ContentLinksFieldProps) {
  const { chapters } = GlobalLibrary.getState();
  const { data, onChanged, index: i = 0 } = props;
  const { chapterId } = data;
  const scenes = useMemo(
    () =>
      chapterId ? chapters.find((c) => c.id === chapterId)?.Scenes || [] : [],
    [chapters, data]
  );
  const updateText = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    onChanged({ ...data, text: e.target.value }, i);
  };
  const updateChapter = (chapterId: number, i: number) => {
    onChanged({ ...data, chapterId }, i);
  };
  const updateScene = (sceneId: number, i: number) => {
    onChanged({ ...data, sceneId }, i);
  };

  return (
    <Fields>
      {/* Scene Title */}
      <Label direction="column">
        <span className="label required">Link text</span>
        <Input
          placeholder={`e.g. Choose the Red door`}
          type="text"
          value={data.text || ""}
          onChange={(x) => updateText(x, i)}
        />
        <Hint>
          This is the text users will see when they click on the link.
        </Hint>
      </Label>

      <FieldRow columns="1fr 1fr">
        {/* Chapter Target */}
        <Label direction="column">
          <span className="label required">Chapter Target</span>
          <Select
            data={chapters}
            value={data.chapterId || ""}
            itemText={(d: APIData<Chapter>) => d.title}
            itemValue={(d: APIData<Chapter>) => d.id}
            emptyMessage="No other chapters in current book."
            placeholder="Select Chapter:"
            onChange={(id: string) => updateChapter(Number(id), i)}
          />
          <Hint>Chapter target</Hint>
        </Label>

        {/* Scene Target */}
        <Label direction="column">
          <span className="label required">Scene Target</span>
          <Select
            data={scenes}
            value={data.sceneId || ""}
            itemText={(d: APIData<Scene>) => d.title}
            itemValue={(d: APIData<Scene>) => d.id}
            emptyMessage="No other scenes in current chapter."
            placeholder="Select Scene:"
            onChange={(id: string) => updateScene(Number(id), i)}
          />
          <Hint>Scene target</Hint>
        </Label>
      </FieldRow>
    </Fields>
  );
}
