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
      throw new Error(`[lexical to html]: element format ${format} is an invalid format integer`);
  }
}

const constructText = (string, bold, italic, underline) =>
  `${underline ? "<u>" : ""}${italic ? "<em>" : ""}${bold ? "<strong>" : ""}${/* encode html entities here*/ string}${bold ? "</strong>" : ""}${italic ? "</em>" : ""}${underline ? "</u>" : ""}`;

export default function lexicalToHTML(nodeMap) {
  const root = nodeMap.get("root");

  function serialize(node) {
    const type = node.__type;

    // text node
    if (type === "text") {
      const text = node.__text;
      const format = node.__format;

      const { bold, italic, underline } = parseTextFormat(format);

      return constructText(text, bold, italic, underline);
    }

    const children = node?.__children;

    // element node
    if (Array.isArray(children)) {
      const serializedChildren = children.map((n) => serialize(nodeMap.get(n))).join("") || "";
      const styleObject = {};

      const format = node?.__format;

      if (format) styleObject["text-align"] = parseElementFormat(format);

      const style = Object.entries(styleObject)
        .map(([key, value]) => `${key}: ${value}`)
        .join(";");

      switch (type) {
        case "paragraph":
          return `<p style="${style}">${serializedChildren || "\u200B"}</p>`;
        case "listitem":
          return `<li style="${style}">${serializedChildren}</li>`;
        case "list": {
          const tag = node.__tag;

          if (tag === "ul") return `<ul style="${style}">${serializedChildren}</ul>`;
          if (tag === "ol") return `<ol style="${style}">${serializedChildren}</ol>`;

          throw new Error(`[lexical to html]: list node  has wrong tag (${tag})`);
        }

        case "link": {
          const url = node.__url;
          return `<a style="${style}" href="${url}">${serializedChildren}</a>`;
        }

        default:
          return serializedChildren;
      }
    }

    // decorator node
    switch (type) {
      case "image": {
        const src = node.__src;
        return `<img src="${src}" >`;
      }
      case "custom-format": {
        const customFormatKey = node.getCustomFormatKey();
        const { bold, italic, underline } = node.getFormats();

        return `<span data-type="custom-format" data-bold="${!!bold}" data-italic="${!!italic}" data-underline="${!!underline}">${customFormatKey}</span>`;
      }
    }

    if (type === "linebreak") return "<br>";

    console.warn(`[lexical to html]: no serialization conditions were met for node ${node.__key}`);
    return "";
  }

  return serialize(root);
}
