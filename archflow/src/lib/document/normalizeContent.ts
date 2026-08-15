export function normalizeDocumentContent(raw: string): string {
  if (!raw.trim()) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("<")) return raw;
  const paragraphs = raw.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  if (paragraphs.length === 0) return "";
  return paragraphs.map((p) => `<p>${escapeHtml(p.replace(/\n/g, "<br>"))}</p>`).join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isDocumentEmpty(html: string): boolean {
  if (!html.trim()) return true;
  const stripped = html
    .replace(/<p><br><\/p>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
  return stripped.length === 0;
}
