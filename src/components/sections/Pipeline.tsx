import React from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Tag,
  Shuffle,
  BrainCircuit,
  FlaskConical,
  FileOutput,
  Cpu,
  Server,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

const STAGES = [
  {
    icon: Database,
    label: 'Data Collection',
    tools: ['NIH Chest X-ray', 'COCO', 'Cityscapes', 'Kinetics-400', 'Custom scraping'],
    note: 'Patient-level splits — zero leakage',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Tag,
    label: 'Annotation',
    tools: ['LabelImg', 'CVAT', 'Roboflow', 'Weighted sampling for class imbalance'],
    note: 'Cross-validated inter-annotator agreement',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Shuffle,
    label: 'Augmentation',
    tools: ['Mosaic · MixUp', 'RandAugment', 'CutMix', 'Domain-specific CLAHE'],
    note: 'Distribution shift robustness by design',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BrainCircuit,
    label: 'Training',
    tools: ['PyTorch · CUDA', 'DDP multi-GPU', 'W&B experiment tracking', 'Focal / ArcFace / DFL loss'],
    note: 'Custom loss functions per domain',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: FlaskConical,
    label: 'Evaluation',
    tools: ['Ablation studies', 'Baseline comparison', 'Failure case analysis', 'Grad-CAM / SHAP'],
    note: 'Every decision is measured, not assumed',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: FileOutput,
    label: 'Export',
    tools: ['ONNX opset 17', 'TorchScript', 'Dynamic axes for variable batch', 'ONNX simplifier'],
    note: 'Framework-agnostic deployment',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Cpu,
    label: 'Quantization',
    tools: ['INT8 post-training', 'FP16 mixed precision', 'Calibration dataset (500 rep.)', 'Accuracy verification'],
    note: '3–6× latency reduction verified',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Server,
    label: 'Serving',
    tools: ['Triton Inference Server', 'Dynamic batching', 'FastAPI gateway', 'Docker + K8s-ready'],
    note: '<8ms p99, 99.9% uptime target',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: BarChart3,
    label: 'Monitoring',
    tools: ['Prometheus metrics', 'Grafana dashboards', 'Data drift detection', 'Auto-rollback on error spike'],
    note: 'Production is where models actually live',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
];

export default function Pipeline() {
  return (
    <section id="pipeline" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">07. ML Pipeline</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground font-mono text-sm mb-14"
        >
          End-to-end ownership — from raw dataset to production monitoring. Every stage is documented, measured, and version-controlled.
        </motion.p>

        {/* Pipeline flow */}
        <div className="relative">
          {/* Mobile: vertical stack | Desktop: horizontal wrap */}
          <div className="flex flex-col gap-4 md:hidden">
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
                  <div className={`w-10 h-10 rounded-lg ${stage.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${stage.color}`} />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-foreground">{stage.label}</p>
                    <p className={`font-mono text-[10px] ${stage.color} mb-2`}>{stage.note}</p>
                    <div className="flex flex-wrap gap-1">
                      {stage.tools.map((t) => (
                        <span key={t} className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: horizontal pipeline with arrows */}
          <div className="hidden md:block">
            {/* Row 1: stages 0-4 */}
            <div className="flex items-stretch gap-0 mb-6">
              {STAGES.slice(0, 5).map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <React.Fragment key={stage.label}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="glass-card rounded-xl p-5 flex-1 flex flex-col gap-3 hover:border-primary/30 transition-colors min-w-0"
                    >
                      <div className={`w-9 h-9 rounded-lg ${stage.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${stage.color}`} />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold text-foreground uppercase tracking-wide">{stage.label}</p>
                        <p className={`font-mono text-[9px] ${stage.color} mt-0.5 mb-2 leading-relaxed`}>{stage.note}</p>
                        <div className="flex flex-col gap-1">
                          {stage.tools.map((t) => (
                            <span key={t} className="text-[9px] font-mono text-muted-foreground leading-relaxed">{t}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    {i < 4 && (
                      <div className="flex items-center px-1 text-border flex-shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Connector line between rows */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-2 text-muted-foreground/40 font-mono text-[10px] pr-2">
                <div className="w-16 h-px bg-border" />
                <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
            </div>

            {/* Row 2: stages 5-8 (right to left visually reversed) */}
            <div className="flex items-stretch gap-0 flex-row-reverse">
              {STAGES.slice(5).map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <React.Fragment key={stage.label}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.4 }}
                      className="glass-card rounded-xl p-5 flex-1 flex flex-col gap-3 hover:border-primary/30 transition-colors min-w-0"
                    >
                      <div className={`w-9 h-9 rounded-lg ${stage.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${stage.color}`} />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold text-foreground uppercase tracking-wide">{stage.label}</p>
                        <p className={`font-mono text-[9px] ${stage.color} mt-0.5 mb-2 leading-relaxed`}>{stage.note}</p>
                        <div className="flex flex-col gap-1">
                          {stage.tools.map((t) => (
                            <span key={t} className="text-[9px] font-mono text-muted-foreground leading-relaxed">{t}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    {i < STAGES.slice(5).length - 1 && (
                      <div className="flex items-center px-1 text-border flex-shrink-0">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
