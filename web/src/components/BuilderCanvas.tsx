import { useState } from "react";
import styled from "styled-components";
import { MODAL, setGlobalModal } from "state";
import useGlobalExploration from "hooks/GlobalExploration";
import { Accent, Card, CardTitle, FlexColumn } from "./Common/Containers";
import SceneBuilderHelp from "./SceneBuilderHelp";
import ModalDrawer from "./Modals/ModalDrawer";
import { PixiCanvas } from "./PixiCanvas";

const EmptyCanvas = (
  <Card>
    <CardTitle>
      Build an{" "}
      <Accent onClick={() => setGlobalModal(MODAL.SELECT_EXPLORATION_SCENE)}>
        Exploration scenario
      </Accent>{" "}
    </CardTitle>

    <SceneBuilderHelp />
  </Card>
);

/** @component Builder Canvas (create/manage scene layers) */
const BuilderCanvas = () => {
  const { explorationScene } = useGlobalExploration(["explorationScene"]);
  const [showHelp, setShowHelp] = useState(false);
  const hideHelp = () => setShowHelp(false);

  return explorationScene ? (
    <>
      <PixiCanvas editing />

      <ModalDrawer
        open={showHelp}
        title="Scene Builder Help"
        onClose={hideHelp}
      >
        <SceneBuilderHelp />
      </ModalDrawer>
    </>
  ) : (
    EmptyCanvas
  );
};

export default BuilderCanvas;
