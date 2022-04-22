import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect } from "react";
import LexicalToHTML from "../utils/htmlSerializer";

export default function DebugHTMLView() {
  const [editor] = useLexicalComposerContext();

  const [HTML, setHTML] = useState("");

  useEffect(() => {
    const unregister = editor.registerUpdateListener(() => {
      setHTML(LexicalToHTML(editor.getEditorState()._nodeMap));
    });

    return unregister;
  }, [editor]);

  return (
    <div className="my-5 p-2 rounded bg-gray-200 shadow-md border border-gray-400">
      <div className="text-gray-600 text-sm mb-5">rendered HTML:</div>

      <style></style>

      <div
        className="rendered-rich-text"
        dangerouslySetInnerHTML={{
          __html: HTML,
        }}
      />
    </div>
  );
}
