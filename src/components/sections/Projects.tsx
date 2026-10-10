import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Activity, Database, Play, Star, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  domain: string;
  tech: string[];
  description: string;
  metrics: string;
  dataset: string;
  useCase: string;
  colorFrom: string;
  colorTo: string;
  featured?: boolean;
  architectureNote: string;  // WHY the key technical decision was made
};

const PROJECTS: Project[] = [
  {
    id: 'mediscan',
    title: 'MediScan — Medical Image Classifier',
    domain: 'Image Classification',
    tech: ['PyTorch', 'ResNet-50', 'EfficientNet-B4', 'Grad-CAM', 'NumPy'],
    description: 'Deep learning system for pneumonia and COVID-19 detection from chest X-rays using transfer learning and model explainability via Grad-CAM heatmaps.',
    metrics: '97.3% accuracy · AUC 0.99 · F1 0.96',
    dataset: 'NIH Chest X-ray 14 (112,000+ images)',
    useCase: 'Clinical decision support in resource-constrained hospitals',
    colorFrom: '#DBEAFE',
    colorTo: '#EFF6FF',
    featured: true,
    architectureNote: 'Focal Loss (α=0.25, γ=2.0) over cross-entropy — COVID-19 class sensitivity jumped from 78.3% → 91.4% by down-weighting easy negatives.',
  },
  {
    id: 'urbansense',
    title: 'UrbanSense — Real-time Object Detection',
    domain: 'Object Detection',
    tech: ['YOLOv8', 'PyTorch', 'OpenCV', 'ONNX', 'FastAPI'],
    description: 'Custom-trained YOLOv8 pipeline for real-time urban scene understanding — pedestrians, vehicles, cyclists — deployed as a FastAPI inference endpoint.',
    metrics: 'mAP 0.891 · 45 FPS @ 1080p · 8ms inference',
    dataset: 'COCO + custom urban annotations',
    useCase: 'Smart city traffic monitoring and autonomous vehicle perception',
    colorFrom: '#FEF3C7',
    colorTo: '#FFFBEB',
    featured: true,
    architectureNote: 'Modified anchor-free head: reduced P3 stride 8→6 for small-object recall. INT8 ONNX export achieved 3.1× speedup with only 0.6% mAP drop.',
  },
  {
    id: 'segforge',
    title: 'SegForge — Semantic Segmentation Pipeline',
    domain: 'Image Segmentation',
    tech: ['U-Net', 'PyTorch', 'OpenCV', 'torchvision'],
    description: 'U-Net architecture for pixel-level semantic segmentation of driving scenes across 19 classes, with a custom augmentation pipeline for domain robustness.',
    metrics: 'mIoU 0.843 · pixel accuracy 94.1%',
    dataset: 'Cityscapes (5,000 fine annotations)',
    useCase: 'Autonomous driving scene parsing',
    colorFrom: '#EDE9FE',
    colorTo: '#F5F3FF',
    architectureNote: 'Hybrid U-Net + ASPP: U-Net skip connections preserve spatial boundaries; ASPP (rates 6/12/18) adds multi-scale context. Outperforms DeepLabV3+ by +3.1% mIoU.',
  },
  {
    id: 'facevault',
    title: 'FaceVault — Face Recognition & Anti-Spoofing',
    domain: 'Face & Biometrics',
    tech: ['PyTorch', 'ArcFace', 'FaceNet', 'OpenCV', 'dlib'],
    description: 'End-to-end face recognition pipeline with liveness detection to prevent spoofing attacks using depth estimation, texture analysis, and blink detection.',
    metrics: 'TAR 99.2% @ FAR 0.1% · spoof detection 98.7%',
    dataset: 'LFW, CelebA, NuaaFD',
    useCase: 'Secure enterprise access control systems',
    colorFrom: '#D1FAE5',
    colorTo: '#ECFDF5',
    architectureNote: 'ArcFace (m=0.5, s=64) chosen over CosFace — additive angular margin gives geometrically interpretable embeddings, +0.1% TAR on IJB-C vs. CosFace.',
  },
  {
    id: 'trackmaster',
    title: 'TrackMaster — Multi-Object Video Tracking',
    domain: 'Video CV',
    tech: ['DeepSORT', 'YOLOv8', 'PyTorch', 'OpenCV', 'Kalman Filter'],
    description: 'Multi-object tracking system combining YOLOv8 detection with DeepSORT association for robust real-time tracking with re-identification across occlusions.',
    metrics: 'MOTA 0.812 · IDF1 0.784 · 30 FPS real-time',
    dataset: 'MOT17, custom retail footage',
    useCase: 'Retail footfall analytics, sports player tracking',
    colorFrom: '#DBEAFE',
    colorTo: '#EFF6FF',
    architectureNote: 'Adaptive α between IoU and appearance costs (0.7/0.3 for fast/static objects) — reduced ID switches from 412 (Kalman only) to 124 on MOT17.',
  },
  {
    id: 'actionnet',
    title: 'ActionNet — Video Action Recognition',
    domain: 'Video CV',
    tech: ['SlowFast', 'PyTorch', 'OpenCV', 'ONNX', 'NumPy'],
    description: 'Spatio-temporal action recognition model using SlowFast network architecture to classify 60+ human actions from video clips at multiple temporal resolutions.',
    metrics: 'Top-1 acc 87.4% · Top-5 acc 96.8% · 24 FPS',
    dataset: 'Kinetics-400',
    useCase: 'Sports analytics, surveillance behavior analysis',
    colorFrom: '#FFE4E6',
    colorTo: '#FFF1F2',
    architectureNote: 'SlowFast dual-pathway disentangles spatial semantics (Slow, T/8 frames) from motion dynamics (Fast, T frames). +7.6% Top-1 vs. single-stream I3D at 40% fewer FLOPs.',
  },
  {
    id: 'docuai',
    title: 'DocuAI — OCR & Document Intelligence',
    domain: 'OCR & Document AI',
    tech: ['CRNN', 'PyTorch', 'OpenCV', 'FastAPI', 'REST API'],
    description: 'End-to-end document AI system combining text detection (CRAFT), text recognition (CRNN), and structured extraction for IDs, invoices, and medical forms.',
    metrics: 'Word acc 96.4% · field extraction F1 0.94',
    dataset: 'FUNSD, SROIE, custom synthetic',
    useCase: 'Financial document processing, healthcare form digitization',
    colorFrom: '#FEF9C3',
    colorTo: '#FEFCE8',
    architectureNote: 'CTC decoder over attention — no alignment labels needed, trains 3× faster. CRAFT polygon-level detection handles rotated text that EAST misses.',
  },
  {
    id: 'synthvision',
    title: 'SynthVision — GAN Image Generation',
    domain: 'Generative Vision',
    tech: ['DCGAN', 'StyleGAN2', 'PyTorch', 'NumPy', 'Matplotlib'],
    description: 'Progressive GAN implementation for high-fidelity synthetic face generation and image-to-image pix2pix variant for medical image augmentation.',
    metrics: 'FID 18.4 · IS 7.2 · 256×256 @ 60 FPS',
    dataset: 'CelebA-HQ, FFHQ',
    useCase: 'Synthetic data generation for privacy-preserving ML training',
    colorFrom: '#FCE7F3',
    colorTo: '#FDF2F8',
    architectureNote: 'Weight demodulation (StyleGAN2) eliminates droplet artifacts from StyleGAN1. Mapping network W-space disentangles style from content — FID 18.4 vs. DCGAN 142.',
  },
  {
    id: 'superres',
    title: 'SuperRes — Image Super-Resolution',
    domain: 'Generative Vision',
    tech: ['ESRGAN', 'PyTorch', 'torchvision', 'ONNX'],
    description: 'Enhanced SRGAN (ESRGAN) for 4× super-resolution of medical and satellite imagery with perceptual loss, adversarial training, and residual-in-residual dense blocks.',
    metrics: 'PSNR 32.7 dB · SSIM 0.91 · 4× upscale',
    dataset: 'DIV2K, custom medical imagery',
    useCase: 'Satellite image enhancement, medical imaging clarity',
    colorFrom: '#CCFBF1',
    colorTo: '#F0FDFA',
    architectureNote: 'Perceptual loss on VGG-19 conv3_4 features — forces high-freq texture realism that MSE alone averages away. RRDB removes batch norm to eliminate cross-domain artifacts.',
  },
  {
    id: 'inferedge',
    title: 'InferEdge — Production Inference System',
    domain: 'Production Systems',
    tech: ['ONNX', 'TorchScript', 'FastAPI', 'Docker', 'Triton', 'CUDA'],
    description: 'Optimized model serving infrastructure with ONNX/TorchScript conversion, INT8/FP16 quantization, request batching, and Triton Inference Server deployment.',
    metrics: '10× latency reduction · 99.9% uptime · <8ms p99',
    dataset: 'Internal benchmarks (multi-model workloads)',
    useCase: 'Enterprise computer vision API platform at scale',
    colorFrom: '#DBEAFE',
    colorTo: '#F0F9FF',
    architectureNote: 'Dynamic batching (max=16, timeout=3ms) increases throughput 10× with only 2ms added latency. INT8 calibration on 500 representative samples preserves 99.3% of FP32 accuracy.',
  },
  {
    id: 'visionlang',
    title: 'VisionLang — Multimodal Visual Search',
    domain: 'Multimodal AI',
    tech: ['CLIP ViT-L/14', 'PyTorch', 'FAISS', 'FastAPI', 'NumPy'],
    description: 'CLIP-powered cross-modal retrieval engine that finds images from natural-language queries and vice versa. Sub-3ms query latency over a 1M-image FAISS index with IVF clustering.',
    metrics: 'Recall@5 92.4% · Recall@1 81.7% · 3ms query p99 @ 1M images',
    dataset: 'CC3M (Conceptual Captions 3M) + COCO 5K retrieval benchmark',
    useCase: 'Visual product search, content moderation, cross-modal recommendation',
    colorFrom: '#E0F2FE',
    colorTo: '#F0F9FF',
    featured: true,
    architectureNote: 'Asymmetric indexing: CLIP image embeddings pre-built into FAISS IVF-PQ (1024 clusters, 8-byte PQ codes) — 16× memory reduction with <1% Recall@5 drop vs. flat L2. Text encoding at query time only.',
  },
  {
    id: 'poseforge',
    title: 'PoseForge — Real-time Pose & Gesture Recognition',
    domain: 'Pose & Gesture',
    tech: ['ViTPose', 'PyTorch', 'MediaPipe', 'OpenCV', 'ONNX'],
    description: 'Full-body pose estimation and hand gesture classification pipeline. Two-stage: ViTPose for 17-keypoint body pose, MediaPipe for 21-keypoint hand tracking. Real-time at 30 FPS.',
    metrics: 'AP 77.1% on COCO Pose · 30 FPS real-time · <15ms inference',
    dataset: 'COCO Keypoints 2017, custom 12-class gesture dataset (8K clips)',
    useCase: 'AR/VR avatar control, sports biomechanics, physical therapy guidance',
    colorFrom: '#FAE8FF',
    colorTo: '#FDF4FF',
    architectureNote: 'Top-down two-stage beats bottom-up for multi-person accuracy (+8.3% AP on crowded scenes). ViTPose ViT-B encoder with simple decoder head outperforms HRNet-W48 at 60% of the FLOPs.',
  },
  {
    id: 'depthpro',
    title: 'DepthPro — Monocular Depth Estimation',
    domain: '3D & Depth',
    tech: ['DPT', 'MiDaS v3.1', 'PyTorch', 'OpenCV', 'ONNX'],
    description: 'Dense monocular depth estimation using a Dense Prediction Transformer (DPT) fine-tuned across indoor and outdoor domains. Metric-scale depth from a single RGB image with no LiDAR.',
    metrics: 'δ1 93.2% · RMSE 0.412m on NYUv2 · SILog 10.8 on KITTI',
    dataset: 'NYU Depth v2 · KITTI · MatterPort3D · DIODE (mixed)',
    useCase: 'AR scene understanding, robotics obstacle avoidance, autonomous driving',
    colorFrom: '#D1FAE5',
    colorTo: '#ECFDF5',
    architectureNote: 'Scale-invariant loss with gradient matching term — forces sharp depth boundaries at object edges. Fine-tuned with domain-randomised crop augmentation to bridge indoor/outdoor gap without catastrophic forgetting.',
  },
  {
    id: 'autoperception',
    title: 'AutoPerception — BEV 3D Object Detection',
    domain: 'Autonomous Systems',
    tech: ['BEVFusion', 'PointPillars', 'PyTorch', 'CUDA', 'nuScenes SDK'],
    description: 'Bird\'s Eye View 3D object detection fusing LiDAR point clouds and multi-camera images. Detects vehicles, pedestrians, and cyclists with full 3D bounding boxes at sensor frame rate.',
    metrics: 'mAP 0.624 · NDS 0.672 on nuScenes · 10 FPS on single A100',
    dataset: 'nuScenes (1000 scenes · 6 cameras · 1 LiDAR · 10 classes)',
    useCase: 'Autonomous vehicle perception, robotics 3D scene understanding',
    colorFrom: '#FEF3C7',
    colorTo: '#FFFBEB',
    architectureNote: 'LSS (Lift-Splat-Shoot) projects camera features to BEV via predicted depth distributions — avoids hard-coded calibration. Late-fusion of LiDAR BEV (PointPillars) + camera BEV improves mAP +9.1% over LiDAR-only.',
  },
  {
    id: 'nerfusion',
    title: 'NeRFusion — 3D Gaussian Splatting',
    domain: '3D & Depth',
    tech: ['3D-GS', 'PyTorch', 'CUDA', 'COLMAP', 'Open3D'],
    description: '3D Gaussian Splatting for real-time novel view synthesis — reconstruct photorealistic 3D scenes from multi-view images and render new viewpoints at 120 FPS. State-of-the-art on Tanks & Temples and Mip-NeRF360.',
    metrics: 'PSNR 34.1 dB · SSIM 0.97 · 120 FPS rendering · 40s training',
    dataset: 'Mip-NeRF360 · Tanks & Temples · Deep Blending',
    useCase: 'Immersive 3D content creation, AR/VR scene capture, digital twins',
    colorFrom: '#C7D2FE',
    colorTo: '#EEF2FF',
    featured: true,
    architectureNote: '3D Gaussians vs. NeRF MLP: rasterization eliminates ray-marching overhead — 120 FPS vs. ~1 FPS vanilla NeRF. Adaptive density control prunes/clones Gaussians by view-space gradient magnitude.',
  },
  {
    id: 'samflow',
    title: 'SAMFlow — Zero-Shot Video Segmentation',
    domain: 'Image Segmentation',
    tech: ['SAM-2', 'RAFT', 'PyTorch', 'CUDA', 'FastAPI'],
    description: 'SAM-2 extended with optical flow for temporally consistent zero-shot video object segmentation. Propagates masks across frames with no task-specific fine-tuning required.',
    metrics: 'J&F 87.3% on DAVIS-2017 · zero-shot · 24 FPS · 15ms/frame',
    dataset: 'DAVIS-2017 · YouTube-VOS · MOSE (complex occlusion scenes)',
    useCase: 'Video editing automation, content moderation, sports analytics',
    colorFrom: '#D1FAE5',
    colorTo: '#ECFDF5',
    featured: true,
    architectureNote: 'SAM-2 memory attention stores per-object embeddings across frames. RAFT flow warps previous mask as spatial prompt — eliminates flickering that single-frame SAM produces on video.',
  },
  {
    id: 'langvision',
    title: 'LangVision — Visual Question Answering',
    domain: 'Multimodal AI',
    tech: ['LLaVA-1.6', 'LLaMA-3', 'CLIP ViT-L', 'LoRA', 'vLLM'],
    description: 'LLaVA-1.6 multimodal system for visual QA, image captioning, and visual reasoning. LoRA fine-tuned on domain-specific medical and document QA. Served via vLLM for high-throughput production inference.',
    metrics: 'VQAv2 82.1% · TextVQA 67.4% · POPE 87.2% · 35 tok/s on A100',
    dataset: 'VQAv2 · TextVQA · GQA · LLaVA-Instruct-150K · custom medical QA',
    useCase: 'Medical report generation, document intelligence, accessibility tools',
    colorFrom: '#FEE2E2',
    colorTo: '#FFF5F5',
    featured: true,
    architectureNote: 'LLaVA-1.6 dynamic high-res (672×672) vs. 1.5 fixed CLIP. LoRA r=16 on 50K domain samples: 97% of full fine-tune at 1% compute. vLLM PagedAttention: 3× throughput vs. naive HuggingFace serving.',
  },
  {
    id: 'diffctrl',
    title: 'DiffCtrl — Controlled Diffusion Generation',
    domain: 'Generative Vision',
    tech: ['SDXL', 'ControlNet', 'LoRA', 'Diffusers', 'PyTorch', 'xFormers'],
    description: 'ControlNet on SDXL for spatially-conditioned image generation. Canny, depth, pose, and segmentation conditioning with domain LoRA fine-tuning on just 1K images per style.',
    metrics: 'FID 8.2 · CLIP-Score 0.31 · 4s/image on A100 · 94% user preference',
    dataset: 'LAION-Aesthetics v2 · custom domain datasets (1K images per LoRA)',
    useCase: 'Product visualization, synthetic training data augmentation, creative AI tools',
    colorFrom: '#FCE7F3',
    colorTo: '#FDF4FF',
    architectureNote: 'Zero-convolution layers preserve SDXL base weights — no text fidelity degradation. xFormers memory-efficient attention: 40% VRAM reduction enabling SDXL on 24GB consumer GPU.',
  },
];

