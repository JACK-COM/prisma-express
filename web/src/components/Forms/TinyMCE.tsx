import { Editor } from "@tinymce/tinymce-react";
import { noOp } from "utils";

const editorKey = import.meta.env.VITE_TINYMCE_KEY;

type TinyMCEInit = {
  height?: number | number;
  menubar?: boolean | boolean;
  plugins?: string | string[];
  toolbar?: string | string[] | boolean;
  content_style?: string;
};

type TinyMCEProps = {
  height?: number;
  menubar?: boolean;
  onChange?: (content: string, editor?: any) => void;
  toolbar?: string;
  value?: string;
};

const DEFAULTS = {
  value: "",
  onChange: noOp,
  menubar: false,
  height: 500,
  toolbar:
    "undo redo | blocks | " +
    "bold italic forecolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
};
const plugins = [
  "advlist",
  "autolink",
  "lists",
  "link",
  "image",
  "charmap",
  "preview",
  "anchor",
  "searchreplace",
  "visualblocks",
  "code",
  "fullscreen",
  "insertdatetime",
  "media",
  "table",
  "code",
  "help",
  "wordcount"
];

/** Custom internal wrapper for TinyMCE editor */
export const TinyMCE = (props: TinyMCEProps) => {
  const { height, menubar, onChange, toolbar, value } = {
    ...DEFAULTS,
    ...props
  };
  const initOpts: TinyMCEInit = {
    height,
    menubar,
    toolbar,
    content_style: DEFAULTS.content_style,
    plugins
  };

  return (
    <Editor
      apiKey={editorKey}
      value={value}
      init={initOpts}
      onEditorChange={onChange}
    />
  );
};

export default TinyMCE;
