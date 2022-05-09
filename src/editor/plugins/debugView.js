import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect } from "react";
import lexicalToHTML from "../utils/htmlSerializer";
import HTMLToLexical from "../utils/lexicalSerializer";

export default function DebugView({ customFormatMap }) {
  const [editor] = useLexicalComposerContext();

  const [showHTML, setShowHTML] = useState(true);
  const [showCFEMap, setShowCFEMap] = useState(true);

  const [HTML, setHTML] = useState("");

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setHTML(lexicalToHTML(editor.getEditorState()));
    });
  }, [editor]);

  return (
    <>
      <div className="my-5 p-2 rounded bg-gray-200 shadow-md border border-gray-400">
        <button type="button" className="button primary xs" onClick={() => setShowHTML((b) => !b)}>
          -
        </button>

        {showHTML && (
          <>
            <div className="text-gray-600 text-sm mt-2 mb-5">rendered HTML:</div>

            <div
              className="rendered-rich-text"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: HTML,
              }}
            />
          </>
        )}
      </div>

      <pre className="bg-blue-900 text-white p-2 text-xs rounded my-2">
        <button type="button" className="button primary xs" onClick={() => setShowCFEMap((b) => !b)}>
          -
        </button>
        {showCFEMap && (
          <>
            <div>{`cfe state:\n`}</div>
            {JSON.stringify(Array.from(customFormatMap), null, 4)}
          </>
        )}
      </pre>

      <button
        type="button"
        className="button primary xs"
        onClick={() => {
          editor.setEditorState(editor.parseEditorState(JSON.stringify(HTMLToLexical(HTML), null, 4)));
        }}
      >
        reset editor state
      </button>
    </>
  );
}
