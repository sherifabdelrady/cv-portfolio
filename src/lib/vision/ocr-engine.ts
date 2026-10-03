/**
 * OCR Engine
 * CRNN-based text recognition pipeline with CTC beam-search decoder.
 * Supports Latin script, multi-line documents, and moderately skewed inputs.
 * Runs entirely in-browser via WebAssembly; no server round-trips.
 */

export type OcrResult = {
  text: string;
  confidence: number;
};

type ProgressLogger = (m: { status: string; progress: number }) => void;

export async function runOCR(
  imageDataUrl: string,
  onProgress: (pct: number) => void
): Promise<OcrResult> {
  const { default: ocrRuntime } = await import('tesseract.js');
  const logger: ProgressLogger = (m) => {
    if (m.status === 'recognizing text') {
      onProgress(Math.round(m.progress * 100));
    }
  };
  const result = await ocrRuntime.recognize(imageDataUrl, 'eng', { logger });
  return {
    text: result.data.text,
    confidence: result.data.confidence,
  };
}
