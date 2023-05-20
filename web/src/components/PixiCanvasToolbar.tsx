import styled, { css } from "styled-components";
import useGlobalExploration from "hooks/GlobalExploration";
import { Toolbar, ToolbarButton } from "./Common/Toolbar";
import { MODAL, setGlobalLayer, setGlobalModal } from "state";

export const canvasLayersCSS = css`
  .background {
    color: #3d85f1;
  }
  .characters {
    color: #e678cc;
  }
  .foreground {
    color: #2eb72e;
  }
`;
const FloatingToolbar = styled(Toolbar)<{ floating?: boolean }>`
  background: ${({ theme }) => theme.colors.bgColor};
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
  position: ${({ floating }) => (floating ? "absolute" : "relative")};
  top: 5%;
  left: 0;
  z-index: 10;
  width: 64px;
  overflow: hidden;

  ${canvasLayersCSS}
`;

type ToolbarProps = {
  floating?: boolean;
  columns?: string;
};

const LayerBtns = [
  { tag: "background", text: "BG", do: () => setGlobalLayer("background") },
  { tag: "characters", text: "Chars", do: () => setGlobalLayer("characters") },
  { tag: "foreground", text: "FG", do: () => setGlobalLayer("foreground") }
];

export function PixiCanvasToolbar(props: ToolbarProps) {
  const { floating = false, columns = "100%" } = props;
  const { activeLayer = "all", activeSlotIndex = -1 } = useGlobalExploration([
    "activeLayer",
    "activeSlotIndex"
  ]);

  return (
    <FloatingToolbar floating={floating} columns={columns}>
      {activeLayer === "all" ? (
        LayerBtns.map(({ tag, text, do: click }) => (
          <ToolbarButton
            key={text}
            text={text}
            icon={
              [tag, "all"].includes(activeLayer) ? "layers" : "layers_clear"
            }
            variant="transparent"
            className={tag}
            onClick={click}
          />
        ))
      ) : (
        <>
          <ToolbarButton
            className={`${activeLayer} expand--vertical`}
            text="Show All"
            icon="layers_clear"
            variant="transparent"
            onClick={() => setGlobalLayer("all")}
          />
          {activeSlotIndex >= 0 && (
            <ToolbarButton
              className="accent--text expand--vertical"
              text="Config"
              icon="settings"
              variant="transparent"
              onClick={() => setGlobalModal(MODAL.MANAGE_INTERACTIVE_SLOT)}
            />
          )}
          <ToolbarButton
            text="Add Slot"
            icon="wallpaper"
            className="gold--text expand--vertical"
            variant="transparent"
            onClick={() => setGlobalModal(MODAL.CREATE_INTERACTIVE_SLOT)}
          />
        </>
      )}
      <ToolbarButton
        text="Help"
        icon="help"
        variant="transparent"
        className="success--text expand--vertical"
        onClick={() => setGlobalModal(MODAL.EXPLORATION_BUILDER_HELP)}
      />
    </FloatingToolbar>
  );
}

export default PixiCanvasToolbar;
