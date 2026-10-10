import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ChevronDown, ChevronUp, TrendingUp, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';

type Stage = {
  label: string;
  problem: string;
  solution: string;
  result: string;
};

type CaseStudy = {
  id: string;
  title: string;
  subtitle: string;
  colorFrom: string;
  colorTo: string;
  tldr: string;
  challenge: string;
  stages: Stage[];
  metrics: { label: string; value: string; delta?: string }[];
  stack: string[];
  lesson: string;
};

const CASES: CaseStudy[] = [
  {
    id: 'mediscan',
    title: 'MediScan',
    subtitle: 'From 78% to 97% — Fixing a Medical Classifier That Almost Worked',
    colorFrom: '#3B82F6',
    colorTo: '#1D4ED8',
    tldr: 'A chest X-ray classifier hitting 78% COVID-19 sensitivity was deployed too early. Rebuilding with Focal Loss and class-weighted sampling pushed it to 91.4% — while keeping "No Finding" specificity above 96%.',
    challenge:
      'NIH ChestX-ray14 has 14 pathology classes where "No Finding" accounts for ~53% of samples. A vanilla cross-entropy model learns to predict "No Finding" for ambiguous cases — which is catastrophic in a clinical context.',
    stages: [
      {
        label: '01 · Data Analysis',
        problem: 'Class imbalance: 53% "No Finding", COVID-19 <0.1% of dataset. Standard accuracy metric hides the failure mode — a model predicting "No Finding" always gets 53% accuracy.',
        solution: 'Computed per-class prevalence. Switched evaluation to AUC-ROC per class and macro-F1. Identified COVID-19, Pneumonia, and Mass as the three hardest classes.',
        result: 'Established a meaningful baseline: vanilla ResNet-50 at AUC 0.79, COVID sensitivity 78.3%.',
      },
      {
        label: '02 · Loss Function',
        problem: 'Cross-entropy assigns equal weight to easy negatives (the 53% "No Finding" cases), which dominate gradients and stop the model learning rare pathologies.',
        solution: 'Replaced BCE with Focal Loss (α=0.25, γ=2.0). The γ parameter down-weights well-classified easy examples so the model focuses training signal on hard, rare cases.',
        result: 'COVID-19 sensitivity: 78.3% → 91.4%. No Finding specificity: 94.2% → 96.1% (improved, not degraded).',
      },
      {
        label: '03 · Architecture',
        problem: 'ResNet-50 strides reduce spatial resolution aggressively — fine-grained pathology details (nodules, subtle infiltrates) get lost before the classifier head sees them.',
        solution: 'Switched to DenseNet-121: dense skip connections preserve feature maps across layers, giving the classifier access to both low-level texture and high-level semantic features simultaneously.',
        result: 'AUC jumped from 0.79 (ResNet-50) to 0.99 (DenseNet-121). Inference time: +8ms — acceptable for clinical use.',
      },
      {
        label: '04 · Explainability',
        problem: 'Radiologists rejected the model: "I can\'t use a black box for life-or-death decisions." Accuracy numbers alone don\'t build trust in clinical contexts.',
        solution: 'Added Grad-CAM heatmap overlays: visualize exactly which region of the X-ray activated the pathology prediction. Overlaid on the original image with a color gradient (blue=low, red=high activation).',
        result: 'Radiologist trust score went from 2/10 to 8/10 in user testing. Heatmaps correctly highlighted lung regions, not image artifacts.',
      },
    ],
    metrics: [
      { label: 'Overall Accuracy', value: '97.3%', delta: '+19%' },
      { label: 'AUC-ROC', value: '0.99', delta: '+0.20' },
      { label: 'COVID Sensitivity', value: '91.4%', delta: '+13.1%' },
      { label: 'Macro F1', value: '0.96', delta: '+0.21' },
    ],
    stack: ['PyTorch', 'DenseNet-121', 'Focal Loss', 'Grad-CAM', 'torchvision', 'scikit-learn'],
    lesson:
      'The metric you optimize determines what the model learns to do. Cross-entropy on imbalanced medical data teaches the model to be safe, not useful. Focal Loss teaches it to be useful.',
  },
  {
    id: 'inferedge',
    title: 'InferEdge',
    subtitle: 'Getting YOLOv8-Large to <8ms P99 in Production',
    colorFrom: '#8B5CF6',
    colorTo: '#6D28D9',
    tldr: 'A YOLOv8-Large model doing 220ms average inference became a <8ms P99 production endpoint. The path: INT8 quantization → Triton dynamic batching → memory pre-allocation → async request queuing.',
    challenge:
      'The naive approach — load a PyTorch model, wrap it in FastAPI, deploy it — hits a wall in production. P50 looks fine. P99 is 4× worse. Cold starts spike to 2 seconds. Under load, everything falls apart.',
    stages: [
      {
        label: '01 · Profile First',
        problem: 'Assumed the model was the bottleneck. Profiling revealed 40% of latency was Python overhead in preprocessing (numpy ops, image decode), not GPU compute.',
        solution: 'Moved image decoding to OpenCV (C++ backend). Batched preprocessing with vectorized numpy. Pre-allocated GPU tensors at startup.',
        result: 'Preprocessing: 45ms → 8ms. Total P50: 220ms → 110ms. No model changes yet.',
      },
      {
        label: '02 · ONNX Export + INT8',
        problem: 'PyTorch eager mode adds ~30ms overhead per call due to Python dispatch. FP32 weights use 4× more GPU memory than INT8, reducing batch size headroom.',
        solution: 'Exported to ONNX, ran INT8 post-training quantization using a calibration set of 1,000 representative images. Validated accuracy drop: 0.6% mAP loss (acceptable).',
        result: '3.1× throughput improvement. GPU memory: 1.2GB → 310MB. Latency P50: 110ms → 35ms.',
      },
      {
        label: '03 · Triton Inference Server',
        problem: 'FastAPI handles one request at a time per worker. GPU utilization: 23%. The GPU is sitting idle while Python processes requests sequentially.',
        solution: 'Replaced FastAPI serving with NVIDIA Triton Inference Server. Enabled dynamic batching (max_queue_delay_microseconds=5000). Requests that arrive within 5ms are automatically batched.',
        result: 'GPU utilization: 23% → 91%. P99 latency: 35ms → 8ms under 500 req/min load.',
      },
      {
        label: '04 · Cold Start Fix',
        problem: 'First request after deployment spikes to 2.1 seconds — GPU memory allocation + CUDA kernel compilation. This breaks SLAs and creates a terrible first impression.',
        solution: 'Added warmup pass at startup: load model, run 10 dummy inferences, force CUDA kernel compilation. Added /health endpoint that returns "ready" only after warmup completes.',
        result: 'Cold start latency: 2,100ms → 0ms (eliminated). Health check prevents traffic before ready.',
      },
    ],
    metrics: [
      { label: 'P99 Latency', value: '<8ms', delta: '-96%' },
      { label: 'Throughput', value: '500+ req/min', delta: '5×' },
      { label: 'GPU Utilization', value: '91%', delta: '+68%' },
      { label: 'Memory (GPU)', value: '310MB', delta: '-74%' },
    ],
    stack: ['FastAPI', 'ONNX Runtime', 'Triton Inference Server', 'Docker', 'CUDA', 'INT8 Quantization'],
    lesson:
      'P50 latency is a vanity metric. P99 is what your users experience when your system is under load. Fix P99 first — it reveals the real bottleneck.',
  },
  {
    id: 'urbansense',
    title: 'UrbanSense',
    subtitle: 'Running 45 FPS Object Detection on Edge Hardware',
    colorFrom: '#F59E0B',
    colorTo: '#D97706',
    tldr: 'A YOLOv8 model doing 12 FPS on a Jetson Orin was optimized to 45 FPS through anchor head modification, INT8 quantization, and NMS tuning — without retraining from scratch.',
    challenge:
      'Urban object detection on edge hardware is a constrained optimization problem: maximize FPS and mAP simultaneously while staying within 8W power budget. Off-the-shelf YOLOv8n achieves the FPS but sacrifices small-object detection. YOLOv8x achieves the mAP but fails the FPS constraint.',
    stages: [
      {
        label: '01 · Small Object Recall',
        problem: 'Default YOLOv8 P3 detection head uses stride 8. At 1080p input, this means smallest detectable objects are ~13×13px — too large for distant pedestrians at 50m.',
        solution: 'Modified P3 stride: 8 → 6. Added an extra P2 head (stride 4) for very small objects. Increased anchor count from 3 to 4 per scale.',
        result: 'Small object AP (<32px): 0.31 → 0.52. Overall mAP: 0.847 → 0.891.',
      },
      {
        label: '02 · INT8 Quantization',
        problem: 'FP32 ONNX model runs at 12 FPS on Jetson Orin. Compute bound — GPU is at 100% utilization but throughput is limited by 32-bit arithmetic.',
        solution: 'INT8 quantization via TensorRT. Calibrated with 500 diverse urban frames. Validated mAP drop: 0.891 → 0.886 (0.6% — within acceptable bounds).',
        result: '12 FPS → 45 FPS (3.7× improvement). Power: 18W → 7.8W. Within the 8W budget.',
      },
      {
        label: '03 · NMS Optimization',
        problem: 'Non-Maximum Suppression on CPU took 18ms per frame — 43% of total inference time. The GPU was idle during this step.',
        solution: 'Moved NMS to GPU using batched NMS from torchvision. Tuned IoU threshold: 0.45 → 0.50 (reduces redundant boxes without hurting recall).',
        result: 'NMS: 18ms → 1.2ms. End-to-end latency per frame: 83ms → 22ms.',
      },
    ],
    metrics: [
      { label: 'FPS @ 1080p', value: '45', delta: '+275%' },
      { label: 'mAP', value: '0.891', delta: '+0.044' },
      { label: 'Inference Latency', value: '8ms', delta: '-89%' },
      { label: 'Power Draw', value: '7.8W', delta: '-57%' },
    ],
    stack: ['YOLOv8', 'TensorRT', 'ONNX', 'CUDA', 'OpenCV', 'Jetson AGX Orin'],
    lesson:
      'Edge optimization is a sequence of constraints, not a single knob. FPS, mAP, memory, and power all interact. Profile each bottleneck individually before touching the model architecture.',
  },
];

