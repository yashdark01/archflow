import type { EraserConnector, EraserConnection } from "@/lib/canvas/schema";

function splitNames(part: string): string[] {
  return part
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

interface ConnectorMatch {
  connector: EraserConnector;
  left: string;
  right: string;
}

function matchConnector(core: string): ConnectorMatch | null {
  const patterns: { connector: EraserConnector; token: string }[] = [
    { connector: "-->", token: "-->" },
    { connector: "<>", token: "<>" },
    { connector: "--", token: "--" },
    { connector: ">", token: ">" },
    { connector: "<", token: "<" },
    { connector: "-", token: "-" },
  ];

  for (const { connector, token } of patterns) {
    const idx = core.indexOf(token);
    if (idx === -1) continue;

    if (token === "-") {
      const before = core[idx - 1];
      const after = core[idx + 1];
      if (before === "-" || after === "-") continue;
    }

    if (token === ">") {
      const before = core[idx - 1];
      if (before === "-") continue;
    }

    const left = core.slice(0, idx).trim();
    const right = core.slice(idx + token.length).trim();
    if (!left || !right) continue;

    return { connector, left, right };
  }

  return null;
}

function expandConnection(
  sources: string[],
  targets: string[],
  connector: EraserConnector,
  label?: string,
  color?: string,
): EraserConnection[] {
  const connections: EraserConnection[] = [];
  for (const source of sources) {
    for (const target of targets) {
      connections.push({ source, target, label, color, connector });
    }
  }
  return connections;
}

/** Parse one Eraser connection line into individual connections. */
export function parseConnectionLine(line: string): EraserConnection[] {
  const trimmed = line.trim();
  if (!trimmed) return [];

  let color: string | undefined;
  let core = trimmed;

  const bracketIdx = trimmed.lastIndexOf("[");
  if (bracketIdx > 0 && trimmed.endsWith("]")) {
    const inner = trimmed.slice(bracketIdx + 1, -1);
    const colorMatch = inner.match(/color:\s*([^,]+)/i);
    if (colorMatch) {
      color = colorMatch[1].trim().replace(/^["']|["']$/g, "");
    }
    core = trimmed.slice(0, bracketIdx).trim();
  }

  let label: string | undefined;
  const colonMatch = core.match(/^(.+?)\s*:\s*(.+)$/);
  if (
    colonMatch &&
    (colonMatch[1].includes(">") ||
      colonMatch[1].includes("<") ||
      colonMatch[1].includes("-"))
  ) {
    core = colonMatch[1].trim();
    label = colonMatch[2].trim();
  }

  if (core.includes(">") && !core.includes("<>") && !core.includes("-->")) {
    const segments = core
      .split(/\s*>\s*/)
      .map((segment) => segment.trim())
      .filter(Boolean);
    if (segments.length < 2) return [];

    const connections: EraserConnection[] = [];
    for (let i = 0; i < segments.length - 1; i += 1) {
      connections.push(
        ...expandConnection(
          splitNames(segments[i]),
          splitNames(segments[i + 1]),
          ">",
          label,
          color,
        ),
      );
    }
    return connections;
  }

  const matched = matchConnector(core);
  if (!matched) return [];

  return expandConnection(
    splitNames(matched.left),
    splitNames(matched.right),
    matched.connector,
    label,
    color,
  );
}

export function parseConnectionLines(lines: string[]): EraserConnection[] {
  const connections: EraserConnection[] = [];
  for (const line of lines) {
    if (!isConnectionLine(line)) continue;
    connections.push(...parseConnectionLine(line));
  }
  return connections;
}

function isConnectionLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return (
    trimmed.includes(">") ||
    trimmed.includes("<") ||
    /-->/g.test(trimmed) ||
    /[^\s]\s--\s[^\s]/.test(trimmed) ||
    /[^\s]\s-\s[^\s]/.test(trimmed)
  );
}
