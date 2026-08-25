import { jsPDF } from 'jspdf';

const MARGIN = 18;
const PAGE_W = 210;   // A4 mm
const PAGE_H = 297;
const BODY_W = PAGE_W - MARGIN * 2;


// Fonts are fetched only when a non-Latin script is present, so English-only
// exports never download them.
const FONT_SOURCES = {
  sinhala: { url: '/fonts/NotoSansSinhala-Regular.ttf', vfs: 'NotoSansSinhala.ttf', name: 'NotoSansSinhala' },
  tamil:   { url: '/fonts/NotoSansTamil-Regular.ttf',   vfs: 'NotoSansTamil.ttf',   name: 'NotoSansTamil' }
};

const _fontCache = {};   // url -> base64, so repeat exports don't refetch

function detectScript(text) {
  for (const c of text) {
    if (c >= '\u0D80' && c <= '\u0DFF') return 'sinhala';
    if (c >= '\u0B80' && c <= '\u0BFF') return 'tamil';
  }
  return 'latin';
}

async function loadFontBase64(url) {
  if (_fontCache[url]) return _fontCache[url];

  const res = await fetch(url);
  if (!res.ok) throw new Error(`font fetch failed: ${res.status}`);
  const buf = await res.arrayBuffer();

  // ArrayBuffer -> base64, chunked to avoid blowing the call stack
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }

  _fontCache[url] = btoa(binary);
  return _fontCache[url];
}

/**
 * Registers whichever non-Latin font the text needs.
 * Returns the jsPDF font name to use, or null to keep helvetica.
 */
async function ensureFontFor(doc, text) {
  const script = detectScript(text);
  if (script === 'latin') return null;

  const src = FONT_SOURCES[script];
  try {
    const base64 = await loadFontBase64(src.url);
    doc.addFileToVFS(src.vfs, base64);
    doc.addFont(src.vfs, src.name, 'normal');
    return src.name;
  } catch (e) {
    console.warn('Font load failed, falling back to helvetica', e);
    return null;
  }
}

/**
 * Builds a PDF from one assistant message.
 * Text is rendered as real text; charts are embedded as PNGs
 * captured from their canvas elements.
 */
export async function exportMessageToPdf({ message, canvases = [], filename }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  // ── header ────────────────────────────────────────────
  doc.setFillColor(11, 93, 115);           // blueDeep
  doc.rect(0, 0, PAGE_W, 24, 'F');

  doc.setTextColor(247, 245, 242);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Haycarb AI Assistant', MARGIN, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(109, 190, 210);
  doc.text('Annual Report 2025/26 · Beyond the Beyond', MARGIN, 17);

  y = 34;

  // ── body ──────────────────────────────────────────────
  const customFont = await ensureFontFor(doc, message.content);
  
  doc.setTextColor(40, 40, 40);
   y = renderMarkdown(doc, message.content, y, customFont);

  // ── person photos ─────────────────────────────────────
  if (message.images?.length) {
    const loaded = await Promise.all(
      message.images.map(async (img) => {
        const fetched = await fetchImageAsDataUrl(img.url);
        return fetched ? { label: img.label, ...fetched } : null;
      })
    );

    const usable = loaded.filter(Boolean);

    if (usable.length > 0) {
      const cols    = 4;
      const gap     = 4;
      const cardW   = (BODY_W - gap * (cols - 1)) / cols;
      const imgH    = cardW * 1.15;
      const labelH  = 8;
      const rowH    = imgH + labelH + 4;

      y = ensureSpace(doc, y, rowH + 4);
      y += 2;

      usable.forEach((img, i) => {
        const col = i % cols;
        if (col === 0 && i > 0) y = ensureSpace(doc, y + rowH, rowH);

        const x = MARGIN + col * (cardW + gap);
        const rowY = y;

        // scale to fit the box without distorting, then centre
        const ratio = Math.min(cardW / img.w, imgH / img.h);
        const drawW = img.w * ratio;
        const drawH = img.h * ratio;
        const offX  = x + (cardW - drawW) / 2;
        const offY  = rowY + (imgH - drawH) / 2;

        try {
          doc.addImage(img.dataUrl, offX, offY, drawW, drawH);
        } catch {
          return;
        }

        if (img.label) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.setTextColor(90, 147, 168);
          const lines = doc.splitTextToSize(img.label, cardW).slice(0, 2);
          lines.forEach((line, li) => {
            doc.text(line, x + cardW / 2, rowY + imgH + 3 + li * 2.6, { align: 'center' });
          });
        }
      });

      const rows = Math.ceil(usable.length / cols);
      y += rowH * rows + 4;
    }
  }

  // ── charts ────────────────────────────────────────────
  canvases.filter(Boolean).forEach((canvas, i) => {
    const chart = message.charts?.[i];
    const imgW = BODY_W;
    const imgH = (canvas.height / canvas.width) * imgW;

    y = ensureSpace(doc, y, imgH + 14);

    if (chart?.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(23, 126, 152);
      doc.text(chart.title, MARGIN, y);
      y += 5;
    }

    doc.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', MARGIN, y, imgW, imgH);
    y += imgH + 8;
  });

  addFooters(doc);
  doc.save(filename ?? `haycarb-answer-${Date.now()}.pdf`);
}

