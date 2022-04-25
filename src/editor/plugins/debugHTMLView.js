import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect, useMemo } from "react";
import lexicalToHTML from "../utils/htmlSerializer";
import HTMLToLexical from "../utils/lexicalSerializer";

export default function DebugHTMLView() {
  const [editor] = useLexicalComposerContext();

  const [HTML, setHTML] = useState("");

  useEffect(() => {
    const unregister = editor.registerUpdateListener(() => {
      setHTML(lexicalToHTML(editor.getEditorState()._nodeMap));
    });

    return unregister;
  }, [editor]);

  const editorStateStringFromHTML = useMemo(() => JSON.stringify(HTMLToLexical(HTML), null, 4), [HTML]);

  const [isValid, message] = useMemo(() => {
    try {
      editor.parseEditorState(editorStateStringFromHTML);

      return [true, "VALID"];
    } catch (error) {
      console.error(error);
      return [false, `INVALID: ${error.message}`];
    }
  }, [editorStateStringFromHTML]);
  return (
    <>
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

      <div className={`${isValid ? "bg-green-500" : "bg-red-500"} p-2 text-white text-xs`}>{message}</div>
      <pre className="rounded p-2 bg-black text-white text-xs">{editorStateStringFromHTML}</pre>
    </>
  );
}
