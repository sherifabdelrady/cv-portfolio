import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from './shared/ImageUploader';
import { runOCR } from '@/lib/vision/ocr-engine';

export default function OCRDemo() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ text: string; words: number; lines: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOCR = async () => {
    if (!imageDataUrl) return;
    try {
      setIsRunning(true);
      setResult(null);
      setError(null);
      setProgress(0);

      const { text, confidence: _conf } = await runOCR(imageDataUrl, setProgress);
      const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
      const lines = text.trim().split('\n').filter((l) => l.trim().length > 0).length;
      setResult({ text, words, lines });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Recognition failed. Please try a different image.');
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6 flex flex-col">
        <ImageUploader
          onImageLoad={(url) => {
            setImageDataUrl(url);
            setResult(null);
            setError(null);
            setProgress(0);
          }}
        />

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>Extracting text...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleOCR}
          disabled={!imageDataUrl || isRunning}
          className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isRunning ? 'Processing...' : 'Extract Text'}
        </button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-400 text-sm font-mono p-3 rounded-lg space-y-1">
            <p>{error}</p>
            <p className="text-xs opacity-70">Try refreshing the page. Requires a modern browser with WebAssembly enabled.</p>
          </div>
        )}

        <div className="flex items-start gap-2 font-mono text-xs py-2 px-3 rounded-md bg-secondary/60 border border-border text-muted-foreground">
          <span className="text-primary/60 mt-0.5 flex-shrink-0">ℹ</span>
          <span>First run downloads language data (~30 MB) via WebAssembly. Takes 10–30 s. Cached after.</span>
        </div>
        <p className="text-xs text-muted-foreground font-mono bg-secondary/50 p-3 rounded-lg">
          CRNN pipeline with CTC beam-search decoder — runs in-browser via WebAssembly, zero server round-trips.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border h-48 flex items-center justify-center p-2">
          {!imageDataUrl && (
            <span className="text-muted-foreground font-mono text-sm">Image preview</span>
          )}
          {imageDataUrl && (
            <img src={imageDataUrl} alt="target" className="max-w-full max-h-full object-contain" />
          )}
        </div>

        <div className="flex-1 bg-secondary rounded-xl p-4 border border-border flex flex-col relative min-h-[200px]">
          <h4 className="font-mono text-sm font-semibold text-foreground mb-2">Extracted Text</h4>
          <div className="flex-1 overflow-y-auto font-mono text-sm text-foreground/80 whitespace-pre-wrap">
            {result ? result.text : <span className="opacity-50">Results will appear here...</span>}
          </div>

          {result && (
            <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-2 text-xs font-mono">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded">
                Detected {result.words} words across {result.lines} lines
              </span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                {result.text.length} characters
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
