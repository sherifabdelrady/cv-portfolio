import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Github, Linkedin, Zap, Shield, Clock } from 'lucide-react';

const TRUST_PILLS = [
  { icon: Zap,    text: '< 8ms P99 inference' },
  { icon: Shield, text: '18 production projects' },
  { icon: Clock,  text: 'Responds within 24 hours' },
];

export default function CTAStrip() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-blue-500/8 to-primary/8 border-y border-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]" />

      {/* Animated glow orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col items-center text-center gap-8"
        >
          {/* Top label */}
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-semibold">
              Available now · Remote only
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-3xl">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              You've seen the work.{' '}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Let's build something real.
              </span>
            </h3>
            <p className="text-muted-foreground text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Available for computer vision projects, remote full-time roles, and applied AI research.
              I scope honestly and deliver clean, documented code you can actually run.
            </p>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {TRUST_PILLS.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/60 font-mono text-xs text-muted-foreground">
                <Icon className="w-3 h-3 text-primary" />
                {text}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:sherifabdelrady@gmail.com"
              className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-mono font-bold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_4px_40px_rgba(59,130,246,0.55)] hover:-translate-y-0.5 group"
            >
              <Mail className="w-4 h-4" />
              Email Me
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              type="button"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-7 py-3.5 bg-background text-foreground border border-border hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all font-mono text-sm rounded-xl hover:-translate-y-0.5 group"
            >
              Open Contact Form
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/sherifabdelrady"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-muted-foreground"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/sherif-abd-el-rady"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-muted-foreground"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


