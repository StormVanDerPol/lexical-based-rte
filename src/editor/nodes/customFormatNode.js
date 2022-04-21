import { DecoratorNode } from "lexical";
import { useCustomFormats } from "../plugins/customFormatPlugin";

// https://github.com/facebook/lexical/blob/main/examples/decorators.md

function CustomFormatElement({ customFormatKey }) {
  const customFormats = useCustomFormats();

  const { value } = customFormats.find(({ key }) => key === customFormatKey);

  return (
    <span className="cursor-pointer border-b border-b-gray-500 hover:border-b-blue-500">
      {value}
    </span>
  );
}

export class CustomFormatNode extends DecoratorNode {
  static getType() {
    return "custom-format";
  }

  static clone(node) {
    return new CustomFormatNode(
      node.__customFormatKey,
      node.__value,
      node.__key
    );
  }

  constructor(customFormatKey, value, key) {
    super(key);
    this.__customFormatKey = customFormatKey;
    this.__value = value;
  }

  createDOM() {
    const span = document.createElement("span");
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <CustomFormatElement
        customFormatKey={this.__customFormatKey}
        value={this.__value}
      />
    );
  }
}

export function $createCustomFormatNode(customFormatKey, value) {
  return new CustomFormatNode(customFormatKey, value);
}

export function $isCustomFormatNode(node) {
  return node instanceof CustomFormatNode;
}
