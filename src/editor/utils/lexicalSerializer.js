export default function HTMLToLexical(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString || "", "text/html");

  const nodeMap = [];
  let keyCounter = 0;

  function domToLexical(element, key, parent) {
    const isTextNode = element.nodeType === 3;
    const isElementNode = element.nodeType === 1;

    if (isElementNode) {
      const childKeys = Array.from(element.childNodes).map((childNode) => domToLexical(childNode, keyCounter++, key));

      switch (element.nodeName) {
        case "BODY": {
          const rootNode = {};
          rootNode.__children = childKeys;
          rootNode.__dir = "ltr";
          rootNode.__format = 0;
          rootNode.__indent = 0;
          rootNode.__key = key;
          rootNode.__parent = null;
          rootNode.__type = "root";

          nodeMap.push([key, rootNode]);
          break;
        }

        default: {
          const node = {};

          node.__children = childKeys;
          node.__dir = "ltr";
          node.__format = 0;
          node.__indent = 0;
          node.__key = key;
          node.__parent = parent;
          node.__type = "paragraph";

          nodeMap.push([key, node]);
        }
      }
    } else if (isTextNode) {
      const textNode = {};

      textNode.__detail = 0;
      // todo: parse format
      textNode.__format = 0;
      textNode.__key = key;
      textNode.__mode = 0;
      textNode.__parent = parent;
      textNode.__style = "";
      textNode.__text = element.textContent;
      textNode.__type = "text";

      nodeMap.push([key, textNode]);
    }

    return key;
  }

  domToLexical(doc.body, "root", null);

  return { _nodeMap: nodeMap, _selection: null };
}
