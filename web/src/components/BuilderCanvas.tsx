import { MODAL, clearGlobalModal, setGlobalModal } from "state";
import useGlobalExploration from "hooks/GlobalExploration";
import { Accent, Card, CardTitle } from "./Common/Containers";
import SceneBuilderHelp from "./SceneBuilderHelp";
import ModalDrawer from "./Modals/ModalDrawer";
import { PixiCanvas } from "./PixiCanvas";
import { useGlobalModal } from "hooks/GlobalModal";
import { noOp } from "utils";
import { ExplorationSceneTemplate } from "utils/types";

/** @component Empty Canvas view */
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

type BuilderCanvasOpts = {
  onChange?: (scene: ExplorationSceneTemplate) => void;
};

/** @component Builder Canvas (create/manage scene layers) */
const BuilderCanvas = (props: BuilderCanvasOpts) => {
  const { onChange = noOp } = props;
  const { explorationScene } = useGlobalExploration(["explorationScene"]);
  const { active } = useGlobalModal();

  return explorationScene ? (
    <>
      <PixiCanvas editing onChange={onChange} />

      <ModalDrawer
        open={active === MODAL.EXPLORATION_BUILDER_HELP}
        title="Scene Builder Help"
        onClose={clearGlobalModal}
      >
        <SceneBuilderHelp />
      </ModalDrawer>
    </>
  ) : (
    EmptyCanvas
  );
};

export default BuilderCanvas;
