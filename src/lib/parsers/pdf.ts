// Client-side PDF text extraction with pdf.js.
// Use the explicit legacy browser build so Vite can resolve it without
// pulling in Node-only entry paths from pdfjs-dist's default export map.
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

let configured = false;
function configureWorker() {
  if (configured) return;
  const version = (pdfjs as unknown as { version: string }).version;
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/legacy/build/pdf.worker.min.mjs`;
  configured = true;
}

export async function parsePdf(file: File): Promise<string> {
  configureWorker();
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ");
    parts.push(text);
  }
  return parts.join("\n\n").trim();
}
