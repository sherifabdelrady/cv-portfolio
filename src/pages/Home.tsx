import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUp, Search } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Testimonials from '@/components/sections/Testimonials';
import Metrics from '@/components/sections/Metrics';
import Projects from '@/components/sections/Projects';
import CaseStudies from '@/components/sections/CaseStudies';
import Services from '@/components/sections/Services';
import Pipeline from '@/components/sections/Pipeline';
import CTAStrip from '@/components/sections/CTAStrip';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import Navbar from '@/components/layout/Navbar';
import CommandPalette from '@/components/CommandPalette';

// Lazy-load DemoModal + all TF.js / Tesseract children — zero cost on first paint
const DemoModal = lazy(() => import('@/components/demos/DemoModal'));

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPaletteHint, setShowPaletteHint] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global ⌘K / Ctrl+K shortcut to open the palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        // If they used the shortcut, don't show the hint
        setShowPaletteHint(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Show ⌘K hint after 5 s, hide after 4 more
  useEffect(() => {
    const show = setTimeout(() => setShowPaletteHint(true), 5000);
    const hide = setTimeout(() => setShowPaletteHint(false), 9000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const openDemo = (id: string) => {
    setActiveDemo(id);
    setPaletteOpen(false);
  };

  return (
    <div className="relative min-h-screen selection:bg-primary/20 selection:text-primary">
      {/* Skip-to-content — accessibility */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-mono focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>

      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <Navbar onPaletteOpen={() => setPaletteOpen(true)} />

      <main className="flex flex-col w-full">
        <Hero />
        <About />
        <Experience />
        <Testimonials />
        <Metrics />
        <Projects onDemoClick={openDemo} />
        <CaseStudies />
        <Services />
        <Pipeline />
        <CTAStrip />
        <Skills />
        <Contact />
      </main>

      {/* DemoModal is lazy — TF.js loads only when a demo is actually opened */}
      <Suspense fallback={null}>
        {activeDemo && (
          <DemoModal projectId={activeDemo} onClose={() => setActiveDemo(null)} />
        )}
      </Suspense>

      {/* ⌘K Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        openDemo={openDemo}
      />

      {/* ⌘K discovery hint — fades in after 5 s, out after 4 more */}
      <AnimatePresence>
        {showPaletteHint && !paletteOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            onClick={() => { setShowPaletteHint(false); setPaletteOpen(true); }}
            className="fixed bottom-8 left-8 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-card border border-border rounded-xl shadow-lg font-mono text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors group"
            aria-label="Open command palette"
          >
            <Search className="w-3.5 h-3.5 group-hover:text-primary" />
            <span>Quick search</span>
            <kbd className="flex items-center gap-0.5 bg-secondary border border-border rounded px-1.5 py-0.5 text-[10px] ml-1">
              ⌘K
            </kbd>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-8 right-8 z-40 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="w-full border-t border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/8">
                  <span className="font-mono font-bold text-sm text-primary">SA</span>
                </div>
                <span className="font-mono font-bold text-lg tracking-tight">
                  Sherif Abd El-Rady
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Computer Vision Engineer specializing in end-to-end AI systems — from dataset curation to production deployment.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-emerald-400">Open to freelance &amp; remote roles</span>
              </div>
            </div>

            {/* Navigation column */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-4">Navigate</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  ['About', '#about'],
                  ['Experience', '#experience'],
                  ['Projects', '#projects'],
                  ['Case Studies', '#case-studies'],
                  ['Services', '#services'],
                  ['ML Pipeline', '#pipeline'],
                  ['Tech Stack', '#skills'],
                  ['Contact', '#contact'],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono cursor-pointer"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact column */}
            <div>
              <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-4">Get in Touch</p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:sherifabdelrady@gmail.com"
                  className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  sherifabdelrady@gmail.com
                </a>
                <a
                  href="https://github.com/sherifabdelrady"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  github.com/sherifabdelrady
                </a>
                <a
                  href="https://linkedin.com/in/sherif-abd-el-rady"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  linkedin.com/in/sherif-abd-el-rady
                </a>
                <a
                  href={`${import.meta.env.BASE_URL ?? '/'}sherif-abdelrady-cv.pdf`}
                  download
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/60 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all w-fit"
                >
                  ↓ Download CV
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/60 font-mono">
              © {new Date().getFullYear()} Sherif Abd El-Rady · Computer Vision &amp; Deep Learning
            </p>
            <div className="flex flex-wrap gap-2">
              {['PyTorch', 'OpenCV', 'ONNX', 'FastAPI', 'Docker', 'CUDA'].map((t) => (
                <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-secondary/40 text-muted-foreground/70">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
