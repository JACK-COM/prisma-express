import styled, { css } from "styled-components";
import useGlobalExploration from "hooks/GlobalExploration";
import { Toolbar, ToolbarButton } from "./Common/Toolbar";
import { MODAL, setGlobalLayer, setGlobalModal } from "state";

export const layersCSS = css`
  .background {
    color: #3d85f1;
  }
  .characters {
    color: #902477;
  }
  .foreground {
    color: #2eb72e;
  }
`;
const FloatingToolbar = styled(Toolbar)<{ floating?: boolean }>`
  background: ${({ theme }) => theme.colors.semitransparent};
  border-bottom-right-radius: 8px;
  position: ${({ floating }) => (floating ? "absolute" : "relative")};
  top: 0;
  left: 0;
  z-index: 10;
  width: 64px;
  overflow: hidden;

  ${layersCSS}
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
  const { activeLayer } = useGlobalExploration(["activeLayer"]);

  return (
    <FloatingToolbar floating={floating} columns={columns}>
      {activeLayer === "all" ? (
        LayerBtns.map(({ tag, text, do: click }) => (
          <ToolbarButton
            key={text}
            text={text}
            icon="layers"
            variant="transparent"
            className={tag}
            onClick={click}
          />
        ))
      ) : (
        <>
          <ToolbarButton
            className="beacon"
            text="Show All"
            icon="layers_clear"
            variant="transparent"
            onClick={() => setGlobalLayer("all")}
          />
          <ToolbarButton
            text="Add Slot"
            icon="wallpaper"
            className="gold--text expand--vertical"
            variant="transparent"
            onClick={() => setGlobalModal(MODAL.MANAGE_INTERACTIVE_SLOT)}
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
