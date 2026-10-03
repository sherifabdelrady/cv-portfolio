/**
 * Generates public/sherif-abdelrady-cv.pdf
 * Run: cd artifacts/cv-portfolio && node --loader tsx/esm scripts/generate-cv.tsx
 * Or:  cd artifacts/cv-portfolio && ./node_modules/.bin/tsx scripts/generate-cv.tsx
 */
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToFile,
  Font,
} from '@react-pdf/renderer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Palette ──────────────────────────────────────────────────────────────────
const NAVY  = '#0F172A';
const BLUE  = '#3B82F6';
const GRAY  = '#64748B';
const LGRAY = '#CBD5E1';
const WHITE = '#FFFFFF';
const BG    = '#F8FAFC';

// ── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    fontFamily: 'Helvetica',
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    fontSize: 9,
    color: NAVY,
    lineHeight: 1.45,
  },

  // Header
  header: { marginBottom: 14 },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: NAVY, letterSpacing: 0.5 },
  titleLine: { fontSize: 10, color: BLUE, marginTop: 2, fontFamily: 'Helvetica-Bold', letterSpacing: 0.3 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 5, fontSize: 8, color: GRAY },
  divider: { height: 1.5, backgroundColor: BLUE, marginVertical: 10, borderRadius: 1 },

  // Section
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: BLUE,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 5,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: LGRAY,
  },
  section: { marginBottom: 10 },

  // Summary
  summaryText: { fontSize: 8.5, color: NAVY, lineHeight: 1.55 },

  // Experience
  roleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  roleTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: NAVY },
  rolePeriod: { fontSize: 8, color: GRAY },
  roleOrg: { fontSize: 8.5, color: BLUE, marginBottom: 4 },
  bullet: { flexDirection: 'row', marginBottom: 2, paddingLeft: 2 },
  bulletDot: { fontSize: 8, color: BLUE, marginRight: 5, marginTop: 0.5 },
  bulletText: { fontSize: 8.5, color: NAVY, flex: 1, lineHeight: 1.45 },

  // Projects — two columns
  projectsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  projectCard: {
    width: '48.5%',
    backgroundColor: BG,
    borderRadius: 3,
    padding: 7,
    borderWidth: 0.5,
    borderColor: LGRAY,
  },
  projectTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2 },
  projectMetrics: { fontSize: 7.5, color: BLUE, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  projectNote: { fontSize: 7.5, color: GRAY, lineHeight: 1.4 },

  // Stack — tag cloud rows
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 3 },
  tagLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GRAY, marginRight: 4, marginTop: 1.5 },
  tag: {
    backgroundColor: BG,
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 7.5,
    color: NAVY,
    borderWidth: 0.5,
    borderColor: LGRAY,
  },

  // Foundations
  foundRow: { flexDirection: 'row', marginBottom: 2, paddingLeft: 2 },
  foundDot: { fontSize: 8, color: BLUE, marginRight: 5, marginTop: 0.5 },
  foundText: { fontSize: 8.5, color: NAVY, flex: 1, lineHeight: 1.45 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: LGRAY,
  },
});

// ── Data ──────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: 'MediScan — Medical Classifier',
    metrics: '97.3% acc · AUC 0.99 · F1 0.96',
    note: 'Focal Loss (γ=2.0) lifted COVID-19 sensitivity 78→91%. NIH Chest X-ray 14 (112K images).',
  },
  {
    title: 'UrbanSense — Object Detection',
    metrics: 'mAP 0.891 · 45 FPS @ 1080p',
    note: 'Modified anchor-free head; INT8 ONNX export: 3.1× speedup, −0.6% mAP. COCO + custom data.',
  },
  {
    title: 'SegForge — Semantic Segmentation',
    metrics: 'mIoU 0.843 · pixel acc 94.1%',
    note: 'U-Net + ASPP multi-scale context. +3.1% mIoU over DeepLabV3+ on Cityscapes.',
  },
  {
    title: 'FaceVault — Face Recognition',
    metrics: 'TAR 99.2% @ FAR 0.1%',
    note: 'ArcFace (m=0.5, s=64) angular margin embeddings. Spoof detection 98.7% on NuaaFD.',
  },
  {
    title: 'TrackMaster — Multi-Object Tracking',
    metrics: 'MOTA 0.812 · IDF1 0.784',
    note: 'Adaptive IoU/appearance cost α reduced ID switches 412→124 on MOT17.',
  },
  {
    title: 'DocuAI — OCR & Document AI',
    metrics: 'Word acc 96.4% · F1 0.94',
    note: 'CTC decoder (no alignment labels, 3× faster training). CRAFT polygon detection for rotated text.',
  },
];

