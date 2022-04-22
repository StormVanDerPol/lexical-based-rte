export default function HTMLToLexical(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString || "", "text/html");

  function domToLexical(element) {
    const isTextNode = el.nodeType === 3;
    const isElementNode = el.nodeType === 1;
  }
}
