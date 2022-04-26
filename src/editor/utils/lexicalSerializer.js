import { $createListItemNode, $createListNode, ListItemNode, ListNode } from "@lexical/list";
import { $createParagraphNode, $createTextNode, $getRoot, createEditor } from "lexical";

const markText = ({ nodeName, childNodes }) => {
  let bold = false;
  let italic = false;
  let underline = false;

  if (nodeName === "STRONG") bold = true;
  if (nodeName === "EM") italic = true;
  if (nodeName === "U") underline = true;

  childNodes?.forEach(markText);

  return { bold, italic, underline };
};

const $createTextNodeFromElement = (element) => {
  const { bold, italic, underline } = markText(element);

  let format = 0;

  if (bold) format += 1;
  if (italic) format += 2;
  if (underline) format += 8;

  const textNode = $createTextNode(element.textContent);
  textNode.setFormat(format);

  return textNode;
};

export default function HTMLToLexical(htmlString) {
  const editor = createEditor({
    nodes: [ListItemNode, ListNode],
    onError: (e) => {
      console.error("[HTML TO LEXICAL ERROR]:", e);
    },
  });

  const doc = new DOMParser().parseFromString(htmlString || "", "text/html");

  function domToLexical(DOMNode, parentNode) {
    const isText = DOMNode.nodeType === 3;
    const isElement = DOMNode.nodeType === 1;

    if (isElement) {
      const format = DOMNode.style.textAlign;

      switch (DOMNode.nodeName) {
        case "BODY":
          const root = $getRoot();
          root.setFormat();
          Array.from(DOMNode.childNodes).map((childDOMNode) => domToLexical(childDOMNode, root));
          break;

        case "STRONG":
        case "EM":
        case "U":
          const textNode = $createTextNodeFromElement(DOMNode, parentNode);
          parentNode.append(textNode);
          break;

        case "P":
          const paragraphNode = $createParagraphNode();
          paragraphNode.setFormat(format);
          Array.from(DOMNode.childNodes).map((childDOMNode) => domToLexical(childDOMNode, paragraphNode));
          parentNode.append(paragraphNode);
          break;
        case "UL":
        case "OL":
          const listNode = $createListNode(DOMNode.nodeName.toLowerCase());
          listNode.setFormat(format);
          Array.from(DOMNode.childNodes).map((childDOMNode) => domToLexical(childDOMNode, listNode));
          parentNode.append(listNode);
          break;

        case "LI":
          const listItemNode = $createListItemNode();
          listItemNode.setFormat(format);
          Array.from(DOMNode.childNodes).map((childDOMNode) => domToLexical(childDOMNode, listItemNode));
          parentNode.append(listItemNode);
          break;

        default:
          console.warn("UNHANDLED NODE - defaulting to paragraph node. High chance this breaks things.", DOMNode);
          const node = $createParagraphNode();
          node.setFormat(format);
          Array.from(DOMNode.childNodes).map((childDOMNode) => domToLexical(childDOMNode, node));
          parentNode.append(node);
      }
    } else if (isText) {
      const textNode = $createTextNodeFromElement(DOMNode, parentNode);
      parentNode.append(textNode);
    }
  }

  editor.update(() => {
    domToLexical(doc.body, null);
  });

  console.log(editor);

  return (editor._pendingEditorState || editor._editorState).toJSON();
}
