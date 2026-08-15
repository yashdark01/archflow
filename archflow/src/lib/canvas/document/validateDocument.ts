import type {
  EraserArchitectureDocument,
  EraserConnection,
  EraserElement,
  EraserElementProperties,
} from "@/lib/canvas/schema";

export interface DocumentValidationIssue {
  code: string;
  message: string;
  elementName?: string;
}

function collectElementNames(
  elements: EraserElement[],
  names: string[] = [],
): string[] {
  for (const element of elements) {
    names.push(element.name);
    if (element.children.length > 0) {
      collectElementNames(element.children, names);
    }
  }
  return names;
}

function isValidColorMode(value: string | undefined): boolean {
  return !value || ["pastel", "bold", "outline"].includes(value);
}

function isValidStyleMode(value: string | undefined): boolean {
  return !value || ["shadow", "plain", "watercolor"].includes(value);
}

function isValidTypeface(value: string | undefined): boolean {
  return !value || ["rough", "clean", "mono"].includes(value);
}

function validateProperties(
  props: EraserElementProperties,
  elementName: string,
): DocumentValidationIssue[] {
  const issues: DocumentValidationIssue[] = [];

  if (!isValidColorMode(props.colorMode)) {
    issues.push({
      code: "invalid_color_mode",
      message: `Invalid colorMode on "${elementName}"`,
      elementName,
    });
  }
  if (!isValidStyleMode(props.styleMode)) {
    issues.push({
      code: "invalid_style_mode",
      message: `Invalid styleMode on "${elementName}"`,
      elementName,
    });
  }
  if (!isValidTypeface(props.typeface)) {
    issues.push({
      code: "invalid_typeface",
      message: `Invalid typeface on "${elementName}"`,
      elementName,
    });
  }

  return issues;
}

function validateElements(elements: EraserElement[]): DocumentValidationIssue[] {
  const issues: DocumentValidationIssue[] = [];

  for (const element of elements) {
    issues.push(...validateProperties(element.properties, element.name));
    if (element.children.length > 0) {
      issues.push(...validateElements(element.children));
    }
  }

  return issues;
}

export function validateDocument(
  document: EraserArchitectureDocument,
): DocumentValidationIssue[] {
  const issues: DocumentValidationIssue[] = [];
  const names = collectElementNames(document.elements);
  const seen = new Map<string, number>();

  for (const name of names) {
    seen.set(name, (seen.get(name) ?? 0) + 1);
  }

  for (const [name, count] of seen) {
    if (count > 1) {
      issues.push({
        code: "duplicate_name",
        message: `Duplicate element name "${name}"`,
        elementName: name,
      });
    }
  }

  const nameSet = new Set(names);

  for (const connection of document.connections) {
    if (!nameSet.has(connection.source)) {
      issues.push({
        code: "unknown_connection_source",
        message: `Connection source "${connection.source}" is not defined`,
        elementName: connection.source,
      });
    }
    if (!nameSet.has(connection.target)) {
      issues.push({
        code: "unknown_connection_target",
        message: `Connection target "${connection.target}" is not defined`,
        elementName: connection.target,
      });
    }
    if (connection.source === connection.target) {
      issues.push({
        code: "self_connection",
        message: `Self-connection on "${connection.source}"`,
        elementName: connection.source,
      });
    }
  }

  issues.push(...validateElements(document.elements));

  return issues;
}

export function formatDocumentValidationSummary(
  issues: DocumentValidationIssue[],
): string {
  if (issues.length === 0) return "";
  return issues.map((issue) => issue.message).join("\n");
}

function propsEqual(
  a: EraserElementProperties,
  b: EraserElementProperties,
): boolean {
  const keys = new Set([
    ...Object.keys(a),
    ...Object.keys(b),
  ]) as Set<keyof EraserElementProperties>;

  for (const key of keys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function elementsEqual(a: EraserElement[], b: EraserElement[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];
    if (
      left.name !== right.name ||
      left.isGroup !== right.isGroup ||
      !propsEqual(left.properties, right.properties) ||
      !elementsEqual(left.children, right.children)
    ) {
      return false;
    }
  }
  return true;
}

function connectionsEqual(
  a: EraserConnection[],
  b: EraserConnection[],
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];
    if (
      left.source !== right.source ||
      left.target !== right.target ||
      left.connector !== right.connector ||
      left.label !== right.label ||
      left.color !== right.color
    ) {
      return false;
    }
  }
  return true;
}

/** Structural equality for round-trip tests (ignores title ordering noise). */
export function structuralEqual(
  a: EraserArchitectureDocument,
  b: EraserArchitectureDocument,
): boolean {
  return (
    a.title === b.title &&
    a.style.direction === b.style.direction &&
    a.style.colorMode === b.style.colorMode &&
    a.style.styleMode === b.style.styleMode &&
    a.style.typeface === b.style.typeface &&
    elementsEqual(a.elements, b.elements) &&
    connectionsEqual(a.connections, b.connections) &&
    JSON.stringify(a.legend ?? null) === JSON.stringify(b.legend ?? null)
  );
}
