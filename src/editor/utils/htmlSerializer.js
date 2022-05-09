import { $getRoot } from "lexical";
import encodeHTMLEntities from "./encodeHTMLEntities";
import parseTextFormat from "./parseTextFormat";

function parseElementFormat(format) {
  switch (format) {
    case 0:
    case 1:
      return "left";
    case 2:
      return "center";
    case 3:
      return "right";
    case 4:
      return "justify";
    default:
      throw new Error(`[lexical to html]: element format ${format} is not ok`);
  }
}

function renderStyle(styleObject) {
  const styleContent = Object.entries(styleObject)
    .map(([key, value]) => `${key}:${value}`)
    .join("; ");

  return `style="${styleContent}"`;
}

const constructText = (string, bold, italic, underline) =>
  `${underline ? "<u>" : ""}${italic ? "<em>" : ""}${bold ? "<strong>" : ""}${encodeHTMLEntities(string)}${bold ? "</strong>" : ""}${italic ? "</em>" : ""}${underline ? "</u>" : ""}`;

function serializeNode(node) {
  const type = node.getType();

  // console.log(node);
  const styleObject = {};

  let textAlign = null;

  if (node.__format) {
    textAlign = parseElementFormat(node.__format);
    styleObject["text-align"] = textAlign;
  }

  const style = renderStyle(styleObject);

  switch (type) {
    case "root":
      return node.getChildren().map(serializeNode).join("");
    // element
    case "paragraph":
      return `<p ${style}>${node.getChildren().map(serializeNode).join("") || "\u200B"}</p>`;
    case "listitem":
      return `<li ${style}>${node.getChildren().map(serializeNode).join("")}</li>`;
    case "list":
    case "heading": {
      const tagName = node.getTag();
      return `<${tagName} ${style}>${node.getChildren().map(serializeNode).join("")}</${tagName}>`;
    }
    case "quote":
      return `<blockquote ${style}>${node.getChildren().map(serializeNode).join("")}</blockquote>`;
    case "link":
    case "autolink": {
      const url = node.getURL();
      return `<a ${style} href="${encodeHTMLEntities(url)}">${node.getChildren().map(serializeNode).join("")}</a>`;
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
      const { bold, italic, underline } = node.getFormats(); // wip
      return `<span data-type="custom-format" data-text="${encodeHTMLEntities(text)}" data-bold="${!!bold}" data-italic="${!!italic}" data-underline="${!!underline}">${customFormatKey}</span>`;
    }
    // text
    case "text": {
      const { bold, italic, underline } = parseTextFormat(node.getFormat());
      return constructText(node.getTextContent(), bold, italic, underline);
    }
    // unknown
    default:
      console.warn(`[lexical to html]: no serialization conditions were met for node ${node.getKey()}`, node);
      return "";
  }
}

export default function lexicalToHTML(editorState) {
  return editorState.read(() => serializeNode($getRoot()));
}
