export default function parseTextFormat(format) {
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
      console.warn(`[parse text format]: text format ${format} is an invalid format integer`);
  }
}
