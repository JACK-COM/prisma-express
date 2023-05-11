import styled from "styled-components";
import { GridContainer } from "./Common/Containers";
import {
  GlobalUser,
  MODAL,
  nextGlobalScene,
  prevGlobalScene,
  setGlobalModal
} from "state";
import { ComponentPropsWithRef, Fragment, useMemo } from "react";
import { Paths, downloadBookURL, insertId } from "routes";
import { ButtonWithIcon } from "./Forms/Button";
import { UserRole } from "utils/types";
import { noOp } from "utils";
import { getAndShowPrompt } from "api/loadUserData";

const Toolbar = styled(GridContainer)`
  align-items: center;
  gap: ${({ theme }) => theme.sizes.xs};
  overflow-x: auto;
  overflow-y: hidden;
  > .spacer {
    display: inline-block;
    width: 1px;
    height: 32px;
    background-color: ${({ theme }) => theme.colors.semitransparent};
    right: 0;
  }
  .material-icons {
    font-size: ${({ theme }) => theme.sizes.md};
  }
`;
const ToolbarButton = styled(ButtonWithIcon)`
  padding: ${({ theme }) => `0 ${theme.sizes.sm}`};
  .text {
    ${({ theme }) => theme.mixins.ellipsis};
    font-size: 0.5rem;
    text-transform: uppercase;
  }
`;

type SharedToolbarComponentProps = {
  saveOnBlur?: boolean;
  handleSave?: () => void;
  toggleAutoSave?: () => void;
};
// Editor Toolbar Buttons
type ToolbarButtonOpts = {
  downloadUrl: string;
  previewUrl: string;
} & SharedToolbarComponentProps;
const TOOLBAR_BUTTONS = (o: ToolbarButtonOpts) => [
  {
    text: "Chapters",
    icon: "segment",
    onClick: () => setGlobalModal(MODAL.SELECT_CHAPTER)
  },
  { text: "Save", icon: "save", onClick: o.handleSave || noOp },
  {
    text: "Previous",
    icon: "navigate_before",
    onClick: prevGlobalScene
  },
  {
    text: "Next",
    icon: "navigate_next",
    onClick: nextGlobalScene
  },
  {
    text: "Autosave",
    icon: `check_box${o.saveOnBlur ? "" : "_outline_blank"}`,
    onClick: o.toggleAutoSave || noOp
  },
  {
    text: "Link",
    icon: "add_link",
    onClick: () => setGlobalModal(MODAL.LINK_SCENE)
  },
  {
    text: "Preview",
    icon: "visibility",
    onClick: () => window.open(o.previewUrl, "_self")
  },
  {
    text: "Download",
    icon: "download",
    onClick: () => window.open(o.downloadUrl, "_self")
  },
  {
    text: "Prompt",
    icon: "tips_and_updates",
    onClick: () => getAndShowPrompt(undefined, true)
  }
];

// Instance of Editor Toolbar
type EditorToolbarOpts = {
  bookId: number;
  role: UserRole;
} & SharedToolbarComponentProps &
  ComponentPropsWithRef<"div">;
const EditorToolbar = (props: EditorToolbarOpts) => {
  const {
    bookId,
    role,
    handleSave,
    saveOnBlur,
    toggleAutoSave,
    ...containerProps
  } = props;
  const { authenticated } = GlobalUser.getState();
  const [previewUrl, downloadUrl] = useMemo(() => {
    if (!bookId) return ["#", "#"];
    return [
      insertId(Paths.Library.BookPreview.path, bookId),
      downloadBookURL(Number(bookId))
    ];
  }, [bookId]);
  const buttons = useMemo(() => {
    const opts = {
      saveOnBlur,
      downloadUrl,
      previewUrl,
      handleSave,
      toggleAutoSave
    };
    return TOOLBAR_BUTTONS(opts);
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
            className="flex--column"
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
      {/* <Ellipsis>More toolbar buttons here</Ellipsis> */}
    </Toolbar>
  );
};

export default EditorToolbar;
