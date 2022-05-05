import { $getRoot } from "lexical";
import encodeHTMLEntities from "./encodeHTMLEntities";
import parseTextFormat from "./parseTextFormat";

// function parseElementFormat(format) {
//   switch (format) {
//     case 0:
//     case 1:
//       return "left";
//     case 2:
//       return "center";
//     case 3:
//       return "right";
//     case 4:
//       return "justify";
//     default:
//       throw new Error(`[lexical to html]: element format ${format} is not ok`);
//   }
// }

const constructText = (string, bold, italic, underline) =>
  `${underline ? "<u>" : ""}${italic ? "<em>" : ""}${bold ? "<strong>" : ""}${encodeHTMLEntities(string)}${bold ? "</strong>" : ""}${italic ? "</em>" : ""}${underline ? "</u>" : ""}`;

function serializeNode(node) {
  const type = node.getType();

  switch (type) {
    case "root":
      return node.getChildren().map(serializeNode).join("");
    // element
    case "paragraph":
      return `<p>${node.getChildren().map(serializeNode).join("") || "\u200B"}</p>`;
    case "listitem":
      return `<li>${node.getChildren().map(serializeNode).join("")}</li>`;
    case "list": {
      const listTag = node.getTag();
      return `<${listTag}>${node.getChildren().map(serializeNode).join("")}</${listTag}>`;
    }
    case "link": {
      const url = node.getUrl();
      return `<a href="${encodeHTMLEntities(url)}">${node.getChildren().map(serializeNode).join("")}</a>`;
    }
    // linebreak
    case "linebreak":
      return "<br>";
    // decorator nodes
    case "image": {
      const src = node.getSrc();
      return `<img src="${src}" >`;
    }
    case "custom-format": {
      const customFormatKey = node.getCustomFormatKey();
      const text = node.getText();
      const { bold, italic, underline } = {}; // wip
      return `<span data-type="custom-format" data-text="${encodeHTMLEntities(text)}" data-bold="${!!bold}" data-italic="${!!italic}" data-underline="${!!underline}">${customFormatKey}</span>`;
    }
    // text
    case "text": {
      const { bold, italic, underline } = parseTextFormat(node.getFormat());
      return constructText(node.getTextContent(), bold, italic, underline);
    }
    // unknown
    default:
      console.warn(`[lexical to html]: no serialization conditions were met for node ${node.getKey()}`);
      return "";
  }
}

export default function lexicalToHTML(editorState) {
  const html = editorState.read(() => {
    const root = $getRoot();

    return serializeNode(root);
  });

  return html;
}
