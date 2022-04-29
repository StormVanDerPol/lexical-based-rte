import { useState, useCallback, useEffect } from "react";

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
import DebugHTMLView from "./plugins/debugHTMLView";
import ImagesPlugin from "./plugins/imagesPlugin";

import { ImageNode } from "./nodes/imageNode";
import { CustomFormatNode } from "./nodes/customFormatNode";
import CustomFormatPlugin, { CustomFormatToolbarPlugin } from "./plugins/customFormatPlugin";
import ToolbarContainer from "./plugins/toolbar/toolbarContainer";
import OnChangePlugin from "./plugins/onChangePlugin";
import LexicalToHTML from "./utils/htmlSerializer";

import HashtagPlugin from "@lexical/react/LexicalHashtagPlugin";
import { HashtagNode } from "@lexical/hashtag";

const editorConfig = {
  theme,
  onError(e) {
    console.error("[lexical error]", e);
    // Not throwing here allows lexical to try to handle the error gracefully without losing user data.
  },
  nodes: [LinkNode, HashtagNode, AutoLinkNode, ListNode, ListItemNode, QuoteNode, HeadingNode, ImageNode, CustomFormatNode],
};

export default function Editor() {
  const [customFormats, setCustomFormats] = useState([
    {
      key: "%{city}",
      value: "[Plaats]",
    },
    {
      key: "%{date}",
      value: "21 april 2022",
    },
    {
      key: "%{applicationType}",
      value: "[Soort sollicitatie]",
    },
    {
      key: "%{desiredPosition}",
      value: "[Gewenste functie]",
    },
  ]);

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        {JSON.stringify(customFormats)}
        <div className="relative bg-gray-100 rounded-md border border-transparent focus-within:bg-blue-50 focus-within:border-blue-700 transition-colors">
          <div className="p-2">
            <RichTextPlugin contentEditable={<ContentEditable className="outline-none resize-none" style={{ minHeight: "150px", tabSize: "1" }} />} />
            <CustomFormatPlugin customFormats={customFormats} setCustomFormats={setCustomFormats} />
          </div>
          <ToolbarContainer>
            <ToolbarPlugin />
            <CustomFormatToolbarPlugin customFormats={customFormats} />
          </ToolbarContainer>
        </div>

        <LinkPlugin />
        <AutoLinkPlugin />
        <ListPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ImagesPlugin />
        <TreeViewPlugin />
        <HashtagPlugin />
        {/* <OnChangePlugin
          handler={(editorState) => {
            // console.log(JSON.stringify(editorState.toJSON(), null, 4));
          }}
        /> */}
        {/* <DebugHTMLView /> */}
      </LexicalComposer>
    </>
  );
}
