import {
  GlobalUser,
  MODAL,
  prevGlobalExplorationScene,
  nextGlobalExplorationScene,
  setGlobalModal
} from "state";
import { ComponentPropsWithRef, Fragment, useMemo } from "react";
import { Paths, insertId } from "routes";
import { UserRole } from "utils/types";
import { noOp } from "utils";
import { Toolbar, ToolbarButton } from "./Common/Toolbar";

type SharedToolbarComponentProps = {
  saveOnBlur?: boolean;
  handleSave?: () => void;
  toggleAutoSave?: () => void;
};
// Builder Toolbar Buttons
type ToolbarButtonOpts = { previewUrl: string } & SharedToolbarComponentProps;
const TOOLBAR_BUTTONS = (o: ToolbarButtonOpts) => [
  {
    text: "Scenes",
    icon: "movie_filter",
    onClick: () => setGlobalModal(MODAL.SELECT_EXPLORATION_SCENE)
  },
  {
    text: "Previous",
    icon: "navigate_before",
    onClick: prevGlobalExplorationScene
  },
  {
    text: "Next",
    icon: "navigate_next",
    onClick: nextGlobalExplorationScene
  },
  { text: "Save", icon: "save", onClick: o.handleSave || noOp },
  {
    text: "Autosave",
    icon: `check_box${o.saveOnBlur ? "" : "_outline_blank"}`,
    onClick: o.toggleAutoSave || noOp
  },
  {
    text: "Preview",
    icon: "visibility",
    onClick: () => window.open(o.previewUrl, "_self")
  }
];

// Instance of Builder Toolbar
type BuilderToolbarOpts = {
  explorationId?: number;
  role: UserRole;
} & SharedToolbarComponentProps &
  ComponentPropsWithRef<"div">;
const BuilderToolbar = (props: BuilderToolbarOpts) => {
  const {
    explorationId,
    role,
    handleSave,
    saveOnBlur,
    toggleAutoSave,
    ...containerProps
  } = props;
  const { authenticated } = GlobalUser.getState();
  const previewUrl = useMemo(() => {
    if (!explorationId) return "#";
    return insertId(Paths.Explorations.Run.path, explorationId);
  }, [explorationId]);
  const buttons = useMemo(() => {
    return TOOLBAR_BUTTONS({
      saveOnBlur,
      previewUrl,
      handleSave,
      toggleAutoSave
    });
  }, [props]);

  return (
    <Toolbar
      columns={`repeat(${buttons.length * 2 + 2}, max-content)`}
      {...containerProps}
    >
      {buttons.map(({ icon, onClick, text }, i) => (
        <Fragment key={i}>
          <ToolbarButton
            disabled={!authenticated || role !== "Author"}
            text={text}
            type="button"
            icon={icon}
            variant="transparent"
            onClick={onClick}
          />
          {i < buttons.length - 1 && <hr className="spacer" />}
        </Fragment>
      ))}
      <hr className="spacer" />
    </Toolbar>
  );
};

export default BuilderToolbar;
