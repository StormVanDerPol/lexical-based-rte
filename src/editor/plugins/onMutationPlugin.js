import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function OnMutationPlugin({ handler, klass }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerMutationListener(klass, () => {
      handler(editor.getEditorState(), editor);
    });
  }, [editor, handler, klass]);

  return null;
}
