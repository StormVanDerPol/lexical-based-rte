import { $isAtNodeEnd } from "@lexical/selection";

// https://codesandbox.io/s/lexical-rich-text-example-5tncvy?file=/src/plugins/ToolbarPlugin.js:6035-6073

export default function $getSelectedNode(selection) {
  const { anchor } = selection;
  const { focus } = selection;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) return $isAtNodeEnd(focus) ? anchorNode : focusNode;

  return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
}
