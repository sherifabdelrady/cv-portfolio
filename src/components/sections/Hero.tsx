import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Github, ChevronRight, Linkedin, ChevronDown } from 'lucide-react';

const CODE_LINES = [
  { token: 'comment',  text: '# real-time inference pipeline' },
  { token: 'keyword',  text: 'from' },
  { token: 'module',   text: ' vision ' },
  { token: 'keyword',  text: 'import' },
  { token: 'default',  text: ' DetectionEngine' },
  { token: 'blank',    text: '' },
  { token: 'comment',  text: '# custom backbone · domain-tuned' },
  { token: 'default',  text: 'engine = DetectionEngine(' },
  { token: 'indent',   text: '  backbone' },
  { token: 'op',       text: '=' },
  { token: 'string',   text: '"yolov8x-custom"' },
  { token: 'default',  text: ',' },
  { token: 'indent',   text: '  conf_thresh' },
  { token: 'op',       text: '=' },
  { token: 'number',   text: '0.45' },
  { token: 'default',  text: ',' },
  { token: 'indent',   text: '  device' },
  { token: 'op',       text: '=' },
  { token: 'string',   text: '"cuda:0"' },
  { token: 'default',  text: ')' },
  { token: 'blank',    text: '' },
  { token: 'comment',  text: '# 12 ms @ 1080p · INT8 ONNX export' },
  { token: 'default',  text: 'result = engine.infer(frame)' },
  { token: 'blank',    text: '' },
  { token: 'comment',  text: '# → 23 objects · 0.91 mAP@0.5' },
];

// Collapse consecutive non-blank lines into display rows
const ROWS: { text: string; tokens: Array<{ token: string; text: string }> }[] = [];
(function buildRows() {
  let currentRow: Array<{ token: string; text: string }> = [];
  for (const line of CODE_LINES) {
    if (line.token === 'blank') {
      if (currentRow.length) ROWS.push({ text: '', tokens: currentRow });
      ROWS.push({ text: '', tokens: [{ token: 'blank', text: '' }] });
      currentRow = [];
    } else if (
      line.token === 'keyword' ||
      line.token === 'module' ||
      line.token === 'default' ||
      line.token === 'op' ||
      line.token === 'string' ||
      line.token === 'number'
    ) {
      currentRow.push(line);
    } else {
      // comment or indent starts a new row
      if (currentRow.length) {
        ROWS.push({ text: '', tokens: currentRow });
        currentRow = [];
      }
      currentRow.push(line);
    }
  }
  if (currentRow.length) ROWS.push({ text: '', tokens: currentRow });
})();

const TOKEN_COLORS: Record<string, string> = {
  comment:  'text-slate-500',
  keyword:  'text-violet-400',
  module:   'text-sky-300',
  default:  'text-slate-200',
  indent:   'text-sky-200',
  op:       'text-slate-400',
  string:   'text-emerald-400',
  number:   'text-amber-400',
  blank:    '',
};

function TerminalWidget() {
  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    if (visibleRows >= ROWS.length) return;
    const t = setTimeout(() => setVisibleRows((v) => v + 1), visibleRows === 0 ? 1400 : 120);
    return () => clearTimeout(t);
  }, [visibleRows]);

  return (
    <div className="w-full max-w-md font-mono text-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0d1117]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/5">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-[11px] text-slate-500 tracking-wide">cv_engine.py</span>
      </div>

      {/* Code area */}
      <div className="px-5 py-5 space-y-[3px] min-h-[280px]">
        {ROWS.slice(0, visibleRows).map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-0 leading-6"
          >
            <span className="select-none text-slate-600 text-[11px] mr-4 w-4 text-right flex-shrink-0">
              {row.tokens[0]?.token !== 'blank' ? i + 1 : ''}
            </span>
            <span>
              {row.tokens.map((t, j) => (
                <span key={j} className={TOKEN_COLORS[t.token] ?? 'text-slate-200'}>
                  {t.text}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
        {/* Cursor */}
        {visibleRows < ROWS.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="inline-block w-2 h-[14px] bg-primary align-middle ml-8"
          />
        )}
      </div>

      {/* Status bar */}
      <div className="px-5 py-2 bg-primary/10 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
        <span>Python 3.11 · CUDA 12.1</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          GPU ready
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const words = 'Building machines that see.'.split(' ');

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16 xl:gap-24">

          {/* ── Left: text content ── */}
          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Available for hire · Remote only
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter mb-4 text-foreground leading-[1.05]"
            >
              Sherif<br />Abd El-Rady
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8"
            >
              AI Engineer &middot;{' '}
              <span className="text-foreground font-semibold">Computer Vision &amp; Deep Learning</span>
            </motion.h2>

            {/* Typewriter */}
            <div className="font-mono text-lg md:text-xl text-primary mb-8 min-h-[36px] flex gap-2 flex-wrap">
              <span className="text-muted-foreground">{'>'}</span>
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.5 + i * 0.1 }}
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-[3px] h-[1em] bg-primary align-middle ml-1"
              />
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed"
            >
              I build computer vision and deep learning systems that work in production — from
              detection, segmentation, and multimodal search to AI automation and inference
              optimization. Available for freelance projects and remote full-time roles.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex flex-wrap items-center gap-4 font-mono text-sm"
            >
              <button
                type="button"
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 border border-primary transition-all flex items-center gap-2 group rounded-lg shadow-[0_4px_24px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_32px_rgba(59,130,246,0.4)]"
              >
                View Projects
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="/sherif-abdelrady-cv.pdf"
                download
                className="px-6 py-3 bg-background text-foreground border border-border hover:border-primary hover:text-primary transition-all flex items-center gap-2 group rounded-lg"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Download CV
              </a>

              <a
                href="https://github.com/sherifabdelrady"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-background text-muted-foreground border border-border hover:border-foreground hover:text-foreground transition-all flex items-center justify-center rounded-lg"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com/in/sherif-abd-el-rady"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-background text-muted-foreground border border-border hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all flex items-center justify-center rounded-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </motion.div>


          </div>

          {/* ── Right: terminal widget ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="hidden lg:flex flex-1 justify-center items-center"
          >
            <TerminalWidget />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Decorative vertical rule */}
      <div className="absolute right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden xl:block" />
      <div className="absolute right-[41px] top-1/4 h-32 w-px bg-primary hidden xl:block animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
    </section>
  );
}
