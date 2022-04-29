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
import CustomFormatPlugin, { CustomFormatContextProvider, CustomFormatToolbarPlugin } from "./plugins/customFormatPlugin";
import ToolbarContainer from "./plugins/toolbar/toolbarContainer";
import OnChangePlugin from "./plugins/onChangePlugin";
import LexicalToHTML from "./utils/htmlSerializer";

const editorConfig = {
  theme,
  onError(e) {
    console.error("[lexical error]", e);
    // Not throwing here allows lexical to try to handle the error gracefully without losing user data.
  },
  nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode, QuoteNode, HeadingNode, ImageNode, CustomFormatNode],
};

function CustomFormatInputs({ customFormats, setCustomFormat }) {
  return (
    <div className="flex flex-wrap">
      {customFormats.map(({ key, value }) => {
        return (
          <div className="mb-4 basis-1/2" key={key}>
            <label className="text-xs text-gray-500 block" htmlFor={key}>
              {key}
            </label>
            <input className="outline-none border border-blue-500 bg-gray-50 rounded" id={`focus-id-${key}`} value={value} onChange={(e) => setCustomFormat(key, e.target.value)} />
          </div>
        );
      })}
    </div>
  );
}

export default function Editor() {
  const [customFormats, setCustomFormats] = useState([
    {
      key: "%{city}",
      value: "[Plaats]",
      clickHandler: () => document.getElementById("focus-id-%{city}").focus(),
    },
    {
      key: "%{date}",
      value: "21 april 2022",
      clickHandler: () => document.getElementById("focus-id-%{date}").focus(),
    },
    {
      key: "%{applicationType}",
      value: "[Soort sollicitatie]",
      clickHandler: () => document.getElementById("focus-id-%{applicationType}").focus(),
    },
    {
      key: "%{desiredPosition}",
      value: "[Gewenste functie]",
      clickHandler: () => document.getElementById("focus-id-%{desiredPosition}").focus(),
    },
  ]);

  const setCustomFormat = useCallback((key, value) => {
    setCustomFormats((c) => {
      const copy = [...c];

      copy.find((customFormat) => key === customFormat.key).value = value;
      return copy;
    });
  }, []);

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <CustomFormatInputs customFormats={customFormats} setCustomFormat={setCustomFormat} />

        <CustomFormatContextProvider customFormats={customFormats} setCustomFormat={setCustomFormat}>
          <div className="relative bg-gray-100 rounded-md border border-transparent focus-within:bg-blue-50 focus-within:border-blue-700 transition-colors">
            <div className="p-2">
              <RichTextPlugin contentEditable={<ContentEditable className="outline-none resize-none" style={{ minHeight: "150px", tabSize: "1" }} />} />
              <CustomFormatPlugin />
            </div>
            <ToolbarContainer>
              <ToolbarPlugin />
              <CustomFormatToolbarPlugin customFormats={customFormats} />
            </ToolbarContainer>
          </div>
        </CustomFormatContextProvider>
        <LinkPlugin />
        <AutoLinkPlugin />
        <ListPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ImagesPlugin />
        <TreeViewPlugin />
        <OnChangePlugin
          handler={(editorState) => {
            // console.log(JSON.stringify(editorState.toJSON(), null, 4));
          }}
        />
        <DebugHTMLView />
      </LexicalComposer>
    </>
  );
}
