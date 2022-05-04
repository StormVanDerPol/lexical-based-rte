import * as React from "react";
import {
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  DELETE_CHARACTER_COMMAND,
  DELETE_LINE_COMMAND,
  DELETE_WORD_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  INSERT_TEXT_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  REMOVE_TEXT_COMMAND,
  DecoratorNode,
  $getNodeByKey,
} from "lexical";
import LexicalComposer from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalContentEditable from "@lexical/react/LexicalContentEditable";

import { $moveCharacter, $shouldOverrideDefaultCharacterSelection } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";

import OnChangePlugin from "./onChangePlugin";
import toPlainText from "../utils/plaintextSerializer";

function hydrateNestedCustomFormatEditor(editor, text) {
  editor.update(() => {
    const root = $getRoot();
    const paragraph = $createParagraphNode();
    const textNode = $createTextNode(text);
    root.append(paragraph.append(textNode));
  });
}

/* registers every command available in the nested editor. */
function registerNestedCustomFormatEditor(editor, text) {
  const removeListener = mergeRegister(
    /* basic text editing commands */
    editor.registerCommand(
      DELETE_CHARACTER_COMMAND,
      (isBackward) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.deleteCharacter(isBackward);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      DELETE_WORD_COMMAND,
      (isBackward) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.deleteWord(isBackward);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      DELETE_LINE_COMMAND,
      (isBackward) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.deleteLine(isBackward);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      INSERT_TEXT_COMMAND,
      (eventOrText) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        if (typeof eventOrText === "string") {
          selection.insertText(eventOrText);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      REMOVE_TEXT_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        selection.removeText();
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      KEY_ARROW_LEFT_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if ($shouldOverrideDefaultCharacterSelection(selection, true)) {
          event.preventDefault();
          $moveCharacter(selection, isHoldingShift, true);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      KEY_ARROW_RIGHT_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const event = payload;
        const isHoldingShift = event.shiftKey;
        if ($shouldOverrideDefaultCharacterSelection(selection, false)) {
          event.preventDefault();
          $moveCharacter(selection, isHoldingShift, false);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true);
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(DELETE_CHARACTER_COMMAND, false);
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    /* prevent default behaviour */
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        event.preventDefault();
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        event.preventDefault();
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      DRAGSTART_COMMAND,
      (event) => {
        event.preventDefault();
      },
      COMMAND_PRIORITY_EDITOR,
    ),
  );
  hydrateNestedCustomFormatEditor(editor, text);
  return removeListener;
}

export function NestedCustomFormatEditorPlugin({ text }) {
  const [editor] = useLexicalComposerContext();

  React.useLayoutEffect(() => {
    return registerNestedCustomFormatEditor(editor, text);
    // linter can piss off here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return <LexicalContentEditable className="inline outline-none bg-blue-100" />;
}

export const INSERT_CUSTOMFORMAT_COMMAND = createCommand();

const NESTED_CUSTOM_FORMAT_EDITOR_CONFIG = {
  onError(e) {
    console.error("[nested cfe]", e);
  },
  theme: {
    paragraph: "inline",
  },
};

function Spancer() {
  return <span className="spancer"> </span>;
}

function CustomFormatDecoratorElement({ text, nodeKey }) {
  const [editor] = useLexicalComposerContext();

  const onChangeHandler = React.useCallback(
    (value) => {
      const plaintext = toPlainText(value);

      editor.update(() => {
        const currentNode = $getNodeByKey(nodeKey);
        console.log(`SETTING TEXT OF NODE ${nodeKey}`, plaintext);
        currentNode.setText(plaintext);
      });
    },
    [nodeKey, editor],
  );

  return (
    <>
      <Spancer />
      <LexicalComposer initialConfig={NESTED_CUSTOM_FORMAT_EDITOR_CONFIG}>
        <NestedCustomFormatEditorPlugin text={text} />
        <OnChangePlugin handler={onChangeHandler} />
      </LexicalComposer>
      <Spancer />
    </>
  );
}

export class CustomFormatNode extends DecoratorNode {
  __customFormatKey = "";

  __text = "";

  static getType() {
    return "custom-format";
  }

  static clone(node) {
    return new CustomFormatNode(node.__customFormatKey, node.__text, node.__key);
  }

  constructor(customFormatKey, text, key) {
    super(key);
    this.__customFormatKey = customFormatKey;
    this.__text = text;
  }

  createDOM() {
    const dom = document.createElement("div");
    dom.classList.add("inline");
    return dom;
  }

  updateDOM() {
    return false;
  }

  setText(text) {
    const writable = this.getWritable();
    writable.__text = text;
  }

  getText() {
    return this.__text;
  }

  getCustomFormatKey() {
    return this.__customFormatKey;
  }

  decorate(editor) {
    return <CustomFormatDecoratorElement editor={editor} customFormatKey={this.__customFormatKey} text={this.__text} nodeKey={this.__key} />;
  }
}

export function $createCustomFormatNode(customFormatKey, text) {
  return new CustomFormatNode(customFormatKey, text);
}

export function $isCustomFormatNode(node) {
  return node instanceof CustomFormatNode;
}

export function getCustomFormatNodes(editor) {
  return Array.from(editor.getEditorState()._nodeMap)
    .filter(([, node]) => $isCustomFormatNode(node))
    .map(([, node]) => node);
}

/* main plugin to be used in actual CFE */
export default function CustomFormatPlugin() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    if (!editor.hasNodes([CustomFormatNode])) throw new Error("Custom format plugin: CustomFormatNode not registered on editor");

    return editor.registerCommand(
      INSERT_CUSTOMFORMAT_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if ($isRootNode(selection.anchor.getNode())) {
            selection.insertParagraph();
          }
          const customFormatNode = $createCustomFormatNode(payload.customFormatKey, payload.text);
          selection.insertNodes([customFormatNode]);
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

export function CustomFormatToolbarPlugin({ customFormats }) {
  const [editor] = useLexicalComposerContext();

  const [used, setUsed] = React.useState([]);

  React.useEffect(() => {
    return editor.registerUpdateListener(() => {
      const customFormatKeys = getCustomFormatNodes(editor).map((node) => node.__customFormatKey);
      setUsed(customFormatKeys);
    });
  }, [editor]);

  return (
    <>
      {Array.from(customFormats).map(([customFormatKey, text]) => {
        if (used.includes(customFormatKey)) return null;

        return (
          <button
            type="button"
            key={customFormatKey}
            onClick={() =>
              editor.dispatchCommand(INSERT_CUSTOMFORMAT_COMMAND, {
                customFormatKey,
                text,
              })
            }
            className="button secondary lg"
          >
            +{text}
          </button>
        );
      })}
    </>
  );
}
