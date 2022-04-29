import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import { useEffect, createContext, useContext, useRef, useState } from "react";

import { $createCustomFormatNode, CustomFormatNode } from "../nodes/customFormatNode";

export const INSERT_CUSTOMFORMAT_COMMAND = createCommand();
export const FORMAT_CUSTOMFORMAT_COMMAND = createCommand();

export function CustomFormatToolbarPlugin({ customFormats }) {
  const [editor] = useLexicalComposerContext();

  const [used, setUsed] = useState([]);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(() => {
      setUsed([
        ...new Set(
          Object.values(editor.getDecorators())
            .map(({ props }) => props.customFormatKey)
            .filter((c) => c),
        ),
      ]);
    });

    return unregister;
  }, [editor]);

  return (
    <>
      {customFormats.map((customFormat) => {
        if (used.includes(customFormat.key)) return null;

        return (
          <button
            key={customFormat.key}
            onClick={() =>
              editor.dispatchCommand(INSERT_CUSTOMFORMAT_COMMAND, {
                customFormatKey: customFormat.key,
              })
            }
            className="button secondary lg"
          >
            +{customFormat.value}
          </button>
        );
      })}
    </>
  );
}

const CustomFormatContext = createContext({});

export function CustomFormatContextProvider({ customFormats, children, setCustomFormat }) {
  return <CustomFormatContext.Provider value={{ customFormats, setCustomFormat }}>{children}</CustomFormatContext.Provider>;
}

export const useCustomFormats = () => {
  const stuff = useContext(CustomFormatContext);
  console.log(stuff);
  return stuff;
};

export default function CustomFormatPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CustomFormatNode])) throw new Error("Custom format plugin: CustomFormatNode not registered on editor");

    return editor.registerCommand(
      INSERT_CUSTOMFORMAT_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if ($isRootNode(selection.anchor.getNode())) {
            selection.insertParagraph();
          }
          const customFormatNode = $createCustomFormatNode(payload.customFormatKey);
          selection.insertNodes([customFormatNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  useEffect(() => {
    if (!editor.hasNodes([CustomFormatNode])) throw new Error("Custom format plugin: CustomFormatNode not registered on editor");

    return editor.registerCommand(
      FORMAT_CUSTOMFORMAT_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        editor.update(() => {
          const selectedNodes = selection.getNodes();
          const selectedCustomFormatNodes = selectedNodes.filter((node) => node.__type === "custom-format");
          if (selectedNodes.length > 1) return;
          selectedCustomFormatNodes.forEach((node) => node.setFormat(payload));
        });
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
