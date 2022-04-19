import LexicalComposer from "@lexical/react/LexicalComposer";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "@lexical/react/LexicalContentEditable";
import TreeViewPlugin from "./plugins/treeView";
import ToolbarPlugin from "./plugins/toolbar";
import theme from "./theme";

const editorConfig = {
  theme,
  onError(e) {
    console.error("[lexical error]", e);
    // Not throwing here allows lexical to try to handle the error gracefully without losing user data.
  },
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      {/* editor-inner class is responsible for styling RTE contents */}
      <div className="editor-inner relative bg-gray-100 rounded-md border border-transparent  focus-within:bg-blue-50 focus-within:border-blue-700 transition-colors">
        <div className="p-2 mb-12">
          <RichTextPlugin contentEditable={<ContentEditable />} />
        </div>
        <ToolbarPlugin />
      </div>
      <TreeViewPlugin />
    </LexicalComposer>
  );
}
