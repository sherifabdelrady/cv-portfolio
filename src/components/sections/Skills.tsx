import React from 'react';
import { motion } from 'framer-motion';
import {
  SiPytorch, SiPython, SiOpencv, SiFastapi, SiDocker,
  SiNumpy, SiHuggingface, SiScikitlearn, SiOnnx, SiLinux, SiGit, SiJupyter,
} from 'react-icons/si';
import { BrainCircuit, Cpu, Network, Code2, Layers, Zap, Eye, ScanLine, CheckCircle, Circle, Minus } from 'lucide-react';

const ROW_ONE = [
  { name: 'PyTorch', icon: SiPytorch, category: 'Deep Learning' },
  { name: 'Python', icon: SiPython, category: 'Language' },
  { name: 'OpenCV', icon: SiOpencv, category: 'Computer Vision' },
  { name: 'ONNX', icon: SiOnnx, category: 'Model Ops' },
  { name: 'FastAPI', icon: SiFastapi, category: 'Backend' },
  { name: 'Docker', icon: SiDocker, category: 'DevOps' },
  { name: 'NumPy', icon: SiNumpy, category: 'Data Science' },
  { name: 'HuggingFace', icon: SiHuggingface, category: 'Ecosystem' },
  { name: 'CUDA', icon: Cpu, category: 'GPU Computing' },
  { name: 'Scikit-learn', icon: SiScikitlearn, category: 'Machine Learning' },
  { name: 'Linux', icon: SiLinux, category: 'Systems' },
  { name: 'Git', icon: SiGit, category: 'Version Control' },
];

const ROW_TWO = [
  { name: 'YOLOv8', icon: Eye, category: 'Detection' },
  { name: 'U-Net', icon: Layers, category: 'Segmentation' },
  { name: 'CLIP ViT-L/14', icon: BrainCircuit, category: 'Multimodal AI' },
  { name: 'ViTPose', icon: Network, category: 'Pose Estimation' },
  { name: 'DPT / MiDaS', icon: Layers, category: 'Depth Estimation' },
  { name: 'BEVFusion', icon: Code2, category: 'Autonomous Perception' },
  { name: 'PointPillars', icon: Cpu, category: '3D Detection' },
  { name: 'ArcFace', icon: BrainCircuit, category: 'Face Recognition' },
  { name: 'ESRGAN', icon: Zap, category: 'Super-Resolution' },
  { name: 'DeepSORT', icon: Network, category: 'Tracking' },
  { name: 'FAISS', icon: Zap, category: 'Vector Search' },
  { name: 'SlowFast', icon: Code2, category: 'Video CV' },
  { name: 'CRNN', icon: ScanLine, category: 'OCR' },
  { name: 'MoveNet', icon: Eye, category: 'Pose Detection' },
  { name: 'TorchScript', icon: Cpu, category: 'Model Ops' },
  { name: 'Triton', icon: Zap, category: 'Inference Server' },
  { name: 'Weights & Biases', icon: Network, category: 'Experiment Tracking' },
  { name: 'Jupyter', icon: SiJupyter, category: 'Notebook' },
];

// ── Proficiency tiers ─────────────────────────────────────────────────────────
const TIERS = [
  {
    level: 'Expert',
    icon: CheckCircle,
    color: 'text-primary',
    bg: 'bg-primary/8 border-primary/20',
    dot: 'bg-primary',
    description: 'Daily use · Production experience · Architecture decisions',
    skills: [
      'Python 3.x', 'PyTorch', 'OpenCV', 'NumPy',
      'YOLOv8 / YOLO series', 'U-Net', 'ONNX', 'FastAPI',
      'Custom loss functions', 'Ablation studies',
    ],
  },
  {
    level: 'Proficient',
    icon: Circle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    dot: 'bg-emerald-500',
    description: 'Production shipped · Comfortable solo',
    skills: [
      'CUDA / cuDNN', 'Docker', 'TorchScript', 'ArcFace',
      'DeepSORT', 'CRNN + CTC', 'ESRGAN', 'SlowFast',
      'CLIP ViT-L/14', 'FAISS IVF-PQ', 'ViTPose', 'DPT / MiDaS',
      'INT8 / FP16 quantization', 'Weights & Biases',
    ],
  },
  {
    level: 'Familiar',
    icon: Minus,
    color: 'text-amber-500',
    bg: 'bg-amber-500/8 border-amber-500/20',
    dot: 'bg-amber-500',
    description: 'Side projects · Active learning',
    skills: [
      'BEVFusion', 'PointPillars', 'MoveNet', 'MediaPipe',
      'Triton Inference Server', 'StyleGAN2', 'HuggingFace Transformers',
      'SegFormer', 'nuScenes SDK', 'Kubernetes (basics)',
      'Prometheus / Grafana', 'React (this site)',
    ],
  },
] as const;

function Chip({ name, icon: Icon, category }: { name: string; icon: React.ElementType; category: string }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 glass-card rounded-xl border border-card-border group hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-default mx-2">
      <Icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      <div>
        <p className="font-mono text-sm font-medium text-foreground leading-none">{name}</p>
        <p className="font-mono text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{category}</p>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: typeof ROW_ONE; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden marquee-row">
      <div className={`flex w-max ${reverse ? 'animate-marquee-right' : 'animate-marquee-left'}`}>
        {doubled.map((item, i) => (
          <Chip key={`${item.name}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">08. Tech Stack</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground font-mono text-sm mt-4"
        >
          Hover any row to pause · 24 tools across the full CV pipeline
        </motion.p>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <MarqueeRow items={ROW_ONE} />
        <MarqueeRow items={ROW_TWO} reverse />
      </motion.div>

      {/* Proficiency tier grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest mb-6"
        >
          Depth breakdown
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((tier, ti) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ti * 0.1 }}
                className={`glass-card rounded-xl p-6 border ${tier.bg}`}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <Icon className={`w-4 h-4 ${tier.color}`} />
                  <h3 className={`font-mono font-bold text-sm ${tier.color}`}>{tier.level}</h3>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mb-4 uppercase tracking-wider leading-relaxed">
                  {tier.description}
                </p>
                <ul className="space-y-2">
                  {tier.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 font-mono text-xs text-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tier.dot}`} />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