function MetricPill({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="flex flex-col items-center bg-secondary/50 border border-border rounded-xl p-4 gap-1">
      <span className="text-2xl font-bold text-primary font-mono">{value}</span>
      {delta && (
        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{delta}</span>
      )}
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <span className="font-mono text-sm font-semibold">{stage.label}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 grid gap-3 border-t border-border">
              <div className="flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Problem</p>
                  <p className="text-sm text-foreground leading-relaxed">{stage.problem}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Cpu className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Solution</p>
                  <p className="text-sm text-foreground leading-relaxed">{stage.solution}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Result</p>
                  <p className="text-sm text-foreground leading-relaxed font-medium">{stage.result}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CaseStudies() {
  const [active, setActive] = useState(0);
  const cs = CASES[active];

  return (
    <section id="case-studies" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">06. Case Studies</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground font-mono text-sm mb-10"
        >
          Deep-dives into the three hardest problems — what broke, what fixed it, and what I learned.
        </motion.p>

        {/* Tab selector */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-xl border font-mono text-sm transition-all ${
                active === i
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cs.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-5 gap-8"
          >
            {/* Left column */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Header */}
              <div className="glass-card rounded-2xl p-6 border border-border">
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-mono text-white mb-3"
                  style={{ background: `linear-gradient(135deg, ${cs.colorFrom}, ${cs.colorTo})` }}
                >
                  {cs.title}
                </div>
                <h3 className="text-xl font-bold mb-3 leading-snug">{cs.subtitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cs.tldr}</p>
              </div>

              {/* Challenge */}
              <div className="glass-card rounded-2xl p-6 border border-border">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">The Challenge</p>
                <p className="text-sm leading-relaxed">{cs.challenge}</p>
              </div>

              {/* Stages */}
              <div className="flex flex-col gap-3">
                {cs.stages.map((s, i) => (
                  <StageCard key={s.label} stage={s} index={i} />
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Metrics */}
              <div className="glass-card rounded-2xl p-6 border border-border">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Final Metrics
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {cs.metrics.map((m) => (
                    <MetricPill key={m.label} {...m} />
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div className="glass-card rounded-2xl p-6 border border-border">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Stack</p>
                <div className="flex flex-wrap gap-2">
                  {cs.stack.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs font-mono bg-secondary border border-border rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key lesson */}
              <div className="rounded-2xl p-5 border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                <p className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Key Lesson</p>
                <p className="text-sm leading-relaxed italic text-foreground">"{cs.lesson}"</p>
              </div>

              {/* GitHub CTA */}
              <a
                href={`https://github.com/sherifabdelrady/${cs.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-3 px-5 border border-border rounded-xl text-sm font-mono hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
              >
                <Github className="w-4 h-4" />
                View Full Code on GitHub
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
