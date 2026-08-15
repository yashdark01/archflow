import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuthUser } from "@/lib/auth/session";
import {
  parseCreateDiagramBody,
  toDiagramDetail,
  toDiagramListItem,
  toInputJsonArray,
} from "@/lib/diagrams/diagramMappers";
import type { DiagramListResponse } from "@/types/api";
import type { DiagramEdge, DiagramNode } from "@/types/diagram";

export async function GET() {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagrams = await prisma.diagram.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const response: DiagramListResponse = {
    diagrams: diagrams.map(toDiagramListItem),
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = parseCreateDiagramBody(body);
  if (parsed === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (parsed.duplicateFromId) {
    const source = await prisma.diagram.findUnique({
      where: { id: parsed.duplicateFromId },
    });

    if (!source || source.userId !== user.id) {
      return NextResponse.json({ error: "Diagram not found" }, { status: 404 });
    }

    const duplicate = await prisma.diagram.create({
      data: {
        title: parsed.title ?? `${source.title} (copy)`,
        nodes: toInputJsonArray(source.nodes as unknown as DiagramNode[]),
        edges: toInputJsonArray(source.edges as unknown as DiagramEdge[]),
        mermaidCode: source.mermaidCode,
        eraserCode: source.eraserCode,
        userId: user.id,
      },
    });

    return NextResponse.json(toDiagramDetail(duplicate), { status: 201 });
  }

  const diagram = await prisma.diagram.create({
    data: {
      title: parsed.title ?? "Untitled Diagram",
      userId: user.id,
    },
  });

  return NextResponse.json(toDiagramDetail(diagram), { status: 201 });
}
