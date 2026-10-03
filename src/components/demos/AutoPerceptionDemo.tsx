/**
 * AutoPerception Demo — Bird's Eye View 3D Object Detection
 * Runs real coco-ssd detection, then projects detections to a top-down BEV
 * canvas — visualising the BEVFusion camera-to-BEV projection pipeline.
 * Production: BEVFusion (LiDAR + 6 cameras) → mAP 0.624 on nuScenes.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import ImageUploader from './shared/ImageUploader';
import ModelStatus from './shared/ModelStatus';
import { initDetectionEngine, runDetection, type Detection } from '@/lib/vision/detection-engine';

// Class → BEV colour mapping
const CLASS_COLORS: Record<string, string> = {
  person:       '#10B981',
  car:          '#3B82F6',
  truck:        '#8B5CF6',
  bus:          '#F59E0B',
  motorcycle:   '#EF4444',
  bicycle:      '#EC4899',
  traffic_light:'#14B8A6',
  stop_sign:    '#F97316',
  default:      '#94A3B8',
};

function classColor(cls: string) {
  return CLASS_COLORS[cls.replace(' ', '_')] ?? CLASS_COLORS.default;
}

const BEV_W = 260;
const BEV_H = 360;
const BEV_CX = BEV_W / 2;

function drawBEV(
  canvas: HTMLCanvasElement,
  detections: Detection[],
  imgW: number,
  imgH: number
) {
  const ctx = canvas.getContext('2d')!;
  canvas.width  = BEV_W;
  canvas.height = BEV_H;

  // Background
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, BEV_W, BEV_H);

  // Grid — distance rings
  const RINGS = [0.25, 0.5, 0.75, 1.0];
  RINGS.forEach((r, i) => {
    const y = BEV_H * (1 - r * 0.85);
    ctx.strokeStyle = i === 3 ? '#1e3a5f' : '#0d2040';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(BEV_W, y);
    ctx.stroke();
    ctx.setLineDash([]);
    // Label
    const metres = Math.round(r * 50);
    ctx.fillStyle = '#1e3a5f';
    ctx.font = '9px monospace';
    ctx.fillText(`${metres}m`, 4, y - 3);
  });

  // Centre boresight line
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 6]);
  ctx.beginPath();
  ctx.moveTo(BEV_CX, 0);
  ctx.lineTo(BEV_CX, BEV_H * 0.85);
  ctx.stroke();
  ctx.setLineDash([]);

  // Ego vehicle — triangle at bottom
  const egoY = BEV_H - 18;
  ctx.fillStyle = '#3B82F6';
  ctx.beginPath();
  ctx.moveTo(BEV_CX, egoY - 14);
  ctx.lineTo(BEV_CX - 8, egoY + 4);
  ctx.lineTo(BEV_CX + 8, egoY + 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#3B82F6';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('EGO', BEV_CX, egoY + 16);
  ctx.textAlign = 'left';

  // Project detections to BEV
  detections.forEach((det) => {
    const [x, y, w, h] = det.bbox;
    const cx   = (x + w / 2) / imgW;    // lateral centre [0,1]
    const by   = (y + h)     / imgH;    // bottom of bbox (0=far, 1=near)
    const objW = w / imgW;              // relative width → size proxy

    // BEV position
    const bevX = BEV_CX + (cx - 0.5) * BEV_W * 1.4;
    const bevY = BEV_H * 0.05 + (1 - by) * BEV_H * 0.80;

    // Size on BEV canvas
    const sz = Math.max(8, objW * BEV_W * 0.9);

    const color = classColor(det.class);

    // Glow
    ctx.shadowColor = color;
    ctx.shadowBlur  = 8;
    ctx.fillStyle   = color + '55';
    ctx.fillRect(bevX - sz / 2, bevY - sz * 0.6, sz, sz * 1.2);
    ctx.shadowBlur = 0;

    // Solid box
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2;
    ctx.strokeRect(bevX - sz / 2, bevY - sz * 0.6, sz, sz * 1.2);

    // Connecting line to ego
    ctx.strokeStyle = color + '33';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(bevX, bevY + sz * 0.6);
    ctx.lineTo(BEV_CX, egoY - 14);
    ctx.stroke();

    // Label
    ctx.fillStyle = color;
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    const dist = Math.round((1 - by) * 50);
    ctx.fillText(`${det.class} ~${dist}m`, bevX, bevY - sz * 0.6 - 3);
    ctx.textAlign = 'left';
  });
}

function drawDetections(canvas: HTMLCanvasElement, img: HTMLImageElement, dets: Detection[]) {
  const ctx = canvas.getContext('2d')!;
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  dets.forEach((d, i) => {
    const [x, y, w, h] = d.bbox;
    const color = classColor(d.class);
    ctx.strokeStyle = color;
    ctx.lineWidth   = Math.max(2, canvas.width / 250);
    ctx.strokeRect(x, y, w, h);

    const label = `${d.class} ${(d.score * 100).toFixed(0)}%`;
    const fs = Math.max(11, canvas.width / 60);
    ctx.font = `bold ${fs}px monospace`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = color;
    ctx.fillRect(x, y - fs - 8, tw + 10, fs + 10);
    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + 5, y - 5);
  });
}

export default function AutoPerceptionDemo() {
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const detCanvasRef = useRef<HTMLCanvasElement>(null);
  const bevCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageUrl && imgRef.current && detCanvasRef.current) {
      imgRef.current.onload = () => {
        const ctx = detCanvasRef.current!.getContext('2d')!;
        detCanvasRef.current!.width  = imgRef.current!.naturalWidth;
        detCanvasRef.current!.height = imgRef.current!.naturalHeight;
        ctx.drawImage(imgRef.current!, 0, 0);
        setDetections([]);
        // Clear BEV
        if (bevCanvasRef.current) {
          const bCtx = bevCanvasRef.current.getContext('2d')!;
          bevCanvasRef.current.width  = BEV_W;
          bevCanvasRef.current.height = BEV_H;
          bCtx.fillStyle = '#0a0f1e';
          bCtx.fillRect(0, 0, BEV_W, BEV_H);
        }
      };
    }
  }, [imageUrl]);

  const handleDetect = async () => {
    if (!imgRef.current || !detCanvasRef.current || !bevCanvasRef.current) return;
    try {
      setIsRunning(true);
      if (modelStatus !== 'ready') {
        setModelStatus('loading');
        await initDetectionEngine();
        setModelStatus('ready');
      }
      const dets = await runDetection(imgRef.current);
      setDetections(dets);
      drawDetections(detCanvasRef.current, imgRef.current, dets);
      drawBEV(bevCanvasRef.current, dets, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
    } catch {
      setModelStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const classCounts = detections.reduce<Record<string, number>>((acc, d) => {
    acc[d.class] = (acc[d.class] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Controls */}
        <div className="space-y-4">
          <ImageUploader onImageLoad={setImageUrl} label="Upload a street / scene photo" />
          <ModelStatus
            status={modelStatus}
            firstRunNote="First run downloads coco-ssd (~8 MB) and compiles for WebGL. Takes 5–15 s. Cached after."
          />
          <button
            type="button"
            onClick={handleDetect}
            disabled={!imageUrl || isRunning}
            className="w-full bg-primary text-primary-foreground font-mono font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {isRunning ? 'Detecting → projecting…' : 'Detect + BEV Project'}
          </button>

          {detections.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Detections</p>
              {Object.entries(classCounts).map(([cls, cnt]) => (
                <div key={cls} className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: classColor(cls) }} />
                  <span className="capitalize flex-1 text-foreground">{cls}</span>
                  <span className="text-muted-foreground">×{cnt}</span>
                </div>
              ))}
              <div className="pt-1 border-t border-border font-mono text-xs text-muted-foreground">
                {detections.length} object{detections.length !== 1 ? 's' : ''} total
              </div>
            </div>
          )}
        </div>

        {/* Camera view */}
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Camera View</p>
          <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border flex-1 min-h-[200px] flex items-center justify-center">
            {!imageUrl
              ? <span className="text-muted-foreground font-mono text-xs">Detection overlay</span>
              : <>
                  <img ref={imgRef} src={imageUrl} alt="input" className="hidden" />
                  <canvas ref={detCanvasRef} className="max-w-full h-auto max-h-[260px]" />
                </>
            }
          </div>
        </div>

        {/* BEV canvas */}
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Bird's Eye View</p>
          <div className="bg-[#0a0f1e] rounded-xl overflow-hidden border border-[#1e3a5f] flex-1 min-h-[200px] flex items-center justify-center">
            {!imageUrl
              ? <span className="text-[#1e3a5f] font-mono text-xs">BEV projection</span>
              : <canvas ref={bevCanvasRef} className="max-w-full h-auto max-h-[360px]" />
            }
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 text-[11px] font-mono text-muted-foreground border-t border-border pt-3">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary/50" />
        <span>
          <span className="text-primary">Production:</span> BEVFusion — LSS camera→BEV projection fused with PointPillars LiDAR BEV. nuScenes mAP 0.624, NDS 0.672. CenterPoint head for class-agnostic 3D bounding boxes + velocity.
        </span>
      </div>
    </div>
  );
}
