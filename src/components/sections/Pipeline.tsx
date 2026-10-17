import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Tag, Shuffle, BrainCircuit, FlaskConical,
  FileOutput, Cpu, Server, BarChart3, ChevronRight, ChevronDown,
} from 'lucide-react';

const STAGES = [
  {
    icon: Database,
    label: 'Data Collection',
    tools: ['NIH Chest X-ray', 'COCO', 'Cityscapes', 'Kinetics-400', 'Custom scraping'],
    note: 'Patient-level splits — zero leakage',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  {
    icon: Tag,
    label: 'Annotation',
    tools: ['LabelImg', 'CVAT', 'Roboflow', 'Weighted sampling for class imbalance'],
    note: 'Cross-validated inter-annotator agreement',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  {
    icon: Shuffle,
    label: 'Augmentation',
    tools: ['Mosaic · MixUp', 'RandAugment', 'CutMix', 'Domain-specific CLAHE'],
    note: 'Distribution shift robustness by design',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  {
    icon: BrainCircuit,
    label: 'Training',
    tools: ['PyTorch · CUDA', 'DDP multi-GPU', 'W&B experiment tracking', 'Focal / ArcFace / DFL loss'],
    note: 'Custom loss functions per domain',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
  },
  {
    icon: FlaskConical,
    label: 'Evaluation',
    tools: ['Ablation studies', 'Baseline comparison', 'Failure case analysis', 'Grad-CAM / SHAP'],
    note: 'Every decision is measured, not assumed',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  {
    icon: FileOutput,
    label: 'Export',
    tools: ['ONNX opset 17', 'TorchScript', 'Dynamic axes for variable batch', 'ONNX simplifier'],
    note: 'Framework-agnostic deployment',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  {
    icon: Cpu,
    label: 'Quantization',
    tools: ['INT8 post-training', 'FP16 mixed precision', 'Calibration dataset (500 rep.)', 'Accuracy verification'],
    note: '3–6× latency reduction verified',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  {
    icon: Server,
    label: 'Serving',
    tools: ['Triton Inference Server', 'Dynamic batching', 'FastAPI gateway', 'Docker + K8s-ready'],
    note: '<8ms p99, 99.9% uptime target',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
  {
    icon: BarChart3,
    label: 'Monitoring',
    tools: ['Prometheus metrics', 'Grafana dashboards', 'Data drift detection', 'Auto-rollback on error spike'],
    note: 'Production is where models actually live',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
  },
];

function StageCard({ stage, index, row }: { stage: typeof STAGES[0]; index: number; row: 'top' | 'bottom' }) {
  const [open, setOpen] = useState(false);
  const Icon = stage.icon;
  const globalIndex = row === 'top' ? index : index + 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: row === 'top' ? 20 : -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: globalIndex * 0.07 }}
      className={`glass-card rounded-xl flex-1 flex flex-col min-w-0 border transition-all cursor-pointer hover:shadow-lg ${
        open ? `border-current ${stage.border}` : 'border-border hover:border-border/80'
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="p-4 flex flex-col gap-2.5">
        {/* Step badge + icon */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${stage.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${stage.color}`} />
            </div>
            <span className={`text-[9px] font-mono font-bold ${stage.color} bg-current/10 px-1.5 py-0.5 rounded`} style={{ backgroundColor: 'transparent' }}>
              <span className={`${stage.color} opacity-60`}>{String(globalIndex + 1).padStart(2, '0')}</span>
            </span>
          </div>
          <ChevronDown className={`w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>

        <div>
          <p className="font-mono text-xs font-bold text-foreground uppercase tracking-wide leading-tight">{stage.label}</p>
          <p className={`font-mono text-[9px] ${stage.color} mt-1 leading-relaxed`}>{stage.note}</p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-3 pt-2.5 flex flex-col gap-1">
              {stage.tools.map((t) => (
                <span key={t} className="text-[9px] font-mono text-muted-foreground flex items-start gap-1.5">
                  <span className={`w-1 h-1 rounded-full flex-shrink-0 mt-[4px] ${stage.color.replace('text-', 'bg-')}`} />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Arrow({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`flex items-center px-0.5 text-muted-foreground/30 flex-shrink-0 ${reverse ? 'rotate-180' : ''}`}>
      <ChevronRight className="w-4 h-4" />
    </div>
  );
}

export default function Pipeline() {
  return (
    <section id="pipeline" className="py-24 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, currentColor, currentColor 1px, transparent 1px, transparent 40px)',
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">ML Pipeline</h2>
          <div className="h-px bg-border flex-1 mb-3" />
          <span className="mb-3 font-mono text-xs text-muted-foreground whitespace-nowrap">9 stages</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground font-mono text-sm mb-12"
        >
          End-to-end ownership — from raw dataset to production monitoring.{' '}
          <span className="text-amber-500">Click any stage</span> to expand tools.
        </motion.p>

        {/* Pipeline flow */}
        <div className="relative space-y-6">
          {/* Mobile: vertical */}
          <div className="flex flex-col gap-3 md:hidden">
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-xl p-4 flex items-start gap-4"
                >
                  <div className={`w-9 h-9 rounded-lg ${stage.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${stage.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-xs font-bold text-foreground">{stage.label}</p>
                      <span className={`font-mono text-[9px] ${stage.color}`}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <p className={`font-mono text-[10px] ${stage.color} mb-2`}>{stage.note}</p>
                    <div className="flex flex-wrap gap-1">
                      {stage.tools.map((t) => (
                        <span key={t} className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: snake layout */}
          <div className="hidden md:block space-y-4">
            {/* Row 1: stages 0–4 → */}
            <div className="flex items-stretch gap-0">
              {STAGES.slice(0, 5).map((stage, i) => (
                <React.Fragment key={stage.label}>
                  <StageCard stage={stage} index={i} row="top" />
                  {i < 4 && <Arrow />}
                </React.Fragment>
              ))}
            </div>

            {/* Snake connector */}
            <div className="flex justify-end pr-[calc(20%-8px)]">
              <div className="flex flex-col items-center gap-0">
                <div className="w-px h-4 bg-border" />
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
            </div>

            {/* Row 2: stages 5–8 ← (reversed visual) */}
            <div className="flex items-stretch gap-0 flex-row-reverse">
              {STAGES.slice(5).map((stage, i) => (
                <React.Fragment key={stage.label}>
                  <StageCard stage={stage} index={i} row="bottom" />
                  {i < STAGES.slice(5).length - 1 && <Arrow reverse />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-4 rounded-xl border border-border bg-secondary/30 flex flex-wrap gap-4 justify-between items-center"
        >
          {[
            { label: 'Dataset Formats', value: 'COCO · YOLO · VOC · Custom' },
            { label: 'Export Targets', value: 'ONNX · TorchScript · TensorRT' },
            { label: 'Deployment', value: 'Triton · FastAPI · Docker' },
            { label: 'Monitoring', value: 'Prometheus · Grafana · Drift alerts' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center min-w-[140px]">
              <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-0.5">{label}</p>
              <p className="font-mono text-xs text-foreground font-medium">{value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