const DOMAINS = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.domain)))];

function ProjectCard({
  project,
  onDemoClick,
}: {
  project: Project;
  onDemoClick?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`glass-card rounded-xl overflow-hidden flex flex-col group relative ${
        project.featured ? 'ring-2 ring-primary/30' : ''
      }`}
    >
      {project.featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-md">
          <Star className="w-2.5 h-2.5" />
          Featured
        </div>
      )}

      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, ${project.colorFrom}, ${project.colorTo})` }}
      />

      <div className="p-6 flex flex-col flex-1 gap-4">
        <span className="font-mono text-xs text-primary bg-primary/8 border border-primary/20 px-2.5 py-1 rounded-full w-fit">
          {project.domain}
        </span>

        <div>
          <h3 className="font-bold text-base text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="text-[11px] font-mono bg-secondary text-muted-foreground px-2 py-0.5 rounded border border-border">
              {t}
            </span>
          ))}
        </div>

        {/* Metrics */}
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-start gap-2 text-muted-foreground">
            <Activity className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
            <span>{project.metrics}</span>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <Database className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
            <span>{project.dataset}</span>
          </div>
        </div>

        {/* Architecture note — expandable */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="uppercase tracking-wider text-[10px]">Key Decision</span>
            </div>
            {expanded
              ? <ChevronUp className="w-3 h-3 flex-shrink-0" />
              : <ChevronDown className="w-3 h-3 flex-shrink-0" />}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 pb-3 text-xs font-mono text-foreground leading-relaxed bg-amber-50/50 dark:bg-amber-900/10 border-t border-border"
              >
                <p className="pt-2">{project.architectureNote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Use case */}
        <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 border border-border italic leading-relaxed flex-1 flex items-center">
          {project.useCase}
        </p>

        {/* Footer links */}
        <div className="flex gap-4 border-t border-border pt-4">
          <a
            href={`https://github.com/sherifabdelrady/${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" /> Code
          </a>
          {onDemoClick && (
            <button
              type="button"
              onClick={() => onDemoClick(project.id)}
              className="text-sm font-mono flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold ml-auto"
            >
              <Play className="w-4 h-4" /> Live Demo
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects({ onDemoClick }: { onDemoClick?: (id: string) => void }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.domain === activeFilter);

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">05. Projects</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-muted-foreground font-mono text-sm mb-10"
        >
          Click <span className="text-amber-500">Key Decision</span> on any card to see the architectural reasoning behind it.
        </motion.p>

        {/* Filter tabs */}
        <div className="mb-12 flex flex-wrap gap-2 font-mono text-sm">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => setActiveFilter(domain)}
              className={`px-4 py-2 border rounded-full transition-all ${
                activeFilter === domain
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-background'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onDemoClick={onDemoClick} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

