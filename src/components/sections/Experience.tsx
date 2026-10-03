import React from 'react';
import { motion } from 'framer-motion';
import { Code2, BookOpen, FlaskConical, Layers } from 'lucide-react';

const ENGAGEMENTS = [
  {
    domain: 'Medical Imaging',
    icon: FlaskConical,
    accent: 'text-rose-500',
    bg: 'bg-rose-500/10',
    description: 'Pathology slide analysis and diagnostic assist tooling for clinical workflows.',
  },
  {
    domain: 'Urban Analytics',
    icon: Layers,
    accent: 'text-sky-500',
    bg: 'bg-sky-500/10',
    description: 'Real-time traffic density and crowd-flow estimation for smart-city infrastructure.',
  },
  {
    domain: 'Industrial Inspection',
    icon: Code2,
    accent: 'text-amber-500',
    bg: 'bg-amber-500/10',
    description: 'Defect detection on manufacturing lines — sub-millimeter anomaly localisation.',
  },
  {
    domain: 'Document Intelligence',
    icon: BookOpen,
    accent: 'text-violet-500',
    bg: 'bg-violet-500/10',
    description: 'Layout parsing and structured OCR pipelines for Arabic and mixed-script documents.',
  },
];

const FOUNDATIONS = [
  {
    category: 'Architecture Deep-Dives',
    items: [
      'Reimplemented YOLOv1 → v8 from first principles to understand anchor evolution',
      'Built U-Net and SegFormer from scratch; studied skip-connection gradient flow',
      'Studied ArcFace margin geometry; reproduced training on LFW benchmark',
    ],
  },
  {
    category: 'Systems & Deployment',
    items: [
      'Profiled CUDA kernels with Nsight; identified memory-copy bottlenecks in multi-GPU pipelines',
      'INT8 PTQ vs QAT tradeoffs — empirical ablations across 6 backbone families',
      'Built Triton Inference Server configs from scratch for dynamic batching',
    ],
  },
  {
    category: 'First-Principles Study',
    items: [
      'Worked through seminal papers: Attention is All You Need, MAE, DINOv2, SAM',
      'Reproduced key results from CVPR / ICCV proceedings in personal research env',
      'Maintained private paper-reading log; ~120 annotated CV/ML papers to date',
    ],
  },
];

export default function Experience() {
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
          {/* Left — Freelance practice card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8 flex flex-col gap-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs text-primary uppercase tracking-widest">Active</span>
                </div>
                <h3 className="text-xl font-bold text-foreground leading-snug">
                  Independent Computer Vision Engineer
                </h3>
                <p className="text-sm text-primary font-mono mt-1">Freelance · Remote</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full border border-border whitespace-nowrap self-start">
                2023 – Present
              </span>
            </div>

            {/* Bullets */}
            <ul className="space-y-3">
              {[
                'Own the full pipeline — data curation, annotation strategy, custom architecture, training, and production deployment.',
                'Modified detection heads and designed domain-specific loss functions; ran ablation studies to quantify each contribution.',
                'Reduced inference latency by 40 % via INT8 quantization and ONNX export without measurable accuracy regression.',
                'Deployed real-time APIs on FastAPI + Docker; instrumented with Prometheus for distribution-drift alerting.',
              ].map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-[7px] flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            {/* Engagement domains */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-4 border-b border-border pb-2">
                Engagement Domains
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ENGAGEMENTS.map((e) => {
                  const Icon = e.icon;
                  return (
                    <div
                      key={e.domain}
                      className={`rounded-xl p-3.5 ${e.bg} border border-border/50`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className={`w-3.5 h-3.5 ${e.accent}`} />
                        <span className={`font-mono text-xs font-semibold ${e.accent}`}>
                          {e.domain}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {e.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right — Technical Foundations */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-2xl p-8 flex flex-col gap-8"
          >
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                How the depth was built
              </p>
              <h3 className="text-xl font-bold text-foreground">Technical Foundations</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                No degree, no bootcamp. Everything below was built through first-principles
                study, deliberate re-implementation, and client projects where the stakes
                were real.
              </p>
            </div>

            <div className="space-y-7">
              {FOUNDATIONS.map((f, i) => (
                <motion.div
                  key={f.category}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-primary/60 inline-block" />
                    {f.category}
                  </p>
                  <ul className="space-y-2.5">
                    {f.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-[7px] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-border font-mono text-[11px] text-muted-foreground/70 leading-relaxed">
              Self-directed learning is not a gap in the record — it is the record.
              Every architecture listed in this portfolio was understood before it was deployed.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
