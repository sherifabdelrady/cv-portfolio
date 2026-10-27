import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send, MapPin, Clock } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] as const },
});

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'sherifabdelrady@gmail.com',
    href: 'mailto:sherifabdelrady@gmail.com',
    color: 'text-blue-400',
    bg: 'bg-blue-500/8 border-blue-500/20',
    desc: 'Best for project discussions',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/sherifabdelrady',
    href: 'https://github.com/sherifabdelrady',
    color: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
    desc: '25+ public repositories',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/sherif-abd-el-rady',
    href: 'https://linkedin.com/in/sherif-abd-el-rady',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
    desc: 'Professional networking',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section-padding relative">
      {/* Glow orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-content relative z-10">
        {/* Label */}
        <motion.div {...fadeUp()} className="flex items-center gap-4 mb-4">
          <span className="font-mono text-xs text-primary uppercase tracking-widest">06 / Contact</span>
          <div className="h-px flex-1 section-divider" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <motion.h2 {...fadeUp(0.05)} className="font-heading font-bold text-4xl md:text-5xl mb-6">
              Let's Build
              <br />
              <span className="gradient-text-blue-violet">Something Real</span>
            </motion.h2>

            <motion.p {...fadeUp(0.1)} className="text-muted-foreground leading-relaxed mb-8 text-base">
              I'm open to full-time roles, freelance projects, and research collaborations
              in computer vision and production ML. If you have a challenging problem that
              needs more than a Jupyter notebook, let's talk.
            </motion.p>

            {/* Meta info */}
            <motion.div {...fadeUp(0.15)} className="space-y-3 mb-8">
              {[
                { icon: MapPin, text: 'Cairo, Egypt · Remote-first' },
                { icon: Clock,  text: 'EET (UTC+2) · Flexible hours for international teams' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* Status */}
            <motion.div {...fadeUp(0.2)} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5">
              <div className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </div>
              <span className="font-mono text-sm text-emerald-400 font-medium">
                Available for new opportunities
              </span>
            </motion.div>
          </div>

          {/* Right — contact cards */}
          <div className="space-y-3">
            {CONTACT_METHODS.map((m, i) => (
              <motion.a
                key={m.label}
                href={m.href}
                target={m.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                {...fadeUp(0.1 + i * 0.07)}
                className={`glass-card block rounded-2xl p-5 border ${m.bg} group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl border ${m.bg} flex items-center justify-center flex-shrink-0`}>
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-muted-foreground mb-0.5">{m.label}</p>
                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">{m.value}</p>
                    <p className="font-mono text-xs text-muted-foreground/60 mt-0.5">{m.desc}</p>
                  </div>
                  <Send className={`w-4 h-4 ${m.color} opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity`} />
                </div>
              </motion.a>
            ))}

            {/* CV download */}
            <motion.a
              {...fadeUp(0.32)}
              href={`${import.meta.env.BASE_URL ?? '/'}sherif-abdelrady-cv.pdf`}
              download
              className="btn-primary w-full justify-center mt-4 text-sm"
            >
              Download Full CV (PDF)
              <span className="ml-1">↓</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
