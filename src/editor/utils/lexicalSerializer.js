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
  const editor = createEditor();

  const doc = new DOMParser().parseFromString(htmlString || "", "text/html");

  function domToLexical(DOMNode, parentNode) {
    const isText = DOMNode.nodeType === 3;
    const isElement = DOMNode.nodeType === 1;

    if (isElement) {
      switch (DOMNode.nodeName) {
        case "BODY":
          console.log("GETTING ROOT NODE");
          const root = $getRoot();
          Array.from(DOMNode.childNodes).map((childDOMNode) => domToLexical(childDOMNode, root));
          break;

        case "STRONG":
        case "EM":
        case "U":
          const textNode = $createTextNodeFromElement(DOMNode, parentNode);

          console.log("ADDING -> TO", textNode, parentNode);
          parentNode.append(textNode);
          break;

        case "P":
          console.log("ADDING PARAGRAPH NODE");
          const paragraphNode = $createParagraphNode();
          Array.from(DOMNode.childNodes).map((childDOMNode) => domToLexical(childDOMNode, paragraphNode));

          console.log("ADDING -> TO", paragraphNode, parentNode);
          parentNode.append(paragraphNode);

          break;
      }
    } else if (isText) {
      const textNode = $createTextNodeFromElement(DOMNode, parentNode);

      console.log("ADDING -> TO", textNode, parentNode);
      parentNode.append(textNode);
    }
  }

  editor.update(() => {
    domToLexical(doc.body, null);
  });

  return editor._pendingEditorState.toJSON();
}
