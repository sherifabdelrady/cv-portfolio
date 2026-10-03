import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

export default function CTAStrip() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Gradient band */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-center md:text-left">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
              Remote only · Open to freelance &amp; full-time
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
              You've seen the pipeline.{' '}
              <span className="text-primary">Let's build something.</span>
            </h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg">
              Available for freelance projects, remote full-time roles, and applied research
              collaborations. I respond within 24 hours.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="mailto:sherifabdelrady@gmail.com"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-bold text-sm rounded-lg hover:bg-primary/90 transition-all shadow-[0_4px_24px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_32px_rgba(59,130,246,0.45)] group"
            >
              <Mail className="w-4 h-4" />
              Email Me
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              type="button"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 bg-background text-foreground border border-border hover:border-primary hover:text-primary transition-all font-mono text-sm rounded-lg"
            >
              Contact Form
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
