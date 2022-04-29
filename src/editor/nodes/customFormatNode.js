import { addClassNamesToElement } from "@lexical/utils";
import { $getSelection, ElementNode, TextNode } from "lexical";

// https://github.com/facebook/lexical/blob/main/examples/decorators.md

/* https://github.com/facebook/lexical/pull/1968 should fix the selection issues on android */

export class CustomFormatNode extends TextNode {
  static getType() {
    return "custom-format";
  }

  static clone(node) {
    return new CustomFormatNode(node.__customFormatKey, node.__text, node.__key);
  }

  constructor(customFormatKey, text, key) {
    super(text, key);
    this.__customFormatKey = customFormatKey;
    this.__initialText = text;
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    addClassNamesToElement(dom, config.theme.customFormat);
    return dom;
  }

  isTextEntity() {
    return true;
  }

  // more methods

  getCustomFormatKey() {
    return this.getLatest().__customFormatKey;
  }
}

export function $createCustomFormatNode({ customFormatKey, initialText }) {
  const customFormatNode = new CustomFormatNode(customFormatKey, initialText);

  return customFormatNode;
}

export function $isCustomFormatNode(node) {
  return node instanceof CustomFormatNode;
}
