import { $getRoot } from "lexical";

export default function toPlainText(editorState) {
  const text = editorState.read(() => {
    const root = $getRoot();
    return root.getTextContent();
  });

  return text;
}
