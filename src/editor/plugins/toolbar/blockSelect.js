import { useMemo } from "react";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $wrapLeafNodesInElements } from "@lexical/selection";
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical";

export default function BlockSelect({ editor, currentBlock }) {
  const blockTypes = useMemo(
    () => [
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
    ],
    [currentBlock, editor],
  );

  return (
    <select className="button secondary outline-none" value={currentBlock} onChange={(e) => blockTypes.find(({ type }) => type === e.target.value).create()}>
      {blockTypes.map(({ type }) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
}
