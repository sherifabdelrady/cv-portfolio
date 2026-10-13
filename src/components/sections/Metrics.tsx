import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Eye, Zap, Target, Server } from 'lucide-react';

const METRICS = [
  {
    label: 'Projects Built',
    value: 18,
    suffix: '',
    delay: 0,
    icon: Layers,
    color: 'text-primary',
    bg: 'bg-primary/10',
    description: 'End-to-end CV systems, 2023–Present',
  },
  {
    label: 'CV Domains',
    value: 10,
    suffix: '',
    delay: 0.1,
    icon: Eye,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    description: 'Detection · OCR · GAN · Depth · NeRF · VQA',
  },
  {
    label: 'Real-Time FPS',
    value: 120,
    suffix: '',
    delay: 0.2,
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    description: 'NeRFusion · Gaussian Splatting · RTX 3090',
  },
  {
    label: 'Peak Model Acc',
    value: 97,
    suffix: '%',
    delay: 0.3,
    icon: Target,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    description: 'MediScan · NIH Chest X-Ray 14 dataset',
  },
  {
    label: 'Inference Speed',
    value: 8,
    suffix: 'ms',
    delay: 0.4,
    icon: Server,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    description: 'UrbanSense · INT8 ONNX · TensorRT',
  },
];


function Counter({
  value,
  suffix,
  delay,
  color = 'text-primary',
}: {
  value: number;
  suffix: string;
  delay: number;
  color?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const incrementTime = duration / value;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === value) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="font-mono">
      <span className={`text-4xl md:text-5xl font-bold tracking-tighter tabular-nums ${color}`}>
        {count}
      </span>
      <span className={`text-3xl md:text-4xl font-bold ${color}`}>{suffix}</span>
    </div>
  );
}


export default function Metrics() {
  return (
    <section id="metrics" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 border-y border-border" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">04. Impact</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: metric.delay }}
                className="glass-card rounded-xl p-6 flex flex-col gap-3 hover:border-primary/30 transition-all group hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <Counter value={metric.value} suffix={metric.suffix} delay={metric.delay} color={metric.color} />
                <div>
                  <p className={`font-mono text-xs font-semibold uppercase tracking-wider ${metric.color}`}>
                    {metric.label}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 font-mono text-[11px] text-muted-foreground/60 text-center"
        >
          All figures are project-level measurements from specific datasets and hardware configurations — not aggregated marketing claims.
        </motion.p>
      </div>
    </section>
  );
}