const STACK = [
  { label: 'Core', tags: ['Python', 'PyTorch', 'OpenCV', 'NumPy', 'CUDA / cuDNN'] },
  { label: 'Models', tags: ['YOLOv8', 'U-Net', 'SegFormer', 'ArcFace', 'ESRGAN', 'SlowFast', 'DeepSORT'] },
  { label: 'Deploy', tags: ['ONNX', 'TorchScript', 'FastAPI', 'Docker', 'Triton Inference Server', 'INT8 / FP16'] },
  { label: 'Tooling', tags: ['Weights & Biases', 'HuggingFace', 'scikit-learn', 'Git', 'Linux', 'Jupyter'] },
];

const FOUNDATIONS = [
  'Reimplemented YOLOv1→v8 from first principles to understand anchor and loss evolution across generations.',
  'Profiled CUDA kernels with Nsight; empirical INT8 PTQ vs QAT ablations across 6 backbone families.',
  '~120 annotated CV/ML papers (CVPR · ICCV · NeurIPS); reproduced key results in personal research env.',
  'Studied seminal works: Attention is All You Need · MAE · DINOv2 · SAM · CLIP.',
];

// ── Document ──────────────────────────────────────────────────────────────────
function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bullet}>
      <Text style={s.bulletDot}>▸</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

function CV() {
  return (
    <Document
      title="Sherif Abd El-Rady — CV"
      author="Sherif Abd El-Rady"
      subject="AI Engineer · Computer Vision Specialist"
      creator="sherif-abdelrady.dev"
    >
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          <Text style={s.name}>Sherif Abd El-Rady</Text>
          <Text style={s.titleLine}>AI Engineer · Computer Vision &amp; Deep Learning</Text>
          <View style={s.contactRow}>
            <Text>sherifabdelrady@gmail.com</Text>
            <Text>github.com/sherifabdelrady</Text>
            <Text>linkedin.com/in/sherif-abd-el-rady</Text>
            <Text>Remote · Available for freelance &amp; full-time</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── SUMMARY ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Summary</Text>
          <Text style={s.summaryText}>
            Self-directed AI and Computer Vision engineer who owns the full pipeline — from dataset curation and
            annotation strategy through custom architecture design, training, and production deployment.
            I modify detection heads, design domain-specific loss functions, and run ablation studies to
            measure what each decision actually contributes. Built 14 end-to-end CV systems across medical
            imaging, urban analytics, industrial inspection, and document intelligence.
            Available for freelance projects and remote full-time roles in applied AI engineering.
          </Text>
        </View>

        {/* ── EXPERIENCE ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experience</Text>

          <View style={s.roleRow}>
            <Text style={s.roleTitle}>Independent Computer Vision Engineer</Text>
            <Text style={s.rolePeriod}>2023 – Present</Text>
          </View>
          <Text style={s.roleOrg}>Freelance · Remote · Engagement domains: Medical Imaging · Urban Analytics · Industrial Inspection · Document Intelligence</Text>

          <Bullet text="Own the complete pipeline — data curation, annotation strategy, architecture design, training, and production deployment across 3+ client projects." />
          <Bullet text="Modified detection heads and designed domain-specific loss functions; ran ablation studies to quantify the contribution of each architectural decision." />
          <Bullet text="Reduced model inference latency 40% via INT8 quantization and ONNX export with zero measurable accuracy regression on held-out test sets." />
          <Bullet text="Deployed real-time inference APIs on FastAPI + Docker; instrumented Prometheus metrics for data distribution drift detection in production." />
        </View>

        {/* ── PROJECTS ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Selected Projects</Text>
          <View style={s.projectsGrid}>
            {PROJECTS.map((p) => (
              <View key={p.title} style={s.projectCard}>
                <Text style={s.projectTitle}>{p.title}</Text>
                <Text style={s.projectMetrics}>{p.metrics}</Text>
                <Text style={s.projectNote}>{p.note}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── STACK ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Technical Stack</Text>
          {STACK.map((row) => (
            <View key={row.label} style={s.tagRow}>
              <Text style={s.tagLabel}>{row.label}</Text>
              {row.tags.map((tag) => (
                <Text key={tag} style={s.tag}>{tag}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* ── FOUNDATIONS ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Technical Foundations · Self-Directed Learning</Text>
          {FOUNDATIONS.map((f, i) => (
            <View key={i} style={s.foundRow}>
              <Text style={s.foundDot}>▸</Text>
              <Text style={s.foundText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* ── FOOTER ── */}
        <View style={s.footer} fixed>
          <Text>Sherif Abd El-Rady · AI Engineer · sherifabdelrady@gmail.com</Text>
          <Text>github.com/sherifabdelrady · linkedin.com/in/sherif-abd-el-rady</Text>
        </View>

      </Page>
    </Document>
  );
}

// ── Render ────────────────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, '..', 'public', 'sherif-abdelrady-cv.pdf');
console.log('Generating CV PDF…');
renderToFile(<CV />, outPath).then(() => {
  console.log(`✓ Written to ${outPath}`);
}).catch((err: Error) => {
  console.error('PDF generation failed:', err.message);
  process.exit(1);
});
