import { redirect } from "next/navigation";
import { generateId } from "@/utils/generateId";

export default function EditorIndexPage() {
  redirect(`/editor/${generateId()}`);
}
