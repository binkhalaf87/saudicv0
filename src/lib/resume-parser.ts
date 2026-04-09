function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

const MIN_DIRECT_TEXT_LENGTH = 120;
const MAX_OCR_PAGES = 3;

async function createOcrWorker(logger?: (status: string) => void) {
  const { createWorker, PSM } = await import('tesseract.js');

  const worker = await createWorker('ara+eng', 1, {
    logger: (message) => {
      if (message.status && logger) {
        logger(message.status);
      }
    },
    workerPath: 'https://unpkg.com/tesseract.js@6/dist/worker.min.js',
    corePath: 'https://unpkg.com/tesseract.js-core@6/tesseract-core-simd-lstm.wasm.js',
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  });

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO,
    preserve_interword_spaces: '1',
  });

  return worker;
}

async function renderPdfPageToCanvas(page: any) {
  const viewport = page.getViewport({ scale: 1.8 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('تعذر تجهيز مساحة الرسم اللازمة لاستخراج النص من الملف.');
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas;
}

async function extractPdfTextWithOcr(file: File, logger?: (status: string) => void) {
  const pdfJs = await import('pdfjs-dist');
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfJs.GlobalWorkerOptions.workerSrc = pdfWorker.default;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfJs.getDocument({ data: buffer }).promise;
  const worker = await createOcrWorker(logger);
  const pages: string[] = [];

  try {
    const totalPages = Math.min(pdf.numPages, MAX_OCR_PAGES);

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      logger?.(`ocr-page-${pageNumber}`);
      const page = await pdf.getPage(pageNumber);
      const canvas = await renderPdfPageToCanvas(page);
      const result = await worker.recognize(canvas);
      pages.push(normalizeWhitespace(result.data.text));
    }
  } finally {
    await worker.terminate();
  }

  return normalizeWhitespace(pages.join('\n'));
}

async function extractPdfText(file: File) {
  const pdfJs = await import('pdfjs-dist');
  const pdfWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfJs.GlobalWorkerOptions.workerSrc = pdfWorker.default;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfJs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');

    pages.push(normalizeWhitespace(pageText));
  }

  return normalizeWhitespace(pages.join('\n'));
}

async function extractDocxText(file: File) {
  const mammoth = await import('mammoth');
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return normalizeWhitespace(result.value);
}

export async function extractResumeText(file: File, logger?: (status: string) => void) {
  const lowerName = file.name.toLowerCase();

  if (file.type === 'application/pdf' || lowerName.endsWith('.pdf')) {
    const directText = await extractPdfText(file);

    if (directText.length >= MIN_DIRECT_TEXT_LENGTH) {
      return directText;
    }

    logger?.('ocr-fallback');
    const ocrText = await extractPdfTextWithOcr(file, logger);

    if (ocrText.length >= Math.max(80, directText.length)) {
      return ocrText;
    }

    return directText || ocrText;
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    lowerName.endsWith('.docx')
  ) {
    return extractDocxText(file);
  }

  if (file.type === 'application/msword' || lowerName.endsWith('.doc')) {
    throw new Error('صيغة DOC القديمة غير مدعومة حاليًا للتحليل الذكي. يرجى تحويلها إلى PDF أو DOCX.');
  }

  throw new Error('صيغة الملف غير مدعومة للتحليل. استخدم PDF أو DOCX.');
}
