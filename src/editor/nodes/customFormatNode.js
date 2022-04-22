import { $getSelection, $isRangeSelection, DecoratorNode } from "lexical";
import { useEffect, useState } from "react";
import { useCustomFormats } from "../plugins/customFormatPlugin";

// https://github.com/facebook/lexical/blob/main/examples/decorators.md

function CustomFormatElement({ customFormatKey, editor, nodeKey, formats }) {
  const customFormats = useCustomFormats();

  const { value } = customFormats.find(({ key }) => key === customFormatKey);

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          setIsSelected(false);
          return;
        }

        const nodes = selection.getNodes();

        const isInSelection = nodes.some((node) => node.__key === nodeKey);

        setIsSelected(isInSelection);
      });
    });

    return unregister;
  }, [editor, nodeKey]);

  return (
    <span
      onClick={() => {
        editor.update(() => {
          const selection = $getSelection();

          selection.anchor.set(nodeKey, 0, "element");
          selection.focus.set(nodeKey, 0, "element");
        });
      }}
      className={`cursor-pointer border-b border-b-gray-500 hover:border-b-blue-500 select-none ${isSelected ? "ring-2 ring-blue-500 rounded" : ""} ${formats.bold ? "font-bold" : ""} ${
        formats.italic ? "italic" : ""
      } ${formats.underline ? "underline" : ""}`}
    >
      {value}
    </span>
  );
}

export class CustomFormatNode extends DecoratorNode {
  static getType() {
    return "custom-format";
  }

  static clone(node) {
    return new CustomFormatNode(node.__customFormatKey, node.__value, node.__formats, node.__key);
  }

  constructor(customFormatKey, value, formats, key) {
    super(key);
    this.__customFormatKey = customFormatKey;
    this.__value = value;
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

  decorate(editor) {
    return <CustomFormatElement editor={editor} customFormatKey={this.__customFormatKey} value={this.__value} formats={this.__formats} nodeKey={this.__key} />;
  }
}

export function $createCustomFormatNode(customFormatKey, value) {
  return new CustomFormatNode(customFormatKey, value, { bold: false, italic: false, underline: false });
}

export function $isCustomFormatNode(node) {
  return node instanceof CustomFormatNode;
}
