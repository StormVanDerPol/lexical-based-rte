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
import DataViewPlugin from "./plugins/dataView";
import ImagesPlugin from "./plugins/imagesPlugin";

import { ImageNode } from "./nodes/imageNode";
import { CustomFormatNode } from "./nodes/customFormatNode";
import CustomFormatPlugin, {
  CustomFormatContextProvider,
  CustomFormatToolbarPlugin,
} from "./plugins/customFormatPlugin";
import ToolbarContainer from "./plugins/toolbar/toolbarContainer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const editorConfig = {
  theme,
  onError(e) {
    console.error("[lexical error]", e);
    // Not throwing here allows lexical to try to handle the error gracefully without losing user data.
  },
  nodes: [
    LinkNode,
    AutoLinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    HeadingNode,
    ImageNode,
    CustomFormatNode,
  ],
};

function CustomFormatInputs({ customFormats, setCustomFormats }) {
  const setCustomFormat = useCallback((key, value) => {
    setCustomFormats((c) => {
      const copy = [...c];

      copy.find((customFormat) => key === customFormat.key).value = value;
      return copy;
    });
  }, []);

  return customFormats.map(({ key, value }) => {
    return (
      <div key={key}>
        <label className="text-xs text-gray-500 block" htmlFor={key}>
          {key}
        </label>
        <input
          className="outline-none border border-blue-500 bg-gray-50 rounded"
          id={key}
          value={value}
          onChange={(e) => setCustomFormat(key, e.target.value)}
        />
      </div>
    );
  });
}

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

  console.log();

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <CustomFormatInputs
          customFormats={customFormats}
          setCustomFormats={setCustomFormats}
        />

        <CustomFormatContextProvider value={customFormats}>
          <div className="relative bg-gray-100 rounded-md border border-transparent focus-within:bg-blue-50 focus-within:border-blue-700 transition-colors">
            <div className="p-2 mb-24">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="outline-none resize-none"
                    style={{ minHeight: "150px", tabSize: "1" }}
                  />
                }
              />
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
        <DataViewPlugin />
      </LexicalComposer>
    </>
  );
}
