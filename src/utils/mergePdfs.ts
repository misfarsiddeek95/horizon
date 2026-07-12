import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export async function mergeAndDownloadPdfs(
  selectedFiles: string[]
): Promise<void> {
  if (selectedFiles.length === 0) {
    throw new Error("No PDFs selected");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of selectedFiles) {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${file}`);
    }
    const pdfBytes = await response.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  const blob = new Blob([mergedBytes as unknown as BlobPart], {
    type: "application/pdf",
  });
  saveAs(blob, "Merged_Document.pdf");
}
