import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const COVER_PAGE_PATH = "pdf/tbc/cover-page.pdf";

export async function mergeAndDownloadPdfs(
  selectedFiles: string[]
): Promise<void> {
  if (selectedFiles.length === 0) {
    throw new Error("No PDFs selected");
  }

  const mergedPdf = await PDFDocument.create();

  try {
    const coverResponse = await fetch(COVER_PAGE_PATH);
    if (!coverResponse.ok) {
      throw new Error(`Failed to fetch cover page: ${COVER_PAGE_PATH}`);
    }
    const coverBytes = await coverResponse.arrayBuffer();
    const coverPdf = await PDFDocument.load(coverBytes);
    const coverPages = await mergedPdf.copyPages(
      coverPdf,
      coverPdf.getPageIndices()
    );
    coverPages.forEach((page) => mergedPdf.addPage(page));
  } catch (err) {
    console.error("Failed to prepend cover page:", err);
  }

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
  saveAs(blob, "Your Personalized Report-Haycarb PLC Annual Report 2025/26.pdf");
}
