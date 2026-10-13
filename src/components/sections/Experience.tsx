import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, BookOpen, FlaskConical, Layers, ChevronDown, ChevronUp, Terminal, Award, TrendingUp } from 'lucide-react';

const ENGAGEMENTS = [
  {
    domain: 'Medical Imaging',
    icon: FlaskConical,
    accent: 'text-rose-400',
    border: 'border-rose-500/20',
    bg: 'bg-rose-500/8',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.08)]',
    description: 'Pathology slide analysis and diagnostic assist tooling for clinical workflows.',
    metric: '97.3% AUC',
  },
  {
    domain: 'Urban Analytics',
    icon: Layers,
    accent: 'text-sky-400',
    border: 'border-sky-500/20',
    bg: 'bg-sky-500/8',
    glow: 'shadow-[0_0_20px_rgba(14,165,233,0.08)]',
    description: 'Real-time traffic density and crowd-flow estimation for smart-city infrastructure.',
    metric: '45 FPS · 1080p',
  },
  {
    domain: 'Industrial Inspection',
    icon: Code2,
    accent: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/8',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]',
    description: 'Defect detection on manufacturing lines — sub-millimeter anomaly localisation.',
    metric: 'mAP 0.93',
  },
  {
    domain: 'Document Intelligence',
    icon: BookOpen,
    accent: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/8',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.08)]',
    description: 'Layout parsing and structured OCR pipelines for Arabic and mixed-script documents.',
    metric: '98.1% char accuracy',
  },
];

const FOUNDATIONS = [
  {
    category: 'Architecture Deep-Dives',
    icon: TrendingUp,
    color: 'text-primary',
    items: [
      'Reimplemented YOLOv1 → v8 from first principles to understand anchor evolution',
      'Built U-Net and SegFormer from scratch; studied skip-connection gradient flow',
      'Studied ArcFace margin geometry; reproduced training on LFW benchmark',
    ],
  },
  {
    category: 'Systems & Deployment',
    icon: Terminal,
    color: 'text-emerald-400',
    items: [
      'Profiled CUDA kernels with Nsight; identified memory-copy bottlenecks in multi-GPU pipelines',
      'INT8 PTQ vs QAT tradeoffs — empirical ablations across 6 backbone families',
      'Built Triton Inference Server configs from scratch for dynamic batching',
    ],
  },
  {
    category: 'First-Principles Study',
    icon: BookOpen,
    color: 'text-violet-400',
    items: [
      'Worked through seminal papers: Attention is All You Need, MAE, DINOv2, SAM',
      'Reproduced key results from CVPR / ICCV proceedings in personal research env',
      'Maintained private paper-reading log; ~120 annotated CV/ML papers to date',
    ],
  },
];

const TIMELINE = [
  {
    year: '2023–Present',
    title: 'Independent CV Engineer',
    sub: 'Freelance · Remote',
    active: true,
    bullets: [
      'Own the full pipeline — data curation → architecture → training → production.',
      'Modified detection heads and designed domain-specific loss functions; ran ablation studies.',
      'Reduced latency 40% via INT8 quantization + ONNX export without accuracy regression.',
      'Deployed real-time APIs with FastAPI + Docker + Prometheus drift alerting.',
    ],
  },
  {
    year: '2021–2023',
    title: 'CV Research & Self-Study',
    sub: 'Full-stack deep learning',
    active: false,
    bullets: [
      'Systematic study of CNN → ViT transition: EfficientNet, ConvNeXt, DeiT, Swin.',
      'Built personal benchmark environment reproducing COCO, ImageNet, Cityscapes results.',
      'Completed fast.ai Practical Deep Learning + Stanford CS231n coursework.',
    ],
  },
];

export default function Experience() {
  const [openFoundation, setOpenFoundation] = useState<number | null>(0);

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">02. Experience</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Timeline + Engagements */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            {/* Timeline */}
            <div className="glass-card rounded-2xl p-8">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-6">Career timeline</p>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-8">
                  {TIMELINE.map((t, i) => (
                    <motion.div
                      key={t.year}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="pl-8 relative"
                    >
                      {/* Dot */}
                      <div className={`absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center ${
                        t.active
                          ? 'border-primary bg-primary/20'
                          : 'border-border bg-background'
                      }`}>
                        {t.active && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      </div>

                      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                        <div>
                          <h3 className="font-bold text-foreground text-sm">{t.title}</h3>
                          <p className="font-mono text-xs text-primary mt-0.5">{t.sub}</p>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border whitespace-nowrap">
                          {t.year}
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {t.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                            <span className="w-1 h-1 rounded-full bg-primary/50 mt-[6px] flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement domains */}
            <div className="glass-card rounded-2xl p-8">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Project domains</p>
              <div className="grid grid-cols-2 gap-3">
                {ENGAGEMENTS.map((e, i) => {
                  const Icon = e.icon;
                  return (
                    <motion.div
                      key={e.domain}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className={`rounded-xl p-4 ${e.bg} border ${e.border} ${e.glow} hover:scale-[1.02] transition-transform`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-3.5 h-3.5 ${e.accent}`} />
                        <span className={`font-mono text-[11px] font-bold ${e.accent}`}>{e.domain}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{e.description}</p>
                      <span className={`font-mono text-[10px] font-bold ${e.accent} opacity-80`}>{e.metric}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right — Technical Foundations (accordion) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-8 flex flex-col gap-6"
          >
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">How the depth was built</p>
              <h3 className="text-xl font-bold text-foreground">Technical Foundations</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                No degree, no bootcamp. Everything below was built through first-principles
                study, deliberate re-implementation, and client projects where the stakes were real.
              </p>
            </div>

            {/* Accordion foundations */}
            <div className="space-y-3 flex-1">
              {FOUNDATIONS.map((f, i) => {
                const Icon = f.icon;
                const isOpen = openFoundation === i;
                return (
                  <div key={f.category} className="border border-border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFoundation(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-3.5 h-3.5 ${f.color}`} />
                        </div>
                        <span className="font-mono text-sm font-semibold text-foreground">{f.category}</span>
                      </div>
                      {isOpen
                        ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="border-t border-border bg-secondary/20"
                        >
                          <ul className="p-4 space-y-2.5">
                            {f.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                                <span className={`w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0 ${f.color.replace('text-', 'bg-')}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Paper log highlight */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
              <Award className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs font-semibold text-violet-400 mb-1">120+ Annotated Papers</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Personal reading log covering CVPR / ICCV / NeurIPS proceedings — every architecture understood before deployment.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border font-mono text-[11px] text-muted-foreground/60 leading-relaxed italic">
              Self-directed learning is not a gap in the record — it is the record.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
