import {
  GrammarlyEditorPlugin,
  GrammarlyEditorPluginProps
} from "@grammarly/editor-sdk-react";
import { Editor } from "@tinymce/tinymce-react";
import { useGlobalTheme } from "hooks/GlobalTheme";
import { AppTheme } from "theme/theme.shared";
import { noOp } from "utils";

const TINY_KEY = import.meta.env.VITE_TINYMCE_KEY;
const GMLY_KEY = import.meta.env.VITE_GRMLY_KEY;
const production = import.meta.env.PROD;
type GrammarlyConfigProps = GrammarlyEditorPluginProps["config"];
const grammarlyConfig: GrammarlyConfigProps = {
  documentDialect: "british",
  autocomplete: "on",
  documentDomain: "creative",
  introText: "Click here to begin writing!"
  // debug: true,
  // enabled: true,
  // showDebuggingLog: true,
};

type TinyMCEInit = {
  content_style?: string;
  height?: number;
  autosave?: boolean;
  menubar?: boolean;
  plugins?: string | string[];
  skin?: string;
  toolbar?: string | string[] | boolean;
};

type TinyMCEProps = {
  inline?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (content: string, editor?: any) => void;
  triggerSave?: () => void;
} & Pick<TinyMCEInit, "height" | "autosave" | "menubar" | "toolbar">;

const defaultPlugins = [
  "advlist",
  "anchor",
  "autolink",
  "code",
  "fullscreen",
  "help",
  "image",
  "link",
  "lists",
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
  const { theme, activeTheme } = useGlobalTheme();
  const {
    triggerSave = noOp,
    onChange = noOp,
    autosave,
    ...otherProps
  } = props;
  const { disabled, value, ...initOpts } = makeInitOpts(theme, otherProps);

  return (
    <GrammarlyEditorPlugin clientId={GMLY_KEY} config={grammarlyConfig}>
      <Editor
        apiKey={production ? TINY_KEY : undefined}
        tinymceScriptSrc={production ? undefined : `/tinymce/tinymce.min.js`}
        key={activeTheme}
        disabled={disabled}
        value={value || grammarlyConfig.introText}
        init={{ ...initOpts, autosave_interval: "10s" }}
        onEditorChange={onChange}
        onBlur={autosave ? triggerSave : undefined}
      />
    </GrammarlyEditorPlugin>
  );
};

export default TinyMCE;

// HELPERS

function prepInitOpts(opts: TinyMCEProps) {
  return {
    value: "",
    onChange: noOp,
    height: 500,
    autosave_restore_when_empty: true,
    toolbar:
      "preview restoredraft | undo redo | blocks | " +
      "removeformat | bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "image | help",
    inline: false, // this will enable the "skinless" appearance
    // override
    ...opts
  };
}

function makeInitOpts(
  theme: AppTheme,
  opts: TinyMCEProps
): TinyMCEInit & ReturnType<typeof prepInitOpts> {
  const plugs = [...defaultPlugins];
  if (opts.autosave) plugs.push("autosave");

  return {
    menubar: false,
    // Editor styles
    content_style: `body { 
      color: ${theme.colors.secondary};
      font-size: 16px;
    }`,
    plugins: plugs,
    skin: "oxide-dark",
    ...prepInitOpts(opts)
  };
}
