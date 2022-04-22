function parseFormat(format) {
  const formats = {
    bold: false,
    italic: false,
    underline: false,
  };

  switch (format) {
    case 0:
      return formats;
    case 1:
      formats.bold = true;
      return formats;
    case 2:
      formats.italic = true;
      return formats;

    case 3: {
      formats.bold = true;
      formats.italic = true;
      return formats;
    }
    case 8:
      formats.underline = true;
      return formats;

    case 9: {
      formats.bold = true;
      formats.underline = true;
      return formats;
    }

    case 10: {
      formats.italic = true;
      formats.underline = true;
      return formats;
    }

    case 11: {
      formats.italic = true;
      formats.bold = true;
      formats.underline = true;
      return formats;
    }
    default:
      throw new Error(`[lexical to html]: ${format} is an invalid format integer`);
  }
}

const constructText = (string, bold, italic, underline) =>
  `${underline ? "<u>" : ""}${italic ? "<em>" : ""}${bold ? "<strong>" : ""}${/* encode html entities here*/ string}${bold ? "</strong>" : ""}${italic ? "</em>" : ""}${underline ? "</u>" : ""}`;

export default function LexicalToHTML(nodeMap) {
  const root = nodeMap.get("root");

  console.log(nodeMap);

  function serialize(node) {
    const type = node.__type;

    // text node
    if (type === "text") {
      const text = node.__text;
      const format = node.__format;

      const { bold, italic, underline } = parseFormat(format);

      return constructText(text, bold, italic, underline);
    }

    const children = node?.__children;

    // element node
    if (Array.isArray(children)) {
      const serializedChildren = children.map((n) => serialize(nodeMap.get(n))).join("") || "";

      switch (type) {
        case "paragraph":
          return `<p>${serializedChildren || "\u200B"}</p>`;
        case "listitem":
          return `<li>${serializedChildren}</li>`;
        case "list": {
          const tag = node.__tag;

          if (tag === "ul") return `<ul>${serializedChildren}</ul>`;
          if (tag === "ol") return `<ol>${serializedChildren}</ol>`;

          throw new Error(`[lexical to html]: list node  has wrong tag (${tag})`);
        }

        case "link": {
          const url = node.__url;
          return `<a href="${url}">${serializedChildren}</a>`;
        }

        default:
          return serializedChildren;
      }
    }

    // decorator node
    switch (type) {
      case "custom-format": {
        const customFormatKey = node.__customFormatKey;
        return `<span data-type="custom-format">${customFormatKey}</span>`;
      }
    }

    if (type === "linebreak") return "<br>";

    console.warn(`[lexical to html]: no serialization conditions were met for node ${node.__key}`);
    return "";
  }

  return serialize(root);
}
