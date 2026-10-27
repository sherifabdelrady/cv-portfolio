import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Cpu, Brain, Layers, MapPin, GraduationCap } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] as const },
});

const CORE_FOCUS = [
  {
    icon: Brain,
    color: 'text-blue-400',
    bg: 'bg-blue-500/8 border-blue-500/20',
    title: 'Computer Vision',
    desc: 'Object detection, segmentation, tracking, depth estimation, pose estimation — full pipeline from dataset to deployment.',
  },
  {
    icon: Cpu,
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    title: 'Production ML Systems',
    desc: 'ONNX/TRT export, FastAPI serving, Prometheus metrics, batched inference, INT8 quantization, Docker containerization.',
  },
  {
    icon: Layers,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    title: 'Multimodal AI',
    desc: 'CLIP embeddings, FAISS retrieval, LLaVA/LLaMA visual QA, ControlNet diffusion, cross-modal search at scale.',
  },
  {
    icon: Code2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8 border-amber-500/20',
    title: 'Research → Code',
    desc: 'Translating CVPR/NeurIPS papers into working PyTorch implementations with rigorous validation and reproducibility.',
  },
];

const EDUCATION = [
  {
    degree: 'B.Sc. Computer Science & Engineering',
    school: 'Faculty of Engineering',
    year: '2019 – 2024',
    note: 'Deep Learning specialisation. Thesis: Real-time multi-camera vehicle re-identification using cross-view ArcFace embeddings.',
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding relative">
      {/* Subtle top fade */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />

      <div className="max-content">
        {/* Section label */}
        <motion.div {...fadeUp()} className="flex items-center gap-4 mb-4">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">01 / About</span>
          <div className="h-px flex-1 section-divider" />
        </motion.div>

        {/* Heading */}
        <motion.h2 {...fadeUp(0.05)} className="font-heading font-bold text-4xl md:text-5xl mb-16">
          Who I Am
        </motion.h2>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Left — bio text */}
          <div className="lg:col-span-3 space-y-6">
            <motion.p {...fadeUp(0.1)} className="text-foreground/85 text-lg leading-relaxed">
              I'm a computer vision engineer based in{' '}
              <span className="text-primary font-medium inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />Cairo, Egypt
              </span>{' '}
              with a deep focus on closing the gap between ML research and production engineering.
            </motion.p>

            <motion.p {...fadeUp(0.15)} className="text-muted-foreground leading-relaxed">
              Over the past several years I've built and deployed 18+ ML models across 8 computer
              vision domains — from YOLOv8 detection pipelines and CLIP-powered semantic search
              to 3D Gaussian Splatting and monocular depth estimation. My work always ends with
              a running API, not just a notebook.
            </motion.p>

            <motion.p {...fadeUp(0.2)} className="text-muted-foreground leading-relaxed">
              I care deeply about correctness. Every model I ship has proper preprocessing,
              validated postprocessing, and measurable metrics — not just code that runs without
              throwing exceptions. I've caught and fixed YOLOv8 objectness score bugs, CTC decoder
              regressions, and FAISS empty-index crashes that silently produce wrong results.
            </motion.p>

            {/* Education */}
            <motion.div {...fadeUp(0.25)} className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Education</span>
              </div>
              {EDUCATION.map((e) => (
                <div key={e.degree}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{e.degree}</p>
                      <p className="font-mono text-xs text-primary mt-0.5">{e.school}</p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{e.year}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{e.note}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Core focus cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {CORE_FOCUS.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(0.15 + i * 0.08)}
                className={`glass-card rounded-xl p-4 border ${item.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg border ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
