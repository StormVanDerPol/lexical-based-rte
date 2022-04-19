import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalTreeView from "@lexical/react/LexicalTreeView";

export default function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();
  return (
    <LexicalTreeView
      viewClassName="bg-gray-900 text-white p-4 mt-4 rounded-md text-xs"
      timeTravelPanelClassName="flex justify-between mt-2"
      timeTravelButtonClassName="button primary block ml-auto"
      timeTravelPanelSliderClassName="flex-1 mx-2 block"
      timeTravelPanelButtonClassName="button primary"
      editor={editor}
    />
  );
}
