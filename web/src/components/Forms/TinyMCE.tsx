import { Editor } from "@tinymce/tinymce-react";
import { useGlobalTheme } from "hooks/GlobalTheme";
import { useGlobalWindow } from "hooks/GlobalWindow";
import { AppTheme } from "shared";
import { noOp } from "utils";

const editorKey = import.meta.env.VITE_TINYMCE_KEY;
const production = import.meta.env.PROD;

type TinyMCEInit = {
  content_style?: string;
  height?: number;
  menubar?: boolean;
  plugins?: string | string[];
  skin?: string;
  toolbar?: string | string[] | boolean;
};

type TinyMCEProps = {
  disabled?: boolean;
  value?: string;
  onChange?: (content: string, editor?: any) => void;
  triggerSave?: () => void;
} & Pick<TinyMCEInit, "height" | "menubar" | "toolbar">;

const plugins = [
  "advlist",
  "autosave",
  "anchor",
  "autolink",
  "code",
  "fullscreen",
  "help",
  "image",
  "link",
  "lists",
  "preview",
  "searchreplace",
  "table",
  "visualblocks",
  "wordcount"
];

type EditorCommand = {
  command: string;
  ui?: boolean;
  value?: string;
  stopImmediatePropagation?: () => void;
  preventDefault?: () => void;
};
/** Custom internal wrapper for TinyMCE editor */
export const TinyMCE = (props: TinyMCEProps) => {
  const { isMobile } = useGlobalWindow();
  const { theme, activeTheme } = useGlobalTheme();
  const { triggerSave = noOp, onChange = noOp, ...otherProps } = props;
  const { disabled, value, ...initOpts } = makeInitOpts(
    isMobile,
    theme,
    otherProps
  );

  return (
    <Editor
      apiKey={production ? editorKey : undefined}
      tinymceScriptSrc={production ? undefined : `/tinymce/tinymce.min.js`}
      key={activeTheme}
      disabled={disabled}
      value={value}
      init={{ ...initOpts, autosave_interval: "10s" }}
      onEditorChange={onChange}
      onBlur={triggerSave}
    />
  );
};

export default TinyMCE;

// HELPERS

function prepInitOpts(opts: TinyMCEProps) {
  return {
    value: "",
    onChange: noOp,
    height: 500,
    toolbar:
      "preview restoredraft | undo redo | blocks | " +
      "removeformat | bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "image | help",
    // override
    ...opts
  };
}

function makeInitOpts(
  isMobile: boolean,
  theme: AppTheme,
  opts: TinyMCEProps
): TinyMCEInit & ReturnType<typeof prepInitOpts> {
  return {
    menubar: false,
    // Editor styles
    content_style: `body { 
        background: ${theme.colors.bgColor}; 
        color: ${theme.colors.secondary};
        font-family:Helvetica,Arial,sans-serif; 
        font-size:16px;
      }
      `,
    plugins,
    skin: "oxide-dark",
    ...prepInitOpts(opts)
  };
}
