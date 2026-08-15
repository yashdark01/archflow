import type {
  EraserColorMode,
  EraserElementProperties,
  EraserStyleMode,
  EraserTypeface,
} from "@/lib/canvas/schema";

export function stripComments(source: string): string {
  return source
    .split("\n")
    .map((line) => {
      let result = "";
      let inQuote = false;
      for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch === '"') {
          inQuote = !inQuote;
          result += ch;
          continue;
        }
        if (!inQuote && ch === "/" && line[i + 1] === "/") {
          break;
        }
        result += ch;
      }
      return result;
    })
    .join("\n");
}

export function skipWhitespace(src: string, pos: number): number {
  while (pos < src.length) {
    if (src[pos] === " " || src[pos] === "\t" || src[pos] === "\r") {
      pos += 1;
      continue;
    }
    if (src[pos] === "\n") {
      pos += 1;
      continue;
    }
    if (src.startsWith("//", pos)) {
      const end = src.indexOf("\n", pos);
      pos = end === -1 ? src.length : end + 1;
      continue;
    }
    break;
  }
  return pos;
}

export function parseQuotedValue(src: string, pos: number): { value: string; pos: number } {
  if (src[pos] !== '"') throw new Error("Expected quoted value");
  pos += 1;
  let value = "";
  while (pos < src.length && src[pos] !== '"') {
    value += src[pos];
    pos += 1;
  }
  pos += 1;
  return { value, pos };
}

export function parseName(src: string, pos: number): { name: string; pos: number } {
  pos = skipWhitespace(src, pos);
  if (pos >= src.length) return { name: "", pos };
  if (src[pos] === '"') {
    const quoted = parseQuotedValue(src, pos);
    return { name: quoted.value, pos: quoted.pos };
  }

  let name = "";
  while (pos < src.length) {
    const ch = src[pos];
    if (ch === "[" || ch === "{" || ch === "\n" || ch === "\r") break;
    name += ch;
    pos += 1;
  }
  return { name: name.trim(), pos };
}

function parsePropertyValue(src: string, pos: number): { value: string; pos: number } {
  pos = skipWhitespace(src, pos);
  if (src[pos] === '"') return parseQuotedValue(src, pos);

  let value = "";
  while (pos < src.length && src[pos] !== "," && src[pos] !== "]") {
    value += src[pos];
    pos += 1;
  }
  return { value: value.trim(), pos };
}

export function parsePropertiesBlock(
  src: string,
  pos: number,
): { props: EraserElementProperties; pos: number } {
  pos = skipWhitespace(src, pos);
  const props: EraserElementProperties = {};
  if (pos >= src.length || src[pos] !== "[") return { props, pos };

  pos += 1;
  while (pos < src.length && src[pos] !== "]") {
    pos = skipWhitespace(src, pos);
    let key = "";
    while (pos < src.length && src[pos] !== ":" && src[pos] !== "]") {
      key += src[pos];
      pos += 1;
    }
    key = key.trim();
    if (!key || src[pos] !== ":") break;
    pos += 1;

    const { value, pos: valuePos } = parsePropertyValue(src, pos);
    pos = valuePos;

    switch (key) {
      case "icon":
        props.icon = value;
        break;
      case "color":
        props.color = value;
        break;
      case "label":
        props.label = value;
        break;
      case "link":
        props.link = value;
        break;
      case "colorMode":
        props.colorMode = value as EraserColorMode;
        break;
      case "styleMode":
        props.styleMode = value as EraserStyleMode;
        break;
      case "typeface":
        props.typeface = value as EraserTypeface;
        break;
      default:
        break;
    }

    pos = skipWhitespace(src, pos);
    if (src[pos] === ",") pos += 1;
  }

  if (src[pos] === "]") pos += 1;
  return { props, pos };
}

/** Parse generic `[key: value, ...]` for legend items. */
export function parseGenericProperties(
  src: string,
  pos: number,
): { props: Record<string, string>; pos: number } {
  pos = skipWhitespace(src, pos);
  const props: Record<string, string> = {};
  if (pos >= src.length || src[pos] !== "[") return { props, pos };

  pos += 1;
  while (pos < src.length && src[pos] !== "]") {
    pos = skipWhitespace(src, pos);
    let key = "";
    while (pos < src.length && src[pos] !== ":" && src[pos] !== "]") {
      key += src[pos];
      pos += 1;
    }
    key = key.trim();
    if (!key || src[pos] !== ":") break;
    pos += 1;
    const { value, pos: valuePos } = parsePropertyValue(src, pos);
    props[key] = value;
    pos = valuePos;
    pos = skipWhitespace(src, pos);
    if (src[pos] === ",") pos += 1;
  }

  if (src[pos] === "]") pos += 1;
  return { props, pos };
}

export function isConnectionLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("legend")) return false;
  const skip = ["direction", "colorMode", "styleMode", "typeface"];
  if (skip.some((prefix) => trimmed.startsWith(prefix))) return false;
  return (
    trimmed.includes(">") ||
    trimmed.includes("<") ||
    /-->/g.test(trimmed) ||
    /[^\s]\s--\s[^\s]/.test(trimmed) ||
    /[^\s]\s-\s[^\s]/.test(trimmed)
  );
}
