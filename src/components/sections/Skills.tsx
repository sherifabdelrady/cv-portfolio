import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] as const },
});

const SKILL_GROUPS = [
  {
    label: 'Computer Vision',
    color: 'text-blue-400',
    accent: 'bg-blue-500',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    skills: [
      { name: 'Object Detection (YOLO/DETR)', pct: 96 },
      { name: 'Semantic Segmentation',         pct: 90 },
      { name: 'Pose Estimation',               pct: 85 },
      { name: 'Optical Flow & Tracking',       pct: 82 },
      { name: '3D Scene Reconstruction',       pct: 74 },
    ],
  },
  {
    label: 'Deep Learning',
    color: 'text-violet-400',
    accent: 'bg-violet-500',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/5',
    skills: [
      { name: 'PyTorch / torchvision',         pct: 95 },
      { name: 'Transfer Learning & Fine-tune', pct: 92 },
      { name: 'ONNX / TensorRT Export',        pct: 88 },
      { name: 'GAN / Diffusion Models',        pct: 80 },
      { name: 'LLM / Multimodal (LLaVA)',      pct: 75 },
    ],
  },
  {
    label: 'Production & MLOps',
    color: 'text-emerald-400',
    accent: 'bg-emerald-500',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    skills: [
      { name: 'FastAPI / REST Serving',        pct: 93 },
      { name: 'Docker / Containerisation',     pct: 88 },
      { name: 'FAISS Vector Search',           pct: 85 },
      { name: 'Prometheus / Monitoring',       pct: 78 },
      { name: 'CUDA / GPU Optimisation',       pct: 72 },
    ],
  },
];

const TOOL_CLOUD = [
  'Python', 'PyTorch', 'OpenCV', 'NumPy', 'ONNX Runtime', 'TensorRT',
  'FastAPI', 'FAISS', 'Docker', 'CUDA', 'timm', 'Hugging Face',
  'Diffusers', 'MediaPipe', 'scikit-learn', 'Matplotlib', 'Git', 'Linux',
  'Prometheus', 'Triton Inference Server', 'vLLM', 'open_clip',
];

function SkillBar({ name, pct, accent, delay }: { name: string; pct: number; accent: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-foreground/80">{name}</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, delay: delay + 0.1, ease: [0.4, 0, 0.2, 1] }}
          className={`h-full rounded-full ${accent}`}
          style={{ boxShadow: `0 0 8px currentColor` }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section-padding relative">
      <div className="max-content">
        {/* Label */}
        <motion.div {...fadeUp()} className="flex items-center gap-4 mb-4">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">04 / Skills</span>
          <div className="h-px flex-1 section-divider" />
        </motion.div>

        <motion.h2 {...fadeUp(0.05)} className="font-heading font-bold text-4xl md:text-5xl mb-4">
          Technical Expertise
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="text-muted-foreground font-mono text-sm mb-12">
          Percentages reflect relative confidence & depth of experience, not arbitrary scores.
        </motion.p>

        {/* Skill groups */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              {...fadeUp(0.1 + gi * 0.08)}
              className={`glass-card rounded-2xl p-6 border ${group.border} ${group.bg}`}
            >
              <h3 className={`font-heading font-semibold text-base mb-5 ${group.color}`}>
                {group.label}
              </h3>
              <div className="space-y-4">
                {group.skills.map((s, si) => (
                  <SkillBar
                    key={s.name}
                    name={s.name}
                    pct={s.pct}
                    accent={group.accent}
                    delay={0.15 + gi * 0.06 + si * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tool cloud */}
        <motion.div
          {...fadeUp(0.3)}
          className="glass rounded-2xl p-6"
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">Tools & Libraries</p>
          <div className="flex flex-wrap gap-2">
            {TOOL_CLOUD.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.025 }}
                className="tag tag-blue hover:tag-blue cursor-default"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
