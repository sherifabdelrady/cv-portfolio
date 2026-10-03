import React, { useState, useRef, useEffect } from 'react';
import ImageUploader from './shared/ImageUploader';
import ModelStatus from './shared/ModelStatus';
import { runDetection, initDetectionEngine, type Detection } from '@/lib/vision/detection-engine';

const PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

function drawDetections(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  preds: Detection[],
  showTrackIds: boolean
) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  preds.forEach((p, i) => {
    const [x, y, w, h] = p.bbox;
    const color = PALETTE[i % PALETTE.length];
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, canvas.width / 300);
    ctx.strokeRect(x, y, w, h);

    const label = showTrackIds
      ? `#${i + 1} ${p.class} ${(p.score * 100).toFixed(0)}%`
      : `${p.class} ${(p.score * 100).toFixed(0)}%`;
    const fontSize = Math.max(12, canvas.width / 60);
    ctx.font = `bold ${fontSize}px monospace`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = color;
    ctx.fillRect(x, y - fontSize - 8, tw + 10, fontSize + 10);
    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + 5, y - 6);
  });
}

export default function ObjectDetectionDemo({
  variant = 'detection',
}: {
  variant?: 'detection' | 'tracking';
}) {
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Detection[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [fps, setFps] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleDetect = async () => {
    if (!imageDataUrl || !imgRef.current || !canvasRef.current) return;
    try {
      setIsRunning(true);
      if (modelStatus !== 'ready') {
        setModelStatus('loading');
        await initDetectionEngine();
        setModelStatus('ready');
      }
      const start = performance.now();
      const preds = await runDetection(imgRef.current);
      setFps(Math.round(1000 / (performance.now() - start)));
      setPredictions(preds);
      drawDetections(canvasRef.current, imgRef.current, preds, variant === 'tracking');
    } catch {
      setModelStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (imageDataUrl && imgRef.current && canvasRef.current) {
      imgRef.current.onload = () => {
        const ctx = canvasRef.current!.getContext('2d')!;
        canvasRef.current!.width = imgRef.current!.naturalWidth;
        canvasRef.current!.height = imgRef.current!.naturalHeight;
        ctx.drawImage(imgRef.current!, 0, 0);
        setPredictions([]);
        setFps(null);
      };
    }
  }, [imageDataUrl]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6 flex flex-col">
        <ImageUploader onImageLoad={setImageDataUrl} />
        <ModelStatus
          status={modelStatus}
          firstRunNote="First run downloads the detection model (~8 MB) and compiles it for WebGL. Takes 5–15 s depending on connection. Cached for subsequent runs."
        />
        <button
          onClick={handleDetect}
          disabled={!imageDataUrl || isRunning}
          className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isRunning ? 'Detecting...' : 'Detect Objects'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border min-h-[300px] flex items-center justify-center relative">
          {!imageDataUrl && (
            <span className="text-muted-foreground font-mono text-sm">Output will appear here</span>
          )}
          {imageDataUrl && (
            <>
              <img ref={imgRef} src={imageDataUrl} alt="target" className="hidden" />
              <canvas ref={canvasRef} className="max-w-full h-auto max-h-[400px] object-contain" />
            </>
          )}
        </div>

        {fps !== null && (
          <div className="text-xs font-mono text-muted-foreground flex justify-between">
            <span>Inference speed: {fps} FPS</span>
            <span>Objects found: {predictions.length}</span>
          </div>
        )}

        {predictions.length > 0 && (
          <div className="space-y-2 mt-2">
            {predictions.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-secondary/50 border border-border text-sm font-mono"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="capitalize">
                    {variant === 'tracking' ? `#${i + 1} ` : ''}
                    {p.class}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${p.score * 100}%` }} />
                  </div>
                  <span className="w-10 text-right">{(p.score * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
