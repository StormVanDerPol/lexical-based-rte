export default function toPlainText(editorState) {
  const nodeMap = editorState._nodeMap;

  const root = nodeMap.get("root");

  function serialize(node) {
    const type = node.__type;

    if (type === "text") return node.__text;

    const children = node?.__children;

    if (Array.isArray(children)) return children.map((n) => serialize(nodeMap.get(n))).join("") || "";

    console.warn(`[lexical to plaintext]: no serialization conditions were met for node ${node.__key}`);
    return "";
  }

  const plainText = serialize(root);

  return plainText;
}
