export async function parseFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const { parsePdf } = await import("./pdf");
    return parsePdf(file);
  }
  if (
    name.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { parseDocx } = await import("./docx");
    return parseDocx(file);
  }
  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    return await file.text();
  }
  throw new Error("Unsupported file type. Use .pdf, .docx, or .txt");
}
