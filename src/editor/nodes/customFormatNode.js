import { $getSelection, $isRangeSelection, DecoratorNode } from "lexical";
import { useEffect, useState } from "react";
import { useCustomFormats } from "../plugins/customFormatPlugin";

// https://github.com/facebook/lexical/blob/main/examples/decorators.md

/* https://github.com/facebook/lexical/pull/1968 should fix the selection issues on android */

function Spancer() {
  return <span className="spancer"> </span>;
}

function CustomFormatElement({ customFormatKey, editor, nodeKey, formats }) {
  const customFormats = useCustomFormats();

  const { value } = customFormats.find(({ key }) => key === customFormatKey);

  const [isSelected, setIsSelected] = useState(false);

  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const setTextSettings = () => {
      ctx.font = "16px system-ui";
      ctx.textBaseline = "top";
    };

    setTextSettings();

    const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(value);
    canvas.width = width;
    canvas.height = actualBoundingBoxAscent + actualBoundingBoxDescent;

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setTextSettings();
    ctx.fillStyle = "black";
    ctx.fillText(value, 0, 0);

    setImgSrc(canvas.toDataURL("image/png"));
  }, [value]);

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
    <>
      {/* <Spancer />
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
      <Spancer /> */}

      {imgSrc && <img className="cursor-pointer inline" src={imgSrc} />}
    </>
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

  getFormats() {
    return this.__formats;
  }

  getCustomFormatKey() {
    return this.__customFormatKey;
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
