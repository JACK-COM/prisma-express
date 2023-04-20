import { noOp } from "../utils";
import { EventPolarity, EventTarget } from "../utils/types";
import { Form, Hint, Legend } from "components/Forms/Form";
import { UpsertLinkData } from "graphql/requests/content-links.graphql";
import { useGlobalWorld } from "hooks/GlobalWorld";
import { ButtonWithIcon } from "./Forms/Button";
import { LinkSceneFormFields } from "./ContentLinksFields";
import { GlobalLibrary } from "state";

export type CreateContentLinksProps = {
  data?: Partial<UpsertLinkData>[];
  onChange?: (data: Partial<UpsertLinkData>[]) => void;
};

/** Create or edit a `ContentLinks` */
const CreateContentLinkssForm = (props: CreateContentLinksProps) => {
  const { focusedChapter, focusedScene, focusedBook, chapters } =
    GlobalLibrary.getState();
  const { seriesId } = focusedBook || {};
  const { Scenes = [], bookId, id: chapterId } = focusedChapter || {};
  const { data = [], onChange = noOp } = props;
  const updateAtIndex = (d: Partial<UpsertLinkData>, i: number) => {
    const next = [...data];
    next[i] = d;
    onChange(next);
  };
  const addStub = () => {
    updateAtIndex(
      {
        text: "",
        bookId: bookId || undefined,
        originId: (focusedScene || focusedChapter)?.id || undefined,
        chapterId: chapterId || undefined,
        sceneId: undefined
      },
      data.length
    );
  };

  return (
    <Form>
      <Legend>
        New <span className="accent--text">Content Link</span>
      </Legend>
      <Hint>
        Create a <b>direct link</b> to another <b>scene</b> or <b>chapter</b>.
        These will appear at the end of the current <b>scene</b>.
      </Hint>

      {/* Name */}
      {data.map((d, i) => (
        <LinkSceneFormFields
          key={i}
          data={d}
          onChanged={updateAtIndex}
          index={i}
        />
      ))}

      <ButtonWithIcon
        type="button"
        icon="add"
        onClick={addStub}
        size="lg"
        text={`Add ${data.length ? "another" : "a"} Link`}
        variant="outlined"
      />
    </Form>
  );
};

export default CreateContentLinkssForm;
