import { useState } from "react";

import LexicalComposer from "@lexical/react/LexicalComposer";
import ContentEditable from "@lexical/react/LexicalContentEditable";

import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";
import ListPlugin from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import AutoFocusPlugin from "@lexical/react/LexicalAutoFocusPlugin";

import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import theme from "./theme";

import TreeViewPlugin from "./plugins/treeView";
import ToolbarPlugin from "./plugins/toolbar";
import AutoLinkPlugin from "./plugins/autoLink";
import DebugView from "./plugins/debugView";
import ImagesPlugin from "./plugins/imagesPlugin";

import { ImageNode } from "./nodes/imageNode";
import CustomFormatPlugin, { CustomFormatNode, CustomFormatToolbarPlugin, getCustomFormatNodes } from "./plugins/customFormatPlugin";
import ToolbarContainer from "./plugins/toolbar/toolbarContainer";
import OnUpdatePlugin from "./plugins/onUpdatePlugin";

const editorConfig = {
  theme,
  onError(e) {
    console.error("[lexical error]", e);
    // Not throwing here allows lexical to try to handle the error gracefully without losing user data.
  },
  nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode, QuoteNode, HeadingNode, ImageNode, CustomFormatNode],
};

export default function Editor() {
  const [customFormatMap, setCustomFormatMap] = useState(
    new Map([
      ["%{city}", "[Plaats]"],
      ["%{date}", "21 april 2022"],
      ["%{applicationType}", "[Soort sollicitatie]"],
      ["%{desiredPosition}", "[Gewenste functie]"],
    ]),
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative bg-gray-100 rounded-md border border-transparent focus-within:bg-blue-50 focus-within:border-blue-700 transition-colors">
        <div className="p-2">
          <RichTextPlugin contentEditable={<ContentEditable className="outline-none resize-none" style={{ minHeight: "150px", tabSize: "1" }} />} />
          <CustomFormatPlugin />
        </div>
        <ToolbarContainer>
          <ToolbarPlugin />
          <CustomFormatToolbarPlugin customFormats={customFormatMap} />
        </ToolbarContainer>
      </div>
      <LinkPlugin />
      <AutoLinkPlugin />
      <ListPlugin />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ImagesPlugin />
      <TreeViewPlugin />
      <OnUpdatePlugin
        handler={(editorState, editor) => {
          const editorCustomFormatMap = new Map(getCustomFormatNodes(editor).map((node) => [node.getCustomFormatKey(), node.getText()]));
          const newCustomFormatMap = new Map(Array.from(customFormatMap));

          // update custom fromats
          editorCustomFormatMap.forEach((value, key) => {
            const currentValue = newCustomFormatMap.get(key);
            const shouldUpdate = currentValue !== value;

            if (shouldUpdate) newCustomFormatMap.set(key, value);
          });

          const hasChanges = (() => {
            let test;
            if (customFormatMap.size !== newCustomFormatMap.size) {
              return true;
            }
            for (const [key, value] of customFormatMap) {
              test = newCustomFormatMap.get(key);
              if (test !== value || (test === undefined && !newCustomFormatMap.has(key))) {
                return true;
              }
            }
            return false;
          })();

          if (hasChanges) {
            console.log("CUSTOM FORMAT CHANGE DETECTED");
            setCustomFormatMap(newCustomFormatMap);
          }
        }}
      />

      <DebugView customFormatMap={customFormatMap} />
    </LexicalComposer>
  );
}
