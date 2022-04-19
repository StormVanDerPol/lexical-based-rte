import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="absolute bottom-0 p-2">
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="button secondary lg font-bold"
      >
        B
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="button secondary lg italic"
      >
        I
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="button secondary lg underline"
      >
        U
      </button>
    </div>
  );
}
