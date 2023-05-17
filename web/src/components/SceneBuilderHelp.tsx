import { Accent } from "components/Common/Containers";
import { GlobalExploration } from "state";

export default function SceneBuilderHelp() {
  const { exploration, explorationScene } = GlobalExploration.getState();
  const { Scenes: scenes = [] } = exploration ?? {};

  return (
    <ol>
      {!scenes?.length ? (
        <>
          <li>
            First, Add a <Accent as="b">new Scene</Accent>
          </li>
          <li>
            Then, select it from the <Accent as="b">sidebar menu</Accent>
          </li>
        </>
      ) : (
        !explorationScene && (
          <li>
            Select a <Accent as="b">Scene</Accent> from the sidebar to edit.
          </li>
        )
      )}

      <li>
        Add components to your scene! There are three main layers
        <ol>
          <li>
            <Accent as="b">Background:</Accent> Add your background image here.
            This layer is different from the others because it doesn't hold
            multiple items. However, it is still similar to an item in one of
            the other layers.
          </li>
          <li>
            <Accent as="b">Foreground:</Accent> Any foreground items (e.g. items
            in a room) that the player/viewer can interact with.
          </li>
          <li>
            <Accent as="b">Characters:</Accent> Any characters that the
            player/viewer can interact with.
          </li>
        </ol>
      </li>
    </ol>
  );
}
