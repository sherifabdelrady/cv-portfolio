import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Layers, Cpu, GitMerge } from 'lucide-react';

const METRICS = [
  {
    icon: Layers,
    value: 25,
    suffix: '+',
    label: 'Public Repositories',
    desc: 'Spanning 8 CV domains',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/8',
    glow: 'shadow-[0_0_30px_hsl(217_91%_60%/0.12)]',
  },
  {
    icon: Cpu,
    value: 18,
    suffix: '',
    label: 'ML Models Deployed',
    desc: 'ONNX / FastAPI / Docker',
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/8',
    glow: 'shadow-[0_0_30px_hsl(262_83%_68%/0.12)]',
  },
  {
    icon: TrendingUp,
    value: 45,
    suffix: ' FPS',
    label: 'YOLOv8 Throughput',
    desc: '@ 1080p on Jetson Orin',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/8',
    glow: 'shadow-[0_0_30px_hsl(160_84%_39%/0.12)]',
  },
  {
    icon: GitMerge,
    value: 13,
    suffix: '',
    label: 'PRs Merged',
    desc: 'Production bug fixes',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/8',
    glow: 'shadow-[0_0_30px_hsl(38_92%_50%/0.12)]',
  },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function Metrics() {
  return (
    <section id="metrics" className="section-padding relative">
      <div className="absolute inset-0 bg-dot opacity-20 pointer-events-none" />

      <div className="max-content relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-4"
        >
          <span className="font-mono text-xs text-primary uppercase tracking-widest">Numbers</span>
          <div className="h-px flex-1 section-divider" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-heading font-bold text-4xl md:text-5xl mb-12"
        >
          By the Numbers
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`glass-card rounded-2xl p-6 border ${m.border} ${m.bg} ${m.glow}`}
            >
              <div className={`w-10 h-10 rounded-xl border ${m.border} flex items-center justify-center mb-4`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div className={`font-heading font-bold text-4xl md:text-5xl mb-1 ${m.color}`}>
                <Counter target={m.value} suffix={m.suffix} />
              </div>
              <p className="font-semibold text-sm text-foreground mb-1">{m.label}</p>
              <p className="font-mono text-xs text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
