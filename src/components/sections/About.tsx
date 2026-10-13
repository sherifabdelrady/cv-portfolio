import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, FlaskConical, Radio, Cpu, TrendingUp, Code2, Zap, Globe } from 'lucide-react';

/* ── Animated counter ─────────────────────────────────────────────────── */
function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = 16;
    const inc = to / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= to) { setValue(to); clearInterval(timer); }
      else { setValue(Math.floor(start)); }
    }, step);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>;
}

const STATS = [
  { icon: Code2,      label: 'Lines of CV code',        to: 50000, suffix: '+',  color: 'text-primary',     bg: 'bg-primary/10'    },
  { icon: TrendingUp, label: 'Benchmark improvement',   to: 31,    suffix: '×',  color: 'text-violet-400',  bg: 'bg-violet-400/10' },
  { icon: Zap,        label: 'Inference speedup (INT8)', to: 8,     suffix: 'ms', color: 'text-amber-400',   bg: 'bg-amber-400/10'  },
  { icon: Globe,      label: 'Papers annotated',        to: 120,   suffix: '+',  color: 'text-emerald-400', bg: 'bg-emerald-400/10'},
];

const SKILL_GROUPS = [
  { label: 'Core Stack',     items: ['Python', 'PyTorch', 'OpenCV', 'NumPy', 'CUDA / cuDNN'] },
  { label: 'Vision Models',  items: ['YOLOv8 / YOLO series', 'U-Net · SegFormer', 'CLIP · ViTPose · DPT', 'BEVFusion · PointPillars', 'ArcFace · ESRGAN · SlowFast'] },
  { label: 'Deployment',     items: ['ONNX · TorchScript', 'FastAPI · Docker', 'Triton Inference Server', 'INT8 / FP16 Quantization'] },
  { label: 'Tooling',        items: ['Weights & Biases', 'HuggingFace Hub', 'scikit-learn', 'Git · Linux · Jupyter'] },
];

const DIFFERENTIATORS = [
  { icon: Layers,       title: 'Full-stack ownership',       body: 'Dataset curation → architecture → training loop → production API. Not just fine-tuning.' },
  { icon: FlaskConical, title: 'Ablation-driven decisions',  body: 'Every design choice is measured. Focal loss, anchor-free heads, ASPP — picked for reasons, not defaults.' },
  { icon: Radio,        title: 'Production observability',   body: 'Latency p99, distribution drift, calibration datasets for quantization — systems that stay correct after launch.' },
  { icon: Cpu,          title: 'Edge-to-cloud deployment',   body: 'INT8 ONNX, Triton dynamic batching, 3.1× accuracy-per-latency — optimisation as a first-class concern.' },
];

const EXPLORING = [
  'LLaVA & multimodal LLMs',
  'BEV perception at scale',
  'Efficient ViT · MobileViT',
  'NeRF / Gaussian Splatting',
  'Diffusion for data augmentation',
];

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">About</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        {/* ── Animated stat counters ─────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className={`text-3xl font-bold font-mono ${s.color}`}>
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <p className="text-xs text-muted-foreground font-mono leading-tight">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-6 text-muted-foreground text-lg leading-relaxed"
          >
            <p>
              I own the full CV pipeline — from dataset curation and annotation strategy
              through custom model architecture, training, and production deployment.
              Not just fine-tuning: I modify detection heads, design domain-specific loss
              functions, and run ablation studies to measure what each decision actually
              contributes.
            </p>
            <p>
              The work that shaped my thinking most was a detection system that had to
              sustain 45 FPS at 1080p on server GPU <em>and</em> export cleanly to
              INT8 ONNX for edge deployment — a 3.1× accuracy-per-latency improvement
              over the stock backbone. That tradeoff forced me to understand the whole
              stack, not just the training loop.
            </p>
            <p>
              I care about the parts that don't show up in benchmarks: failure case
              analysis, calibration datasets for quantization, Prometheus metrics that
              catch distribution drift before it reaches the user. The goal is systems
              that are correct and observable, not just accurate on validation sets.
            </p>
            <p>
              Currently available for{' '}
              <span className="text-primary font-mono text-base bg-primary/8 px-1.5 py-0.5 rounded">freelance projects</span>
              {' and '}
              <span className="text-primary font-mono text-base bg-primary/8 px-1.5 py-0.5 rounded">remote full-time roles</span>
              {' '}where computer vision, deep learning, and production AI engineering are first-class concerns — not afterthoughts.
            </p>

            {/* Differentiators */}
            <div className="pt-6 border-t border-border space-y-4">
              {DIFFERENTIATORS.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.div
                    key={d.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-foreground text-sm leading-snug">{d.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{d.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Currently exploring */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest mb-3">
                Currently deep-diving →
              </p>
              <div className="flex flex-wrap gap-2">
                {EXPLORING.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-600 dark:text-amber-400 hover:border-amber-500/60 transition-colors cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — tools & frameworks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="glass-card p-8 rounded-xl relative overflow-hidden"
          >
            {/* Gradient accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="absolute top-4 right-4 font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
              tech stack
            </div>
            <h3 className="font-mono text-lg text-foreground mb-8 font-semibold">Tools &amp; Frameworks</h3>

            {/* ── Profile photo card ── */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden p-[2px] bg-gradient-to-br from-primary via-violet-500 to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <div className="w-full h-full rounded-[14px] overflow-hidden">
                    <img
                      src={`${import.meta.env.BASE_URL ?? '/'}sherif-photo.jpg`}
                      alt="Sherif Abd El-Rady"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      width={64}
                      height={64}
                    />
                  </div>
                </div>
                {/* Availability dot */}
                <span className="absolute -bottom-1 -right-1 flex w-3.5 h-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-background" />
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Sherif Abd El-Rady</p>
                <p className="font-mono text-xs text-muted-foreground">Computer Vision Engineer</p>
                <p className="font-mono text-[11px] text-emerald-400 mt-0.5">Available for remote work</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label}>
                  <h4 className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-1.5">
                    {group.label}
                  </h4>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="font-mono text-sm text-foreground flex items-start gap-2 group/item">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-[5px] group-hover/item:bg-violet-400 transition-colors" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Open to work card */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-6 font-mono text-sm">
                <div>
                  <h4 className="text-foreground mb-1 font-sans font-semibold text-sm">What I build</h4>
                  <p className="text-primary font-medium text-sm">Custom CV &amp; AI Systems</p>
                  <p className="text-xs text-muted-foreground">Data → Model → Production</p>
                  <p className="text-xs text-muted-foreground opacity-80">Ablation-driven decisions</p>
                </div>
                <div>
                  <h4 className="text-foreground mb-1 font-sans font-semibold text-sm">How I work</h4>
                  <p className="text-primary font-medium text-sm">Freelance &amp; Remote Roles</p>
                  <p className="text-xs text-muted-foreground">Project-based or full-time</p>
                  <p className="text-xs text-muted-foreground opacity-80">Remote only · from home</p>
                </div>
              </div>

              {/* Availability pulse */}
              <div className="mt-5 flex items-center gap-3 p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
                <span className="relative flex w-2 h-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-mono text-xs text-emerald-400 font-semibold">Open to work — available now</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
