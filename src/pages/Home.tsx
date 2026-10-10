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

      <footer className="w-full py-10 border-t border-border mt-12 bg-background/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-mono">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p>
              <span className="text-foreground font-semibold">Sherif Abd El-Rady</span>
              {' '}· AI Engineer · Computer Vision &amp; Deep Learning
            </p>
            <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              Available for freelance &amp; remote roles · Responds within 24 hours
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/sherifabdelrady" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/sherif-abd-el-rady" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            <a href="mailto:sherifabdelrady@gmail.com" className="hover:text-foreground transition-colors">Email</a>
            <a href={`${import.meta.env.BASE_URL ?? '/'}sherif-abdelrady-cv.pdf`} download className="hover:text-primary transition-colors text-primary/80">CV ↓</a>
          </div>
          <p className="text-xs opacity-60">&copy; {new Date().getFullYear()} Sherif Abd El-Rady</p>
        </div>
      </footer>
    </div>
  );
}
