import {
  GrammarlyEditorPlugin,
  GrammarlyEditorPluginProps
} from "@grammarly/editor-sdk-react";
import { Textarea, TinyMCE } from "./Form";

const KEY = import.meta.env.VITE_GRMLY_KEY;

const Grammarly = () => {
//   const {} = p;
  return (
    <GrammarlyEditorPlugin clientId={KEY}>
      {/* <Textarea /> */}
      <TinyMCE />
    </GrammarlyEditorPlugin>
  );
};

export default Grammarly;
