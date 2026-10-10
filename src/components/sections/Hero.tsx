import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Github, ChevronDown, Linkedin, Sparkles, ArrowRight } from 'lucide-react';

/* ─── Neural network particle canvas ─────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const isDark = () => document.documentElement.classList.contains('dark');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Nodes
    const N = Math.min(60, Math.floor(window.innerWidth / 22));
    interface Node { x: number; y: number; vx: number; vy: number; r: number; pulse: number; }
    const nodes: Node[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI * 2,
    }));

    const CONNECT_DIST = 160;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dark = isDark();
      const nodeColor  = dark ? 'rgba(129,140,248,' : 'rgba(99,102,241,';
      const edgeColor  = dark ? 'rgba(129,140,248,' : 'rgba(99,102,241,';

      // Update & draw nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.pulse += 0.018;

        const pulse = 0.7 + 0.3 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${nodeColor}${0.55 * pulse})`;
        ctx.fill();
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `${edgeColor}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  );
}

/* ─── Typing animation for rotating titles ───────────────────────────────── */
const TITLES = [
  'Computer Vision Engineer',
  'Deep Learning Architect',
  'ML Systems Builder',
  'Edge Inference Specialist',
  'Multimodal AI Engineer',
];

function TypingTitle() {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = TITLES[titleIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIdx((i) => (i + 1) % TITLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, titleIdx]);

  return (
    <span className="text-gradient-primary font-heading">
      {displayed}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}

/* ─── Floating metric card ───────────────────────────────────────────────── */
function MetricFloat({
  value, label, delay, className
}: { value: string; label: string; delay: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring' }}
      className={`absolute glass-card neon-border rounded-2xl px-4 py-3 flex flex-col items-center gap-0.5 select-none pointer-events-none ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-xl font-bold font-mono text-gradient-primary leading-none">{value}</span>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

/* ─── Code snippet ───────────────────────────────────────────────────────── */
const SNIPPET = [
  { c: 'comment', t: '# production inference · zero-cost cold start' },
  { c: 'kw', t: 'from' }, { c: 'mod', t: ' inferedge' }, { c: 'kw', t: ' import' }, { c: 'def', t: ' Engine' },
  { c: 'blank', t: '' },
  { c: 'comment', t: '# INT8 · Triton batching · <8ms P99' },
  { c: 'def', t: 'engine = Engine(' },
  { c: 'indent', t: '  model' }, { c: 'op', t: '=' }, { c: 'str', t: '"yolov8x-int8"' }, { c: 'def', t: ',' },
  { c: 'indent', t: '  backend' }, { c: 'op', t: '=' }, { c: 'str', t: '"triton"' }, { c: 'def', t: ',' },
  { c: 'indent', t: '  device' }, { c: 'op', t: '=' }, { c: 'str', t: '"cuda:0"' },
  { c: 'def', t: ')' },
  { c: 'blank', t: '' },
  { c: 'comment', t: '# → 23 detections · mAP 0.891 · p99 7.2ms' },
  { c: 'def', t: 'result = engine.infer(frame)' },
];

const TOKEN_COLORS: Record<string, string> = {
  comment: 'text-slate-500',
  kw:      'text-violet-500 dark:text-violet-400 font-semibold',
  mod:     'text-blue-500 dark:text-blue-400',
  def:     'text-slate-700 dark:text-slate-200',
  str:     'text-emerald-600 dark:text-emerald-400',
  op:      'text-amber-500',
  indent:  'text-sky-600 dark:text-sky-400',
  num:     'text-orange-500',
  blank:   'h-3 block',
};

function CodePreview() {
  // Collapse tokens into rows
  const rows: Array<Array<{ c: string; t: string }>> = [];
  let row: Array<{ c: string; t: string }> = [];
  for (const tok of SNIPPET) {
    if (tok.c === 'blank') {
      if (row.length) { rows.push(row); row = []; }
      rows.push([tok]);
    } else if (tok.c === 'comment' || tok.c === 'indent') {
      if (row.length) { rows.push(row); row = []; }
      row.push(tok);
    } else {
      row.push(tok);
    }
  }
  if (row.length) rows.push(row);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.7, type: 'spring' }}
      className="relative rounded-2xl overflow-hidden neon-border glass-card hidden lg:block"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
        <span className="w-3 h-3 rounded-full bg-red-400/80" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs font-mono text-muted-foreground">inference.py — InferEdge</span>
      </div>

      {/* Code */}
      <div className="p-5 font-mono text-[13px] leading-relaxed space-y-0.5 bg-background/60">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-wrap">
            {r.map((tok, j) =>
              tok.c === 'blank'
                ? <span key={j} className="block h-3 w-full" />
                : <span key={j} className={TOKEN_COLORS[tok.c] ?? 'text-foreground'}>{tok.t}</span>
            )}
          </div>
        ))}
      </div>

      {/* Glow overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Particle background */}
      {mounted && <ParticleCanvas />}

      {/* Gradient orbs */}
      <div className="hero-orb w-[600px] h-[600px] -top-40 -left-40 bg-indigo-500/20 dark:bg-indigo-600/15" />
      <div className="hero-orb w-[500px] h-[500px] -bottom-20 -right-20 bg-violet-500/15 dark:bg-violet-600/12" />
      <div className="hero-orb w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-400/8 dark:bg-blue-500/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center w-full">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-mono font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Open to Remote Freelance &amp; Full-time
            </span>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-heading font-extrabold leading-[1.05] tracking-tight">
              Sherif<br />
              <span className="shimmer-text">Abd El-Rady</span>
            </h1>
            <div className="text-2xl md:text-3xl font-heading font-medium text-muted-foreground min-h-[40px]">
              <TypingTitle />
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            I build end-to-end computer vision systems — from raw data through model training,
            ONNX optimization, and production deployment.
            {' '}<span className="text-foreground font-medium">18 production-grade projects</span>,
            spanning medical imaging, 3D reconstruction, multimodal AI, and autonomous perception.
          </motion.p>

          {/* Quick metrics strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {[
              '97.3% Medical Accuracy',
              '120 FPS 3D Rendering',
              '<8ms P99 Inference',
              '18 Projects',
            ].map((m) => (
              <span key={m} className="metric-chip">{m}</span>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              View Projects <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`${import.meta.env.BASE_URL ?? '/'}sherif-abdelrady-cv.pdf`}
              download
              className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-secondary/60 rounded-xl font-semibold text-sm hover:border-primary/40 hover:bg-secondary transition-all hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" /> Download CV
            </a>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/sherifabdelrady"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/sherif-abd-el-rady"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <div className="relative">
          {/* Floating metric cards */}
          <MetricFloat value="97.3%"  label="Medical Acc"     delay={1.0} className="-top-8  -left-8 z-20" />
          <MetricFloat value="120 FPS" label="3D Rendering"   delay={1.2} className="-top-8  right-4  z-20" />
          <MetricFloat value="<8ms"   label="P99 Latency"     delay={1.4} className="-bottom-8 -left-4 z-20" />
          <MetricFloat value="18"     label="Projects"         delay={1.6} className="-bottom-8 right-8 z-20" />

          {/* Code preview */}
          <div className="animate-float">
            <CodePreview />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground z-10"
      >
        <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
