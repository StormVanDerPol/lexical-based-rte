import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalTreeView from "@lexical/react/LexicalTreeView";
import { useState } from "react";

export default function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-md mt-4">
      <div className="p-2 bg-gray-200">
        <button type="button" className="button primary xs" onClick={() => setIsOpen((b) => !b)}>
          -
        </button>
      </div>

      <LexicalTreeView
        viewClassName={`bg-gray-900 text-white text-xs ${isOpen ? "h-0" : "p-4"}`}
        timeTravelPanelClassName="flex justify-between mt-2"
        timeTravelButtonClassName="button primary sm mb-2 block ml-auto"
        timeTravelPanelSliderClassName="flex-1 mx-2 block"
        timeTravelPanelButtonClassName="button primary sm"
        editor={editor}
      />
    </div>
  );
}
