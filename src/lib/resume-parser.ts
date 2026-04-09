function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
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

export async function extractResumeText(file: File) {
  const lowerName = file.name.toLowerCase();

  if (file.type === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return extractPdfText(file);
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    lowerName.endsWith('.docx')
  ) {
    return extractDocxText(file);
  }

  if (file.type === 'application/msword' || lowerName.endsWith('.doc')) {
    throw new Error('صيغة DOC القديمة غير مدعومة حاليًا. يرجى رفع الملف بصيغة PDF أو DOCX.');
  }

  throw new Error('صيغة الملف غير مدعومة للتحليل. استخدم PDF أو DOCX.');
}
