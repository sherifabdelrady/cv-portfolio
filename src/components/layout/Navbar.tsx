import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const NAV_LINKS = [
  { name: '01. About',        href: '#about',         id: 'about' },
  { name: '02. Experience',   href: '#experience',    id: 'experience' },
  { name: '03. Proof',        href: '#testimonials',  id: 'testimonials' },
  { name: '04. Impact',       href: '#metrics',       id: 'metrics' },
  { name: '05. Projects',     href: '#projects',      id: 'projects' },
  { name: '06. Case Studies', href: '#case-studies',  id: 'case-studies' },
  { name: '07. Services',     href: '#services',      id: 'services' },
  { name: '08. Pipeline',     href: '#pipeline',      id: 'pipeline' },
  { name: '09. Stack',        href: '#skills',        id: 'skills' },
  { name: '10. Contact',      href: '#contact',       id: 'contact' },
];

interface NavbarProps {
  onPaletteOpen: () => void;
}

export default function Navbar({ onPaletteOpen }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ['hero', ...NAV_LINKS.map((l) => l.id)];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-35% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => scrollTo('#hero')}
          aria-label="Back to top"
        >
          <div className="w-8 h-8 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/8 group-hover:bg-primary/15 transition-colors">
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            SA<span className="text-primary">_</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => scrollTo(link.href)}
              className={`px-2.5 py-2 text-[11px] font-mono transition-all rounded-md whitespace-nowrap ${
                activeSection === link.id
                  ? 'text-primary bg-primary/8'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* ⌘K palette trigger */}
          <button
            type="button"
            onClick={onPaletteOpen}
            aria-label="Open command palette"
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary transition-all font-mono text-[11px]"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search</span>
            <kbd className="flex items-center gap-0.5 bg-secondary/80 border border-border rounded px-1.5 py-0.5 text-[10px] leading-none">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => scrollTo('#contact')}
            className="hidden md:flex px-4 py-2 text-sm font-mono font-medium text-primary-foreground bg-primary border border-primary hover:bg-primary/90 transition-all shadow-[0_2px_12px_rgba(59,130,246,0.25)] rounded-lg"
          >
            Hire Me
          </button>

          <button
            type="button"
            className="lg:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-b border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-1">
              {/* Mobile search */}
              <button
                type="button"
                onClick={() => { setMobileOpen(false); onPaletteOpen(); }}
                className="flex items-center gap-2 text-left text-sm font-mono py-2.5 px-3 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors mb-2 border border-border"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search…</span>
                <kbd className="ml-auto bg-secondary border border-border rounded px-1.5 py-0.5 text-[10px]">⌘K</kbd>
              </button>

              {NAV_LINKS.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className={`text-left text-sm font-mono py-2.5 px-3 rounded-md transition-colors ${
                    activeSection === link.id
                      ? 'text-primary bg-primary/8'
                      : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => scrollTo('#contact')}
                  className="w-full px-4 py-2.5 text-sm font-mono font-medium text-primary-foreground bg-primary rounded-lg"
                >
                  Hire Me
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
