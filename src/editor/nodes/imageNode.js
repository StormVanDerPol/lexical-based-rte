import { DecoratorNode } from "lexical";

// https://github.com/facebook/lexical/blob/main/examples/decorators.md

export class ImageNode extends DecoratorNode {
  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__key);
  }

  constructor(src, key) {
    super(key);
    this.__src = src;
  }

  createDOM() {
    const div = document.createElement("div");
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <img alt="alts not available lol" src={this.__src} />;
  }
}

export function $createImageNode(src) {
  return new ImageNode(src);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
