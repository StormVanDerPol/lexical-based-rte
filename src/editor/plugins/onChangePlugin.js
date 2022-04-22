import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function OnChangePlugin({ handler }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregister = editor.registerUpdateListener(() => {
      handler(editor.getEditorState());
    });

    return unregister;
  }, [editor, handler]);

  return null;
}
