import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuthUser } from "@/lib/auth/session";
import { parseGuestDiagramPayload, toDiagramDetail, toInputJsonArray } from "@/lib/diagrams/diagramMappers";

export async function POST(request: Request) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseGuestDiagramPayload(body);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const diagram = await prisma.diagram.create({
    data: {
      title: parsed.title ?? "Untitled Diagram",
      nodes: parsed.nodes ? toInputJsonArray(parsed.nodes) : [],
      edges: parsed.edges ? toInputJsonArray(parsed.edges) : [],
      mermaidCode: parsed.mermaidCode,
      eraserCode: parsed.eraserCode,
      userId: user.id,
    },
  });

  return NextResponse.json(toDiagramDetail(diagram), { status: 201 });
}
