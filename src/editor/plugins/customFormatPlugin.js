import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isRootNode, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import { useEffect, useState, useCallback } from "react";

import useLexicalTextEntity from "@lexical/react/useLexicalTextEntity";

import { $createCustomFormatNode, $isCustomFormatNode, CustomFormatNode } from "../nodes/customFormatNode";

export const INSERT_CUSTOMFORMAT_COMMAND = createCommand();

export function CustomFormatToolbarPlugin({ customFormats }) {
  const [editor] = useLexicalComposerContext();
  const [used, setUsed] = useState([]);

  useEffect(() => {
    editor.registerUpdateListener(() => {
      const keys = Array.from(editor.getEditorState()._nodeMap)
        .filter(([, node]) => $isCustomFormatNode(node))
        .map(([, node]) => node.__customFormatKey);

      // dequal check here maybe
      setUsed(keys);
    });
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
                initialText: customFormat.value,
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

export default function CustomFormatPlugin({ customFormats, setCustomFormats }) {
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

          console.log("wtf");

          const customFormatNode = $createCustomFormatNode(payload);
          selection.insertNodes([customFormatNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  useEffect(() => {
    editor.registerUpdateListener(() => {
      const newCustomFormats = Array.from(editor.getEditorState()._nodeMap)
        .filter(([, node]) => $isCustomFormatNode(node))
        .map(([, node]) => {
          return { key: node.__customFormatKey, value: node.__text };
        });

      console.log("new", newCustomFormats);

      setCustomFormats((_customFormats) => {
        const unique = [..._customFormats.filter(({ key }) => !newCustomFormats.some(({ key: _key }) => key === _key)), ...newCustomFormats];

        return unique;
      });
    });
  }, [editor]);

  return null;
}
