import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Mail, Download, ChevronDown, Terminal } from 'lucide-react';

const TYPED_LINES = [
  'Computer Vision Engineer',
  'Deep Learning Researcher',
  'ML Systems Architect',
  'Open-Source Builder',
];

function useTypingEffect(lines: string[], speed = 60, pause = 2000) {
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = lines[lineIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < full.length) {
      timer = setTimeout(() => setText(full.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === full.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timer = setTimeout(() => setText(text.slice(0, -1)), speed / 2);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setLineIdx((i) => (i + 1) % lines.length);
    }
    return () => clearTimeout(timer);
  }, [text, deleting, lineIdx, lines, speed, pause]);

  return text;
}

const STATS = [
  { value: '25+', label: 'Repositories', color: 'text-blue-400'   },
  { value: '18',  label: 'ML Models',    color: 'text-violet-400' },
  { value: '8',   label: 'Domains',      color: 'text-emerald-400' },
  { value: '∞',   label: 'Coffee ☕',    color: 'text-amber-400'  },
];

function AnimatedStat({ value, label, color, delay }: { value: string; label: string; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center gap-1"
    >
      <span className={`font-heading font-bold text-3xl md:text-4xl ${color} tabular-nums`}>{value}</span>
      <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

export default function Hero() {
  const typed = useTypingEffect(TYPED_LINES);

  const scrollDown = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 gradient-hero pointer-events-none" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none float-slow" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none float" />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-emerald-500/4 blur-3xl pointer-events-none float-delay" />

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="scan-line" />
      </div>

      <div className="max-content relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[85vh] py-24">

          {/* LEFT — Text content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 w-fit"
            >
              <div className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5">
                <div className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </div>
                <span className="font-mono text-xs text-emerald-400 font-medium">Open to opportunities</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.0] tracking-tight">
                <span className="text-foreground">Sherif</span>
                <br />
                <span className="gradient-text">Abd El-Rady</span>
              </h1>
            </motion.div>

            {/* Typed role */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center gap-2 h-8"
            >
              <span className="text-primary font-mono text-lg font-medium">$</span>
              <span className="font-mono text-lg text-foreground/85 font-medium">{typed}</span>
              <span className="w-0.5 h-5 bg-primary cursor-blink rounded-sm" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-xl"
            >
              Building production-grade computer vision systems — from custom YOLO inference 
              pipelines and multimodal search to 3D scene reconstruction. I close the gap 
              between research and deployment.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-wrap gap-3"
            >
              <a href="#projects" onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary">
                View Projects
                <span className="ml-1 opacity-70">→</span>
              </a>
              <a
                href={`${import.meta.env.BASE_URL ?? '/'}sherif-abdelrady-cv.pdf`}
                download
                className="btn-outline"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex items-center gap-4 pt-2"
            >
              {[
                { icon: Github,   href: 'https://github.com/sherifabdelrady',        label: 'GitHub'   },
                { icon: Linkedin, href: 'https://linkedin.com/in/sherif-abd-el-rady', label: 'LinkedIn' },
                { icon: Mail,     href: 'mailto:sherifabdelrady@gmail.com',           label: 'Email'    },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/8 hover:shadow-[0_0_16px_hsl(217_91%_60%/0.2)] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <div className="h-px w-8 bg-border" />
              <span className="font-mono text-xs text-muted-foreground">Cairo, Egypt · Remote ✓</span>
            </motion.div>
          </div>

          {/* RIGHT — Terminal + Stats */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">

            {/* Photo or Terminal Card */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              {/* Glowing backdrop */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/10 via-violet-500/8 to-emerald-500/6 blur-2xl" />

              <div className="terminal relative neon-border">
                <div className="terminal-header">
                  <div className="terminal-dot" style={{ background: '#FF5F57' }} />
                  <div className="terminal-dot" style={{ background: '#FEBC2E' }} />
                  <div className="terminal-dot" style={{ background: '#28C840' }} />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">sherif@cv-engineer ~ </span>
                  <Terminal className="w-3 h-3 ml-auto text-muted-foreground/50" />
                </div>
                <div className="terminal-body space-y-1 p-5">
                  <div><span className="cmd">cat</span> <span className="arg">profile.json</span></div>
                  <div className="text-muted-foreground/40">{'{'}</div>
                  <div className="pl-4"><span className="text-blue-400">"name"</span>: <span className="arg">"Sherif Abd El-Rady"</span>,</div>
                  <div className="pl-4"><span className="text-blue-400">"role"</span>: <span className="arg">"Computer Vision Engineer"</span>,</div>
                  <div className="pl-4"><span className="text-blue-400">"location"</span>: <span className="arg">"Cairo, Egypt"</span>,</div>
                  <div className="pl-4"><span className="text-blue-400">"focus"</span>: [</div>
                  <div className="pl-8"><span className="arg">"Object Detection"</span>,</div>
                  <div className="pl-8"><span className="arg">"Multimodal AI"</span>,</div>
                  <div className="pl-8"><span className="arg">"Production Deployment"</span></div>
                  <div className="pl-4">],</div>
                  <div className="pl-4"><span className="text-blue-400">"open_to_work"</span>: <span className="text-emerald-400">true</span></div>
                  <div className="text-muted-foreground/40">{'}'}</div>
                  <div className="mt-3 flex items-center gap-1">
                    <span className="cmd">git log</span> <span className="arg">--oneline -3</span>
                  </div>
                  <div className="text-emerald-400/70 text-xs">a4f3b2c fix: YOLOv8 postprocess confidence extraction</div>
                  <div className="text-emerald-400/70 text-xs">d91c5e8 feat: Arabic Unicode support in OCR vocab</div>
                  <div className="text-emerald-400/70 text-xs">8b30f12 fix: FAISS empty-index crash guard</div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-primary">❯</span>
                    <span className="w-0.5 h-3.5 bg-primary cursor-blink rounded-sm ml-0.5" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="glass rounded-2xl p-5"
            >
              <div className="grid grid-cols-4 gap-4 divide-x divide-border">
                {STATS.map((s, i) => (
                  <AnimatedStat key={s.label} {...s} delay={0.6 + i * 0.1} />
                ))}
              </div>
            </motion.div>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-1.5"
            >
              {['PyTorch', 'CUDA', 'ONNX', 'FastAPI', 'OpenCV', 'Docker', 'FAISS', 'TensorRT'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85 + i * 0.04 }}
                  className="tag tag-blue"
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer group"
        aria-label="Scroll down"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
