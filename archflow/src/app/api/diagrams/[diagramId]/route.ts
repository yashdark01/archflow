import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuthUser } from "@/lib/auth/session";
import {
  parseUpdateDiagramBody,
  toDiagramDetail,
  toInputJsonArray,
} from "@/lib/diagrams/diagramMappers";

interface RouteContext {
  params: Promise<{ diagramId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { diagramId } = await context.params;
  const diagram = await prisma.diagram.findUnique({ where: { id: diagramId } });

  if (!diagram) {
    return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
  }

  if (diagram.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(toDiagramDetail(diagram));
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { diagramId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseUpdateDiagramBody(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const existing = await prisma.diagram.findUnique({ where: { id: diagramId } });

  if (existing && existing.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const diagram = await prisma.diagram.upsert({
    where: { id: diagramId },
    create: {
      id: diagramId,
      userId: user.id,
      title: parsed.title ?? "Untitled Diagram",
      nodes: parsed.nodes ? toInputJsonArray(parsed.nodes) : [],
      edges: parsed.edges ? toInputJsonArray(parsed.edges) : [],
      mermaidCode: parsed.mermaidCode,
      eraserCode: parsed.eraserCode,
    },
    update: {
      ...(parsed.title !== undefined ? { title: parsed.title } : {}),
      ...(parsed.nodes !== undefined ? { nodes: toInputJsonArray(parsed.nodes) } : {}),
      ...(parsed.edges !== undefined ? { edges: toInputJsonArray(parsed.edges) } : {}),
      ...(parsed.mermaidCode !== undefined ? { mermaidCode: parsed.mermaidCode } : {}),
      ...(parsed.eraserCode !== undefined ? { eraserCode: parsed.eraserCode } : {}),
    },
  });

  return NextResponse.json(toDiagramDetail(diagram));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { diagramId } = await context.params;
  const diagram = await prisma.diagram.findUnique({ where: { id: diagramId } });

  if (!diagram) {
    return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
  }

  if (diagram.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.diagram.delete({ where: { id: diagramId } });

  return NextResponse.json({ ok: true });
}
