/**
 * PoseForge Demo — Real-time Human Pose Estimation
 * Uses MoveNet SinglePose Lightning (TF.js) for real in-browser inference.
 * 17-keypoint COCO skeleton drawn live on uploaded images.
 * Production uses ViTPose-B: AP 77.1% on COCO Keypoints 2017.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import ImageUploader from './shared/ImageUploader';
import ModelStatus from './shared/ModelStatus';

type Keypoint = { x: number; y: number; score: number; name: string };

// COCO 17-keypoint skeleton edges
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4],   // face
  [5, 6],                             // shoulders
  [5, 7], [7, 9],                     // left arm
  [6, 8], [8, 10],                    // right arm
  [5, 11], [6, 12],                   // torso
  [11, 12],                           // hips
  [11, 13], [13, 15],                 // left leg
  [12, 14], [14, 16],                 // right leg
];

const EDGE_COLOR = '#3B82F6';
const KP_COLOR   = '#10B981';
const KP_LOW     = '#F59E0B';

type PoseDetector = { estimatePoses: (img: HTMLImageElement) => Promise<{ keypoints: Keypoint[]; score?: number }[]> };
let _detector: PoseDetector | null = null;

async function loadPoseModel(): Promise<PoseDetector> {
  if (_detector) return _detector;
  await import('@tensorflow/tfjs');
  const pd = await import('@tensorflow-models/pose-detection');
  const raw = await pd.createDetector(
    pd.SupportedModels.MoveNet,
    { modelType: (pd as any).movenet?.modelType?.SINGLEPOSE_LIGHTNING ?? 'SinglePose.Lightning' }
  );
  _detector = raw as unknown as PoseDetector;
  return _detector;
}

function drawSkeleton(canvas: HTMLCanvasElement, img: HTMLImageElement, keypoints: Keypoint[]) {
  const ctx = canvas.getContext('2d')!;
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const scale = img.naturalWidth;  // keypoints are normalised 0-1 by MoveNet... actually no, they're in pixels
  // MoveNet returns pixel coords already scaled to input tensor (192x192 by default)
  // We need to scale to the displayed image
  const scaleX = img.naturalWidth  / (img.width  || img.naturalWidth);
  const scaleY = img.naturalHeight / (img.height || img.naturalHeight);

  // Draw edges
  EDGES.forEach(([i, j]) => {
    const kpA = keypoints[i];
    const kpB = keypoints[j];
    if (!kpA || !kpB || kpA.score < 0.2 || kpB.score < 0.2) return;
    ctx.beginPath();
    ctx.moveTo(kpA.x, kpA.y);
    ctx.lineTo(kpB.x, kpB.y);
    ctx.strokeStyle = EDGE_COLOR;
    ctx.lineWidth = Math.max(2, canvas.width / 200);
    ctx.globalAlpha = 0.8;
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Draw keypoints
  keypoints.forEach((kp) => {
    if (kp.score < 0.2) return;
    const r = Math.max(4, canvas.width / 100);
    ctx.beginPath();
    ctx.arc(kp.x, kp.y, r, 0, Math.PI * 2);
    ctx.fillStyle = kp.score > 0.5 ? KP_COLOR : KP_LOW;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

export default function PoseForgeDemo() {
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
  const [poseScore, setPoseScore] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageUrl && imgRef.current && canvasRef.current) {
      imgRef.current.onload = () => {
        const ctx = canvasRef.current!.getContext('2d')!;
        canvasRef.current!.width  = imgRef.current!.naturalWidth;
        canvasRef.current!.height = imgRef.current!.naturalHeight;
        ctx.drawImage(imgRef.current!, 0, 0);
        setKeypoints([]);
        setPoseScore(null);
      };
    }
  }, [imageUrl]);

  const handleDetect = async () => {
    if (!imgRef.current || !canvasRef.current) return;
    try {
      setIsRunning(true);
      if (modelStatus !== 'ready') {
        setModelStatus('loading');
        await loadPoseModel();
        setModelStatus('ready');
      }
      const detector = await loadPoseModel();
      const poses = await detector.estimatePoses(imgRef.current);
      if (poses.length === 0) {
        setKeypoints([]);
        setPoseScore(0);
        return;
      }
      const { keypoints: kps, score } = poses[0];
      setKeypoints(kps);
      setPoseScore(score ?? null);
      drawSkeleton(canvasRef.current, imgRef.current, kps);
    } catch (e) {
      console.error(e);
      setModelStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const visibleKps = keypoints.filter((k) => k.score >= 0.2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4 flex flex-col">
        <ImageUploader
          onImageLoad={setImageUrl}
          label="Upload a photo of a person for pose estimation"
        />
        <ModelStatus
          status={modelStatus}
          firstRunNote="First run downloads MoveNet Lightning (~6 MB) and JIT-compiles for WebGL. Takes ~10 s. Subsequent runs are instant."
        />
        <button
          type="button"
          onClick={handleDetect}
          disabled={!imageUrl || isRunning}
          className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono text-sm"
        >
          {isRunning ? 'Estimating pose…' : 'Estimate Pose'}
        </button>

        {poseScore !== null && (
          <div className="font-mono text-sm space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Pose confidence</span>
              <span className="text-primary">{(poseScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${poseScore * 100}%` }} />
            </div>
          </div>
        )}

        {visibleKps.length > 0 && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {visibleKps.slice(0, 8).map((kp) => (
              <div key={kp.name} className="flex items-center justify-between text-xs font-mono bg-secondary/50 border border-border rounded-lg px-3 py-1.5">
                <span className="capitalize text-foreground">{kp.name.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${kp.score * 100}%`, background: kp.score > 0.5 ? '#10B981' : '#F59E0B' }} />
                  </div>
                  <span style={{ color: kp.score > 0.5 ? '#10B981' : '#F59E0B' }}>{(kp.score * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
            {visibleKps.length > 8 && (
              <p className="text-[10px] font-mono text-muted-foreground text-center">+{visibleKps.length - 8} more keypoints</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border min-h-[300px] flex items-center justify-center">
          {!imageUrl && <span className="text-muted-foreground font-mono text-sm">Skeleton overlay appears here</span>}
          {imageUrl && (
            <>
              <img ref={imgRef} src={imageUrl} alt="pose input" className="hidden" />
              <canvas ref={canvasRef} className="max-w-full h-auto max-h-[420px] object-contain" />
            </>
          )}
        </div>

        {keypoints.length > 0 && (
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="bg-secondary/50 border border-border rounded-lg p-2">
              <p className="text-emerald-500 font-bold text-base">{visibleKps.length}</p>
              <p className="text-muted-foreground">keypoints</p>
            </div>
            <div className="bg-secondary/50 border border-border rounded-lg p-2">
              <p className="text-primary font-bold text-base">17</p>
              <p className="text-muted-foreground">COCO joints</p>
            </div>
            <div className="bg-secondary/50 border border-border rounded-lg p-2">
              <p className="text-amber-500 font-bold text-base">{keypoints.filter(k => k.score < 0.2).length}</p>
              <p className="text-muted-foreground">occluded</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-[11px] font-mono text-muted-foreground">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary/50" />
          <span>
            <span className="text-primary">Model:</span> MoveNet SinglePose Lightning (in-browser WebGL). Production uses ViTPose-B (AP 77.1%) with top-down two-stage pipeline for multi-person scenes.
          </span>
        </div>
      </div>
    </div>
  );
}
