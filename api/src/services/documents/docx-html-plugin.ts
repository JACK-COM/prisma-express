import {
  DocxParser,
  XmlTextNode,
  XmlGeneralNode,
  TextPlugin,
  XmlNode,
  stringValue
} from "easy-template-x";

function _defineProperty(obj: any, key: PropertyKey, value: string) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const stripTags = (input: string, allowed: any[]) => {
  allowed = allowed.map((s: string) => s.toLowerCase());
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  // filter empty strings "", line-breaks "\n" and tabs "\t", and allowed tags
  return input.replace(tags, ($0: any, $1: string) =>
    allowed.includes($1.toLowerCase()) ? $0 : ""
  );
};

let allowedTags = new Set(["b", "i", "p", "h1", "h2", "h3", "u"]);

class HtmlObject {
  /**
   * @type {Set<string>}
   */
  static allowedWrapTags: Set<string> = allowedTags;
  text: string;
  children: HtmlObject[] = [];
  parent: HtmlObject | null = null;
  wrapTags: Set<string> = new Set();

  /**
   * @param {string} text
   * @param {HtmlObject[]} children
   * @param {HtmlObject} parent
   * @param {Set<string>} wrapTags
   */
  constructor(
    text: string,
    children: HtmlObject[] = [],
    parent: HtmlObject | null = null,
    wrapTags?: Set<string>
  ) {
    this.text = text;
    this.children = children;
    this.parent = parent || null;
    this.wrapTags = wrapTags ?? new Set([]);
  }

  /**
   * @param {string} str
   * @param {string} tagName
   * @returns {number}
   */
  static getOpenTagIndex(str: string, tagName: string): number {
    return str.search(new RegExp(`<${tagName}[^>]*>`, "gi"));
  }

  /**
   * @param {string} str
   * @param {string} tagName
   * @returns {number}
   */
  static getCloseTagIndex(str: string, tagName: string): number {
    return str.search(new RegExp(`<\/${tagName}[^>]*>`, "gi"));
  }

  static addOrPushToArray(array: any[], index: number, str: string) {
    if (array[index]) array[index] += str;
    else array.push(str);
    return array;
  }

  static splitTextByTags(text: string | string[]) {
    if (Array.isArray(text)) text = text.join(""); //TESTOSAURUS
    let strings = [];
    let stringIndex = -1;
    let breakIterator = 0;
    let breakIteratorMax = text.length;
    while (!!text) {
      breakIterator++; // Bug Security
      if (breakIterator > breakIteratorMax) break;

      let tagName = "";
      let openTagIndex = -1;

      for (const allowedWrapTag of HtmlObject.allowedWrapTags) {
        let newIndex = HtmlObject.getOpenTagIndex(text, allowedWrapTag);
        if (
          openTagIndex === -1 ||
          (openTagIndex > newIndex && newIndex !== -1)
        ) {
          openTagIndex = newIndex;
          tagName = allowedWrapTag;
        }
      }

      if (openTagIndex !== -1) {
        let subText = text.slice(0, openTagIndex);
        if (subText) {
          stringIndex++;
          HtmlObject.addOrPushToArray(strings, stringIndex, subText);
          text = text.slice(openTagIndex, text.length);
        }

        subText = text.slice(0, text.indexOf(">") + 1);
        stringIndex++;
        HtmlObject.addOrPushToArray(strings, stringIndex, subText);
        text = text.slice(subText.length, text.length);

        while (!!text) {
          breakIterator++; // Bug Security
          if (breakIterator > breakIteratorMax) break;

          let newOpenIndex = HtmlObject.getOpenTagIndex(text, tagName);
          let newCloseIndex = HtmlObject.getCloseTagIndex(text, tagName);

          if (newCloseIndex === -1) {
            HtmlObject.addOrPushToArray(strings, stringIndex, text);
            text = "";
            break;
          } else {
            let isBreak = newOpenIndex === -1 || newOpenIndex > newCloseIndex;

            subText = text.slice(0, newCloseIndex);
            HtmlObject.addOrPushToArray(strings, stringIndex, subText);
            text = text.slice(newCloseIndex, text.length);

            subText = text.slice(0, text.indexOf(">") + 1);
            HtmlObject.addOrPushToArray(strings, stringIndex, subText);
            text = text.slice(subText.length, text.length);

            if (isBreak) {
              break;
            }
          }
        }

        if (text) {
          let isNeedNext = false;

          for (const allowedWrapTag of HtmlObject.allowedWrapTags) {
            let newIndex = HtmlObject.getOpenTagIndex(text, allowedWrapTag);
            if (newIndex !== -1) {
              isNeedNext = true;
            }
          }
          if (!isNeedNext) {
            stringIndex++;
            HtmlObject.addOrPushToArray(strings, stringIndex, text);
            text = "";
          }
        }
      } else {
        HtmlObject.addOrPushToArray(strings, stringIndex, text);
        text = "";
      }
    }
    if (!strings.length) return [text];
    return strings;
  }