/**
 * Minimal markdown handling — headings, bullets, bold, paragraphs.
 * Enough for the shapes the API actually returns.
 */
function renderMarkdown(doc, markdown, startY, customFont) {
  const bodyFont = customFont ?? 'helvetica';
  let y = startY;
  const lines = markdown.split('\n');

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) { y += 3; continue; }

    // heading
    const heading = line.match(/^#{1,3}\s+(.*)$/);
    if (heading) {
      y = ensureSpace(doc, y, 10);
      doc.setFont(bodyFont, customFont ? 'normal' : 'bold');
      doc.setFontSize(11);
      doc.setTextColor(23, 126, 152);
      y = writeWrapped(doc, heading[1], MARGIN, y, BODY_W, 5.5);
      y += 2;
      continue;
    }

    // bullet
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      y = ensureSpace(doc, y, 8);
      doc.setFont(bodyFont, 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      doc.text('•', MARGIN + 1, y);
      y = writeWrapped(doc, stripBold(bullet[1]), MARGIN + 6, y, BODY_W - 6, 4.8);
      y += 1;
      continue;
    }

    // paragraph
    y = ensureSpace(doc, y, 8);
    doc.setFont(bodyFont, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    y = writeWrapped(doc, stripBold(line), MARGIN, y, BODY_W, 4.8);
    y += 2;
  }

  return y;
}

function writeWrapped(doc, text, x, y, width, lineHeight) {
  const wrapped = doc.splitTextToSize(text, width);
  for (const w of wrapped) {
    y = ensureSpace(doc, y, lineHeight);
    doc.text(w, x, y);
    y += lineHeight;
  }
  return y;
}

function ensureSpace(doc, y, needed) {
  if (y + needed > PAGE_H - 20) {
    doc.addPage();
    return MARGIN + 6;
  }
  return y;
}

function stripBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

function addFooters(doc, answerText = '') {
  const lang = /[\u0D80-\u0DFF]/.test(answerText) ? 'si'
             : /[\u0B80-\u0BFF]/.test(answerText) ? 'ta'
             : 'en';

  // Latin only — the footer keeps helvetica, so use English for si/ta
  const note = lang === 'en'
    ? 'AI-generated · Please verify important figures against the Annual Report 2025/26'
    : 'AI-generated · Verify figures against the Annual Report 2025/26';

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(note, PAGE_W / 2, PAGE_H - 13, { align: 'center' });
    doc.text(
      `Haycarb AI Assistant · ${i} of ${total}`,
      PAGE_W / 2, PAGE_H - 9, { align: 'center' }
    );
  }
}

/**
 * Fetches an image and returns it as a base64 data URL.
 * SAS URLs expire, so a failed fetch resolves to null rather than throwing.
 */
async function fetchImageAsDataUrl(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();

    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
    if (!dataUrl) return null;

    // natural dimensions, so the PDF can preserve aspect ratio
    const size = await new Promise((resolve) => {
      const im = new Image();
      im.onload = () => resolve({ w: im.naturalWidth, h: im.naturalHeight });
      im.onerror = () => resolve(null);
      im.src = dataUrl;
    });

    return size ? { dataUrl, ...size } : null;
  } catch {
    return null;
  }
}