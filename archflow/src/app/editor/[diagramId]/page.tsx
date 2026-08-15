import { EditorShell } from "@/components/editor/EditorShell";

interface EditorPageProps {
  params: Promise<{ diagramId: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { diagramId } = await params;

  return <EditorShell diagramId={diagramId} />;
}