  build() {
    let text = this.text;
    this.wrapTags = this.parent
      ? new Set(Array.from(this.parent.wrapTags))
      : new Set([]);

    let strings: string[] = [];
    let isWhile = true;

    while (isWhile) {
      strings = HtmlObject.splitTextByTags(text);
      let str = strings[0];
      if (
        strings.length === 1 &&
        str[0] === "<" &&
        str[str.length - 1] === ">"
      ) {
        let tagName: string | null = null;
        let openTagIndex = -1;

        for (const allowedWrapTag of HtmlObject.allowedWrapTags) {
          let newIndex = HtmlObject.getOpenTagIndex(str, allowedWrapTag);
          if (
            openTagIndex === -1 ||
            (openTagIndex > newIndex && newIndex !== -1)
          ) {
            openTagIndex = newIndex;
            tagName = allowedWrapTag;
          }
        }

        if (tagName && openTagIndex === 0) {
          this.wrapTags.add(tagName);

          text = str.slice(
            str.indexOf(">") + 1,
            str.length - tagName.length - 3
          );
        } else isWhile = false;
      } else isWhile = false;
    }

    if (strings.length === 1 && strings[0] === this.text) {
      return this;
    }

    let isNeedBuild = false;

    for (const allowedWrapTag of HtmlObject.allowedWrapTags) {
      let newIndex = HtmlObject.getOpenTagIndex(text, allowedWrapTag);
      if (newIndex !== -1) {
        isNeedBuild = true;
        break;
      }
    }

    this.children = [];
    for (let i = 0; i < strings.length; i++) {
      const htmlObject = new HtmlObject(
        strings[i],
        [],
        this,
        new Set(Array.from(this.wrapTags))
      );
      isNeedBuild && htmlObject.build();
      this.children.push(htmlObject);
    }

    return this;
  }
}

const BOLD_NODE = "w:b";
const COMPLEX_SCRIPT_BOLD_NODE = "w:bCs";

const ITALIC_NODE = "w:i";
const COMPLEX_SCRIPT_ITALIC_NODE = "w:iCs";

const UNDERLINE_NODE = "w:u";

class HtmlPlugin extends TextPlugin {
  constructor() {
    super();

    _defineProperty(this, "contentType", "html");
  }

  /**
   * Replace the node text content with the specified value.
   */
  simpleTagReplacements(
    tag: { xmlTextNode: XmlNode },
    data: { getScopeData: () => any }
  ) {
    const value = data.getScopeData();
    let str = stringValue(value.html).replace(/<br\s*\/?>/gi, "\n");
    str = stripTags(str, Array.from(allowedTags)).trim();

    const htmlObject = new HtmlObject(str);
    htmlObject.build();

    const paragraphNode = this.utilities.docxParser.containingParagraphNode(
      tag.xmlTextNode
    ); // first line
    const runNode = this.utilities.docxParser.containingRunNode(
      tag.xmlTextNode
    ); // first line
    let runPropNode = this.findChildByName(
      runNode,
      DocxParser.RUN_PROPERTIES_NODE
    ) || { attributes: {}, childNodes: [] };

    if (!runPropNode) {
      runPropNode = XmlNode.createGeneralNode(DocxParser.RUN_PROPERTIES_NODE);
      runPropNode.attributes = {};
      runPropNode.childNodes = [];
      runPropNode.parentNode = runNode;
    }

    this.createRun(
      htmlObject,
      tag.xmlTextNode as any,
      runNode as any,
      runPropNode as any,
      paragraphNode as any
    );

    paragraphNode.childNodes = (paragraphNode.childNodes || []).filter(
      (n) => n !== runNode
    );
  }

