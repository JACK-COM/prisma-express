import { PureComponent } from "react";
import { PellElement, init, exec, pellAction } from "pell";

import "pell/dist/pell.css";
import {
  GrammarlyEditorPlugin,
  GrammarlyEditorPluginProps
} from "@grammarly/editor-sdk-react";
import styled from "styled-components";

const GMLY_KEY = import.meta.env.VITE_GRMLY_KEY;
const grammarlyConfig: GrammarlyConfigProps = {
  documentDialect: "british",
  autocomplete: "on",
  documentDomain: "creative",
  introText: "Click here to begin writing!"
};
type GrammarlyConfigProps = GrammarlyEditorPluginProps["config"];
type PellEditorProps = {
  value?: string;
  height?: number;
  onChange?: (content: string) => void;
  autosave?: boolean;
  triggerSave?: () => void;
};

const EditorContainer = styled.div<{ height?: string | number }>`
  .pell-actionbar {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
  }
  .pell-content {
    background-color: white;
    color: ${({ theme }) => theme.colors.secondary};
    height: ${({ height = "78vh" }) => height};

    p:first-of-type {
      margin-top: 0;
    }
  }
  .pell-button-selected {
    color: ${({ theme }) => theme.colors.secondary};
  }

  @media screen and (max-width: 768px) {
    .pell-content {
      height: 100%;
    }
  }
`;

const toolbarActions: pellAction[] = [
  "bold",
  "underline",
  "italic",
  { name: "olist", icon: "1", result: () => exec("insertOrderedList") },
  {
    name: "ulist",
    icon: `<span class="material-icons">list</span>`,
    result: () => exec("insertUnorderedList")
  },
  "link"
];

export default class PellEditor extends PureComponent<PellEditorProps> {
  editor: (HTMLElement & PellElement) | null = null;
  initialVal = "Click here to begin writing!";

  constructor(props: PellEditorProps) {
    super(props);
    if (props.value) this.initialVal = props.value;
  }

  componentDidMount() {
    if (this.editor) {
      this.editor.content.innerHTML = this.props.value || this.initialVal;
      return;
    }
    this.editor = init({
      element: document.getElementById("editor") as HTMLElement,
      onChange: (html) => this.updateAndNotify(html),
      defaultParagraphSeparator: "p",
      //  Toolbar actions
      actions: toolbarActions
    });
    this.editor.content.innerHTML = this.initialVal;
  }

  componentDidUpdate(prevProps: Readonly<PellEditorProps>): void {
    const newValue = this.props.value;
    const shouldChange = prevProps.value !== newValue;
    if (!this.editor || !newValue || !shouldChange) return;
    this.initialVal = newValue;
  }

  updateAndNotify = (html: string) => {
    this.setState({ html });
    this.props.onChange?.(html);
  };

  render() {
    const { height } = this.props;

    return (
      <GrammarlyEditorPlugin clientId={GMLY_KEY} config={grammarlyConfig}>
        <EditorContainer height={height} id="pell-editor">
          <div id="editor" className="pell" />
        </EditorContainer>
      </GrammarlyEditorPlugin>
    );
  }
}
