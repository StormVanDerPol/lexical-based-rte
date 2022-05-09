import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INSERT_LINE_BREAK_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isHeadingNode } from "@lexical/rich-text";
import { ListNode, $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";

import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";

import $getSelectedNode from "../../utils/$getSelectedNode";
import { INSERT_IMAGE_COMMAND } from "../imagesPlugin";
import UrlIcon from "../../icons/url";
import ImageIcon from "../../icons/image";
import { FORMAT_CUSTOMFORMAT_COMMAND } from "../customFormatPlugin";
import FloatingLinkEditor from "./floatingLinkEditor";
import BlockSelect from "./blockSelect";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [currentBlock, setCurrentBlock] = useState("bullet list");
  // const [selectedElementKey, setSelectedElementKey] = useState(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // ---  DETECT BLOCK NODE TYPE ---
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        // setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setCurrentBlock(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          setCurrentBlock(type);
        }
      }
      // --- --- ---

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const node = $getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbar]);

  return (
    <>
      <BlockSelect editor={editor} currentBlock={currentBlock} />

      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          editor.dispatchCommand(FORMAT_CUSTOMFORMAT_COMMAND, "bold");
        }}
        className={`button ${isBold ? "primary" : "secondary"} lg font-bold`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          editor.dispatchCommand(FORMAT_CUSTOMFORMAT_COMMAND, "italic");
        }}
        className={`button ${isItalic ? "primary" : "secondary"} lg italic`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          editor.dispatchCommand(FORMAT_CUSTOMFORMAT_COMMAND, "underline");
        }}
        className={`button ${isUnderline ? "primary" : "secondary"} lg underline`}
      >
        U
      </button>

      <button type="button" onClick={insertLink} className={`button ${isLink ? "primary" : "secondary"} lg underline`}>
        <UrlIcon />
      </button>

      {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}

      <button type="button" onClick={() => editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND)} className="button secondary lg">
        Line break
      </button>

      <button type="button" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)} className="button secondary lg">
        UL
      </button>

      <button type="button" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)} className="button secondary lg">
        OL
      </button>

      <button type="button" disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND)} className="button secondary lg">
        undo
      </button>

      <button type="button" disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND)} className="button secondary lg">
        redo
      </button>

      <button type="button" className="button secondary lg" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}>
        align left
      </button>
      <button type="button" className="button secondary lg" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}>
        align right
      </button>
      <button type="button" className="button secondary lg" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}>
        justify
      </button>
      <button type="button" className="button secondary lg" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}>
        center
      </button>

      <button
        type="button"
        onClick={() =>
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: "https://www.thiscatdoesnotexist.com",
          })
        }
        className="button secondary lg"
      >
        <ImageIcon />
      </button>
    </>
  );
}
