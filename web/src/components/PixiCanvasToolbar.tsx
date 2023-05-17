import styled from "styled-components";
import useGlobalExploration from "hooks/GlobalExploration";
import { Toolbar, ToolbarButton } from "./Common/Toolbar";
import { MODAL, setGlobalModal } from "state";

const FloatingToolbar = styled(Toolbar)<{ floating?: boolean }>`
  position: ${({ floating }) => (floating ? "absolute" : "relative")};
  top: 0;
  left: 0;
  z-index: 10;
  width: 60px;
`;

type ToolbarProps = {
  floating?: boolean;
  columns?: string;
};

export function PixiCanvasToolbar(props: ToolbarProps) {
  const { floating = false, columns = "100%" } = props;
  const { activeLayer } = useGlobalExploration(["activeLayer"]);

  return (
    <FloatingToolbar floating={floating} columns={columns}>
      <ToolbarButton
        // disabled //={!authenticated || role !== "Author"}
        className="flex--column"
        text="Layers"
        type="button"
        icon="layers"
        variant="transparent"
        onClick={() => setGlobalModal(MODAL.SELECT_SCENE_LAYER)}
      />
      {activeLayer !== "all" && (
        <>
          <ToolbarButton
            // disabled //={!authenticated || role !== "Author"}
            className="flex--column"
            text="Add Text"
            type="button"
            icon="text_fields"
            variant="transparent"
          />
          <ToolbarButton
            // disabled //={!authenticated || role !== "Author"}
            className="flex--column"
            text="Add Img"
            type="button"
            icon="image"
            variant="transparent"
          />
        </>
      )}
    </FloatingToolbar>
  );
}

export default PixiCanvasToolbar;