  /**
   * @param {HtmlObject} htmlObject
   * @param {XmlTextNode} textNode
   * @param {XmlGeneralNode} runNode
   * @param {XmlGeneralNode} runPropNode
   * @param {XmlGeneralNode} paragraphNode
   */
  createRun(
    htmlObject: HtmlObject,
    textNode: XmlTextNode,
    runNode: XmlGeneralNode,
    runPropNode: XmlGeneralNode,
    paragraphNode: XmlGeneralNode
  ) {
    if (htmlObject.children.length === 0) {
      if (htmlObject.text) {
        const str = htmlObject.text;

        const newRunNode = XmlNode.createGeneralNode(DocxParser.RUN_NODE);
        const newRunPropNode = XmlNode.createGeneralNode(
          DocxParser.RUN_PROPERTIES_NODE
        );

        newRunNode.parentNode = runNode.parentNode;
        this.copyAttributes(runNode, newRunNode);

        this.copyAttributes(runPropNode, newRunPropNode);

        const childNodes = runPropNode.childNodes || [];
        for (let i = 0; i < childNodes.length; i++) {
          const propertyRunPropNode = childNodes[i];
          const newPropertyRunPropNode = XmlNode.createGeneralNode(
            propertyRunPropNode.nodeName
          );

          this.copyAttributes(
            propertyRunPropNode as XmlGeneralNode,
            newPropertyRunPropNode
          );
          XmlNode.appendChild(newRunPropNode, newPropertyRunPropNode);
        }

        if (htmlObject.wrapTags.has("b")) {
          this.addProperty(newRunPropNode, BOLD_NODE);
          this.addProperty(newRunPropNode, COMPLEX_SCRIPT_BOLD_NODE);
        }
        if (htmlObject.wrapTags.has("i")) {
          this.addProperty(newRunPropNode, ITALIC_NODE);
          this.addProperty(newRunPropNode, COMPLEX_SCRIPT_ITALIC_NODE);
        }
        if (htmlObject.wrapTags.has("u")) {
          this.addProperty(newRunPropNode, UNDERLINE_NODE, {
            "w:val": "single"
          });
        }

        XmlNode.appendChild(newRunNode, newRunPropNode);

        const lines = str.split("\n");

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];

          if (i > 0) {
            // add line break
            const lineBreak = this.publicGetLineBreak();
            XmlNode.appendChild(newRunNode, lineBreak); // add text
          }

          const lineNode = this.publicCreateWordTextNode(line);
          XmlNode.appendChild(newRunNode, lineNode);
        }
        XmlNode.appendChild(paragraphNode, newRunNode);
      }
    } else {
      for (let i = 0; i < htmlObject.children.length; i++) {
        this.createRun(
          htmlObject.children[i],
          textNode,
          runNode,
          runPropNode,
          paragraphNode
        );
      }
    }
  }

  addProperty(propNode: XmlNode, nodeName: string, attributes = {}) {
    if (
      !propNode.childNodes?.find(
        (n: { nodeName: any }) => n.nodeName === nodeName
      )
    ) {
      const node = XmlNode.createGeneralNode(nodeName);
      node.attributes = attributes;
      XmlNode.appendChild(propNode, node);
    }
  }

  /**
   * @param {XmlGeneralNode} node
   * @param {string} childName
   */
  findChildByName(node?: XmlNode | XmlGeneralNode, childName?: string) {
    if (!node) return null;
    return (node.childNodes || []).find(
      (child) => child.nodeName === childName
    );
  }

  /**
   * @param {XmlGeneralNode} fromNode
   * @param {XmlGeneralNode} toNode
   */
  copyAttributes(fromNode: XmlGeneralNode, toNode: XmlGeneralNode) {
    if (fromNode.attributes) {
      if (!toNode.attributes) toNode.attributes = {};
      for (const attributesKey in fromNode.attributes) {
        toNode.attributes[attributesKey] = fromNode.attributes[attributesKey];
      }
    }
  }

  publicGetLineBreak() {
    return XmlNode.createGeneralNode("w:br");
  }

  publicCreateWordTextNode(text: string | undefined) {
    const wordTextNode = XmlNode.createGeneralNode(DocxParser.TEXT_NODE);
    wordTextNode.attributes = {};
    this.utilities.docxParser.setSpacePreserveAttribute(wordTextNode);
    wordTextNode.childNodes = [XmlNode.createTextNode(text)];
    return wordTextNode;
  }
}

export default HtmlPlugin;
