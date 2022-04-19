import LexicalComposer from "@lexical/react/LexicalComposer";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "@lexical/react/LexicalContentEditable";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";

import theme from "./theme";

import TreeViewPlugin from "./plugins/treeView";
import ToolbarPlugin from "./plugins/toolbar";
import AutoLinkPlugin from "./plugins/autoLink";

const editorConfig = {
  theme,
  onError(e) {
    console.error("[lexical error]", e);
    // Not throwing here allows lexical to try to handle the error gracefully without losing user data.
  },
  nodes: [LinkNode, AutoLinkNode],
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative bg-gray-100 rounded-md border border-transparent focus-within:bg-blue-50 focus-within:border-blue-700 transition-colors">
        <div className="p-2 mb-12">
          <RichTextPlugin
            contentEditable={<ContentEditable className="outline-none" />}
          />
          <LinkPlugin />
          <AutoLinkPlugin />
        </div>
        <ToolbarPlugin />
      </div>
      <TreeViewPlugin />
    </LexicalComposer>
  );
}
