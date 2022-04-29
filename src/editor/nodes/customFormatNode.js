import LexicalComposer from "@lexical/react/LexicalComposer";
import ContentEditable from "@lexical/react/LexicalContentEditable";

import { $createParagraphNode, $createRangeSelection, $createTextNode, $getRoot, $getSelection, $isRangeSelection, $setSelection, DecoratorNode } from "lexical";
import { useEffect, useState, useRef } from "react";
import { useCustomFormats } from "../plugins/customFormatPlugin";
import parseTextFormat from "../utils/parseTextFormat";

import PlainTextPlugin from "@lexical/react/LexicalPlainTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const editorConfig = {
  onError(e) {
    console.error("[help me]", e);
  },
  theme: {
    paragraph: "inline",
  },
};
// https://github.com/facebook/lexical/blob/main/examples/decorators.md

/* https://github.com/facebook/lexical/pull/1968 should fix the selection issues on android */

function CustomFormatEditor({ value, set }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();

      root.getChildren().forEach((child) => child.remove());

      const paragraph = $createParagraphNode();
      const text = $createTextNode(value);

      root.append(paragraph.append(text));
    });
  }, [editor, value]);

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    editor.registerTextContentListener(() => {
      // hafta serialize to plain text now.

      const nodeMap = editor.getEditorState()._nodeMap;

      const root = nodeMap.get("root");

      function serialize(node) {
        const type = node.__type;

        if (type === "text") return node.__text;

        const children = node?.__children;

        if (Array.isArray(children)) {
          const serializedChildren = children.map((n) => serialize(nodeMap.get(n))).join("");

          return serializedChildren;
        }
      }

      const probablyPlaintext = serialize(root);

      setLocalValue(probablyPlaintext);
    });
  }, [editor, set]);

  return null;
}

function Spancer() {
  return <span className="spancer"> </span>;
}

function CustomFormatElement({ customFormatKey }) {
  const { customFormats, setCustomFormat } = useCustomFormats();

  console.log(customFormats);

  const { key, value } = customFormats.find(({ key }) => key === customFormatKey);

  return (
    <>
      <Spancer />
      <LexicalComposer initialConfig={editorConfig}>
        <CustomFormatEditor value={value} set={(newValue) => setCustomFormat(key, newValue)} />
        <PlainTextPlugin contentEditable={<ContentEditable className="inline" />} />
      </LexicalComposer>

      <Spancer />
    </>
  );
}

export class CustomFormatNode extends DecoratorNode {
  static getType() {
    return "custom-format";
  }

  static clone(node) {
    return new CustomFormatNode(node.__customFormatKey, node.__formats, node.__key);
  }

  constructor(customFormatKey, formats, key) {
    super(key);
    this.__customFormatKey = customFormatKey;
    this.__formats = formats;
  }

  createDOM() {
    const span = document.createElement("span");
    return span;
  }

  updateDOM() {
    return false;
  }

  setFormat(format) {
    const writable = this.getWritable();

    const clonedFormats = { ...this.__formats };

    clonedFormats[format] = !clonedFormats[format];

    writable.__formats = clonedFormats;
  }

  getFormats() {
    return this.__formats;
  }

  getCustomFormatKey() {
    return this.__customFormatKey;
  }

  decorate(editor) {
    return <CustomFormatElement editor={editor} customFormatKey={this.__customFormatKey} formats={this.__formats} nodeKey={this.__key} />;
  }
}

export function $createCustomFormatNode(customFormatKey) {
  const selection = $getSelection();

  let { bold, italic, underline } = { bold: false, italic: false, underline: false };

  if ($isRangeSelection(selection)) ({ bold, italic, underline } = parseTextFormat(selection.format));

  return new CustomFormatNode(customFormatKey, { bold, italic, underline });
}

export function $isCustomFormatNode(node) {
  return node instanceof CustomFormatNode;
}
