import { Accent } from "components/Common/Containers";
import { GlobalExploration } from "state";
import styled from "styled-components";
import { canvasLayersCSS } from "./PixiCanvasToolbar";

const HelpList = styled.ol`
  ${canvasLayersCSS}
`;

export default function SceneBuilderHelp() {
  const { exploration, explorationScene } = GlobalExploration.getState();
  const { Scenes: scenes = [] } = exploration ?? {};

  return (
    <HelpList>
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
        Add components to your scene! A component can be either text or an
        image.
        <hr />
        Components go into <Accent as="b">Layers</Accent>. There are{" "}
        <Accent as="b">3 Layers</Accent> available:
        <ol>
          <li>
            <Accent className="background" as="b">
              Background:
            </Accent>{" "}
            Your scene's background image goes here. You can add anything that
            is most-distant from the viewer (e.g. clouds, horizon, etc.)
          </li>
          <li>
            <Accent className="characters" as="b">
              Characters:
            </Accent>{" "}
            Any characters that the player/viewer can interact with. It is
            recommended to keep all characters here, so you can easily track
            them.
          </li>
          <li>
            <Accent className="foreground" as="b">
              Foreground:
            </Accent>{" "}
            Any foreground items (e.g. items in a room) that the player/viewer
            can interact with.
          </li>
        </ol>
      </li>

      <li>
        <hr />
        Before you add a component, make sure you are on the{" "}
        <Accent as="b">correct Scene</Accent>! You can confirm by checking the
        scene list.
        <br />
        When ready, select a <Accent as="b">Layer</Accent> from the menu, then
        use the buttons on screen to add either some text or a new image.
      </li>
    </HelpList>
  );
}
