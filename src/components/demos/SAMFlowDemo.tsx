import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Video, Zap } from 'lucide-react';

const FRAMES = 18; // simulated video frames

/* Simulated video frame grid */
function FrameGrid({ masked, progress }: { masked: boolean; progress: number }) {
  const colours = [
    '#6366f1','#8b5cf6','#3b82f6','#22c55e','#ef4444',
    '#f59e0b','#06b6d4','#ec4899','#10b981','#f97316',
    '#a855f7','#14b8a6','#f43f5e','#84cc16','#0ea5e9',
    '#d946ef','#fb923c','#4ade80',
  ];

  return (
    <div className="grid grid-cols-6 gap-1 rounded-lg overflow-hidden border border-border">
      {Array.from({ length: FRAMES }).map((_, i) => {
        const shown = i < Math.floor(progress * FRAMES);
        return (
          <div key={i} className="relative aspect-video bg-secondary/40 overflow-hidden">
            {/* Base "image" — coloured block simulating scene */}
            <div className="absolute inset-0 flex items-end justify-start p-1">
              <div
                className="w-full h-3/4 rounded opacity-70"
                style={{ background: `linear-gradient(135deg, ${colours[i]}, ${colours[(i+5)%FRAMES]})` }}
              />
            </div>
            {/* Mask overlay */}
            {masked && shown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                className="absolute inset-0"
                style={{ background: `${colours[i]}55`, border: `2px solid ${colours[i]}` }}
              />
            )}
            <div className="absolute bottom-0.5 right-0.5 text-[8px] font-mono text-white/60">{i + 1}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function SAMFlowDemo() {
  const [phase, setPhase]       = useState<'idle'|'running'|'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [jf, setJf]             = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = () => {
    setPhase('running');
    setProgress(0);
    setJf(0);
    let p = 0;
    timerRef.current = setInterval(() => {
      p += 1 / 60;
      setProgress(Math.min(p, 1));
      setJf(Math.round(Math.min(p, 1) * 87.3 * 10) / 10);
      if (p >= 1) {
        clearInterval(timerRef.current!);
        setPhase('done');
      }
    }, 40);
  };

  const reset = () => {
    clearInterval(timerRef.current!);
    setPhase('idle'); setProgress(0); setJf(0);
  };

  useEffect(() => () => clearInterval(timerRef.current!), []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <Video className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          SAM-2 propagates an object mask across all video frames — <strong className="text-foreground">zero fine-tuning</strong> required.
          Click one frame, get a temporally consistent segmentation.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'J&F Score', value: phase === 'idle' ? '—' : `${jf}%` },
          { label: 'Frames Processed', value: phase === 'idle' ? '0 / 18' : `${Math.floor(progress * FRAMES)} / ${FRAMES}` },
          { label: 'Latency/Frame', value: phase !== 'idle' ? '15ms' : '—' },
        ].map((m) => (
          <div key={m.label} className="bg-secondary/40 rounded-xl p-3 border border-border">
            <div className="text-xl font-bold font-mono text-primary">{m.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-mono text-muted-foreground mb-2">
          {phase === 'idle' ? 'Video frames (click Run to propagate masks)' : phase === 'running' ? 'Propagating masks…' : '✓ Segmentation complete'}
        </p>
        <FrameGrid masked={phase !== 'idle'} progress={progress} />
      </div>

      {phase === 'running' && (
        <div className="w-full bg-secondary rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={run}
          disabled={phase === 'running'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-mono text-sm font-semibold disabled:opacity-50"
        >
          <Play className="w-4 h-4" />{phase === 'running' ? 'Segmenting…' : 'Run SAMFlow'}
        </motion.button>
        <button onClick={reset} className="px-4 py-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-secondary/30 rounded-xl p-4 border border-border text-xs font-mono leading-relaxed text-muted-foreground space-y-1">
        <p><span className="text-primary">Pipeline:</span> Frame 0 prompt → SAM-2 encoder → memory bank → RAFT flow warp → next frame</p>
        <p><span className="text-amber-400">vs. per-frame SAM:</span> Memory attention eliminates flickering across occlusions</p>
        <p><span className="text-emerald-400">Result:</span> J&F 87.3% on DAVIS-2017 · zero-shot · 24 FPS</p>
      </div>
    </div>
  );
}
