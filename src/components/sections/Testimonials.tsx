import React from 'react';
import { motion } from 'framer-motion';
import {
  Github, ArrowUpRight, ShieldCheck, Star, GitFork,
  Code2, Users, Zap, TrendingUp, Award,
} from 'lucide-react';

/* ── GitHub-style stat card ─────────────────────────────────────────────── */
const GITHUB_STATS = [
  { label: 'Public Repos',     value: '18+',  icon: Code2,      color: 'text-primary',   bg: 'bg-primary/8',     border: 'border-primary/20' },
  { label: 'Total Stars',      value: '120+', icon: Star,       color: 'text-amber-500', bg: 'bg-amber-500/8',   border: 'border-amber-500/20' },
  { label: 'Projects Shipped', value: '18',   icon: TrendingUp, color: 'text-emerald-500',bg: 'bg-emerald-500/8',border: 'border-emerald-500/20' },
  { label: 'CV Domains',       value: '10',   icon: Zap,        color: 'text-blue-500', bg: 'bg-blue-500/8', border: 'border-blue-500/20' },
];

/* ── Working style proof points ─────────────────────────────────────────── */
const PROOF_POINTS = [
  {
    quote: 'End-to-end ownership from dataset curation to a monitored inference API — one engineer, the entire CV lifecycle.',
    label: 'Delivery standard',
    detail: 'Data → Model → Production',
    icon: TrendingUp,
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/15',
  },
  {
    quote: 'Every architecture choice backed by an ablation, a latency measurement, or a failure-case analysis — not preference.',
    label: 'Working style',
    detail: 'Evidence over guesswork',
    icon: Award,
    color: 'text-blue-500',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/15',
  },
  {
    quote: 'Async-first remote collaboration: clear progress updates, reproducible experiments, documentation another engineer can actually run.',
    label: 'How I work',
    detail: 'Async-friendly · Remote only',
    icon: Users,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/15',
  },
];

/* ── Verified achievements ──────────────────────────────────────────────── */
const ACHIEVEMENTS = [
  { text: '97.3% diagnostic accuracy on NIH ChestX-ray14 (14-class multi-label)', verified: true },
  { text: '3.1× throughput improvement via INT8 quantization + Triton batching', verified: true },
  { text: '<8ms P99 inference — sustained under 500 req/min load on YOLOv8x', verified: true },
  { text: '45 FPS at 1080p on Jetson Orin — within 8W power budget', verified: true },
  { text: '120 FPS real-time 3D rendering via hardware-accelerated raycasting', verified: true },
  { text: 'All 18 projects open-source with reproducible training pipelines', verified: true },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.05),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-4 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">Client Proof</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground font-mono text-sm mb-12"
        >
          No invented testimonials — only verifiable results. The numbers are real; the repos are public.
        </motion.p>

        {/* ── GitHub stats strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {GITHUB_STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`glass-card rounded-xl p-5 border ${s.border} flex items-center gap-3 hover:scale-[1.02] transition-transform`}
              >
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className={`font-mono font-bold text-xl ${s.color} leading-none`}>{s.value}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main grid: proof + achievements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 mb-10">

          {/* Left — working style proof cards */}
          <div className="flex flex-col gap-4">
            {PROOF_POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09 }}
                  className={`rounded-xl border ${p.border} ${p.bg} p-5 flex gap-4`}
                >
                  <div className={`w-9 h-9 rounded-lg bg-background/50 border ${p.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${p.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground leading-relaxed mb-3">"{p.quote}"</p>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${p.color}`}>{p.label}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{p.detail}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right — verified achievements list */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-7 border border-border flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-widest">Verified Results</p>
            </div>

            <ul className="flex flex-col gap-4 flex-1">
              {ACHIEVEMENTS.map((a, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  </div>
                  <p className="font-mono text-xs text-foreground leading-relaxed group-hover:text-foreground/90 transition-colors">{a.text}</p>
                </motion.li>
              ))}
            </ul>

            {/* GitHub CTA */}
            <a
              href="https://github.com/sherifabdelrady"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 pt-5 border-t border-border flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  github.com/sherifabdelrady — all repos public
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </a>
          </motion.div>
        </div>

        {/* CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            Have a CV problem to solve? Start a conversation
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <span className="text-border">·</span>
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            See all 18 projects
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

