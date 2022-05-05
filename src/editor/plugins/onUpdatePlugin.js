import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function OnUpdatePlugin({ handler }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      handler(editor.getEditorState(), editor);
    });
  }, [editor, handler]);

  return null;
}
