import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  INSERT_LINE_BREAK_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $wrapLeafNodesInElements } from "@lexical/selection";
import {
  ListNode,
  $isListNode,
  REMOVE_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";

import $getSelectedNode from "../utils/$getSelectedNode";
import { INSERT_IMAGE_COMMAND } from "./imagesPlugin";

const LowPriority = 1;

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = $getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;

    if (editorElem === null) return;

    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      positionEditorElement(editorElem, rect);
      setLastSelection(selection);
    } else if (!activeElement || !activeElement["data-floating-input-editor"]) {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  const confirmEdit = useCallback(() => {
    if (lastSelection !== null) {
      if (linkUrl !== "") {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
      }
      setEditMode(false);
    }
  }, [lastSelection, linkUrl, editor]);

  return (
    <div
      ref={editorRef}
      className="bg-gray-50 shadow-md p-2 border border-gray-200 rounded fixed"
    >
      <input
        data-floating-link-editor
        ref={inputRef}
        disabled={!isEditMode}
        size={Math.max(10, linkUrl.length)}
        className="bg-gray-100 border border-transparent focus:border-blue-600 focus:bg-blue-50 p-1 rounded outline-none"
        value={linkUrl}
        onChange={(e) => {
          setLinkUrl(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            confirmEdit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            setEditMode(false);
          }
        }}
      />

      {isEditMode ? (
        <button className="button secondary ml-2" onClick={confirmEdit}>
          confirm
        </button>
      ) : (
        <button
          className="button secondary ml-2"
          onClick={() => {
            setEditMode(true);
          }}
        >
          edit
        </button>
      )}
    </div>
  );
}

function BlockSelect({ editor, currentBlock }) {
  const blockTypes = [
    {
      type: "paragraph",
      create: () => {
        if (currentBlock === "paragraph") return;

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $wrapLeafNodesInElements(selection, () => $createParagraphNode());
          }
        });
      },
    },
    {
      type: "h1",
      create: () => {
        if (currentBlock === "h1") return;

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $wrapLeafNodesInElements(selection, () => $createHeadingNode("h1"));
          }
        });
      },
    },
    {
      type: "h2",
      create: () => {
        if (currentBlock === "h2") return;

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $wrapLeafNodesInElements(selection, () => $createHeadingNode("h2"));
          }
        });
      },
    },
    {
      type: "quote",
      create: () => {
        if (currentBlock === "quote") return;

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $wrapLeafNodesInElements(selection, () => $createQuoteNode());
          }
        });
      },
    },
    {
      type: "ol",
      create: () => {
        if (currentBlock === "ol") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND);
        } else {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        }
      },
    },
    {
      type: "ul",
      create: () => {
        if (currentBlock === "ul") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND);
        } else {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        }
      },
    },
  ];

  return (
    <select
      className="button secondary outline-none"
      value={currentBlock}
      onChange={(e) =>
        blockTypes.find(({ type }) => type === e.target.value).create()
      }
    >
      {blockTypes.map(({ type }) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [currentBlock, setCurrentBlock] = useState("bullet list");
  const [selectedElementKey, setSelectedElementKey] = useState(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // ---  DETECT BLOCK NODE TYPE ---
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setCurrentBlock(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
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
  }, []);

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
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  return (
    <div className="absolute bottom-0 p-2 border-t border-gray-300 w-full">
      <BlockSelect editor={editor} currentBlock={currentBlock} />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`button ${isBold ? "primary" : "secondary"} lg font-bold`}
      >
        B
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`button ${isItalic ? "primary" : "secondary"} lg italic`}
      >
        I
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={`button ${
          isUnderline ? "primary" : "secondary"
        } lg underline`}
      >
        U
      </button>

      <button
        onClick={insertLink}
        className={`button ${isLink ? "primary" : "secondary"} lg underline`}
      >
        link
      </button>

      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}

      <button
        onClick={() => editor.dispatchCommand(INSERT_LINE_BREAK_COMMAND)}
        className="button secondary lg"
      >
        Line break
      </button>

      <button
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        className="button secondary lg"
      >
        UL
      </button>

      <button
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        className="button secondary lg"
      >
        OL
      </button>

      <button
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        className="button secondary lg"
      >
        undo
      </button>

      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        className="button secondary lg"
      >
        redo
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: "https://www.thiscatdoesnotexist.com",
          })
        }
        className="button secondary lg"
      >
        image
      </button>
    </div>
  );
}
