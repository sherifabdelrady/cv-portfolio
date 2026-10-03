import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from './shared/ImageUploader';
import ModelStatus from './shared/ModelStatus';
import {
  runClassification,
  initClassificationEngine,
  type ClassPrediction,
} from '@/lib/vision/classification-engine';

export default function ClassificationDemo() {
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<ClassPrediction[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClassify = async () => {
    if (!imageDataUrl || !imgRef.current) return;
    try {
      setIsRunning(true);
      if (modelStatus !== 'ready') {
        setModelStatus('loading');
        await initClassificationEngine();
        setModelStatus('ready');
      }
      const preds = await runClassification(imgRef.current, 5);
      setPredictions(preds);
    } catch {
      setModelStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (imageDataUrl) setPredictions([]);
  }, [imageDataUrl]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6 flex flex-col">
        <ImageUploader onImageLoad={setImageDataUrl} />
        <ModelStatus
          status={modelStatus}
          firstRunNote="First run downloads the classification model (~16 MB) and compiles for WebGL. Takes 5–20 s. Cached afterwards."
        />
        <button
          onClick={handleClassify}
          disabled={!imageDataUrl || isRunning}
          className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isRunning ? 'Classifying...' : 'Classify Image'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border h-64 flex items-center justify-center">
          {!imageDataUrl && (
            <span className="text-muted-foreground font-mono text-sm">Upload an image to classify</span>
          )}
          {imageDataUrl && (
            <img ref={imgRef} src={imageDataUrl} alt="target" className="max-w-full max-h-full object-contain" />
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">
            Top 5 Predictions
          </h4>
          <div className="space-y-3">
            <AnimatePresence>
              {predictions.map((p, i) => (
                <motion.div
                  key={p.className}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-xs font-mono">
                    <span className="truncate max-w-[80%] capitalize" title={p.className}>
                      {p.className}
                    </span>
                    <span className="text-primary font-bold">{(p.probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.probability * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {predictions.length === 0 && (
              <div className="text-muted-foreground text-sm font-mono opacity-50">No predictions yet</div>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-mono bg-secondary/50 p-3 rounded-lg mt-auto">
          Depthwise-separable CNN backbone (1 000-class feature extractor) running on WebGL.
          In a medical deployment this backbone is fine-tuned on domain-specific pathology datasets.
        </p>
      </div>
    </div>
  );
}
