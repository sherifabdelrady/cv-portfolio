import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Quote, ShieldCheck } from 'lucide-react';

const PROOF_POINTS = [
  {
    quote: 'From dataset curation to a monitored inference API — one owner across the entire CV lifecycle.',
    label: 'Delivery standard',
    detail: 'Data → Model → Production',
  },
  {
    quote: 'Every architecture choice is backed by an ablation, a latency measurement, or a failure-case analysis.',
    label: 'Working style',
    detail: 'Evidence over guesswork',
  },
  {
    quote: 'Remote collaboration with clear updates, reproducible experiments, and documentation another engineer can run.',
    label: 'How I work',
    detail: 'Async-friendly · Remote only',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 flex items-end gap-4"
        >
          <h2 className="text-4xl md:text-5xl">03. Client Proof</h2>
          <div className="h-px bg-border flex-1 mb-3" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-8 flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-primary" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
                Proof before promises
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                See the work. Then let the results speak.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                I work remotely from home and keep engagements transparent:
                measurable targets, reproducible experiments, and production-ready
                handoff. Verified client quotes will be added here as clients approve
                them for publication.
              </p>
            </div>
            <div className="mt-8 pt-5 border-t border-primary/15 flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>No invented testimonials — only approved client feedback.</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROOF_POINTS.map((point, i) => (
              <motion.article
                key={point.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 flex flex-col hover:border-primary/30 transition-colors"
              >
                <Quote className="w-5 h-5 text-primary/50 mb-5" />
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  “{point.quote}”
                </p>
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="font-mono text-xs font-semibold text-foreground">{point.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">{point.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.a
          href="#contact"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Have a CV problem to solve? Start a conversation
          <ArrowUpRight className="w-4 h-4" />
        </motion.a>
      </div>
    </section>
  );
}