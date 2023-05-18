import {
  GlobalLibrary,
  GlobalUser,
  MODAL,
  nextGlobalScene,
  prevGlobalScene,
  setGlobalModal
} from "state";
import { ComponentPropsWithRef, Fragment, useMemo } from "react";
import { Paths, downloadBookURL, insertId } from "routes";
import { UserRole } from "utils/types";
import { noOp } from "utils";
import { getAndShowPrompt } from "api/loadUserData";
import { Toolbar, ToolbarButton } from "./Common/Toolbar";
import { buildDescriptionPrompt } from "utils/prompt-builder";

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
    text: "Download",
    icon: "download",
    onClick: () => window.open(o.downloadUrl, "_self")
  },
  { text: "Save", icon: "save", onClick: o.handleSave || noOp },
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
    text: "Prompt",
    icon: "tips_and_updates",
    onClick: () => {
      const {
        focusedBook: book,
        focusedChapter: chapter,
        focusedScene: scene
      } = GlobalLibrary.getState();
      if (!book) return;
      const { genre } = book;
      const bookInfo = `a book titled "${book.title}" (${genre}))`;
      let fbInput = `[ WRITING PROMPT ] New ideas for a ${bookInfo}"`;
      if (scene?.title) {
        const { title } = scene;
        fbInput = `[ WRITING PROMPT ] A scene called "${bookInfo}`;
      } else if (chapter?.title) {
        const { title } = chapter;
        fbInput = `[ WRITING PROMPT ] A chapter called "${bookInfo}`;
      } else if (book.description) {
        const { description } = book;
        fbInput = `${fbInput}\n\nBook description: "${description}"`;
      }

      return getAndShowPrompt(fbInput, true);
    }
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

export default EditorToolbar;
