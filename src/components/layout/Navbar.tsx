import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Github, Linkedin, Mail } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience'  },
  { label: 'Projects',   href: '#projects'    },
  { label: 'Skills',     href: '#skills'      },
  { label: 'Contact',    href: '#contact'     },
];

const SOCIAL = [
  { icon: Github,   href: 'https://github.com/sherifabdelrady',        label: 'GitHub'   },
  { icon: Linkedin, href: 'https://linkedin.com/in/sherif-abd-el-rady', label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:sherifabdelrady@gmail.com',           label: 'Email'    },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar({ onPaletteOpen }: { onPaletteOpen?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Track active section
      const sections = NAV_LINKS.map(l => l.href.slice(1));
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'navbar-glass' : 'bg-transparent border-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-content flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative flex items-center gap-2.5 select-none"
          >
            <div className="relative w-9 h-9 rounded-xl border border-primary/30 bg-primary/8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-violet-500/10" />
              <span className="relative font-heading font-bold text-sm text-primary tracking-tight">SA</span>
            </div>
            <span className="hidden sm:block font-heading font-semibold text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              Sherif Abd El-Rady
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={e => { e.preventDefault(); scrollTo(href); }}
                  className={`relative px-3.5 py-2 rounded-lg font-mono text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/25"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Social icons */}
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 border border-transparent hover:border-primary/20 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}

            {/* ⌘K */}
            {onPaletteOpen && (
              <button
                type="button"
                onClick={onPaletteOpen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                aria-label="Open command palette"
              >
                <Search className="w-3 h-3" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden lg:inline ml-1 text-[10px] opacity-60">⌘K</kbd>
              </button>
            )}

            <a
              href={`${import.meta.env.BASE_URL ?? '/'}sherif-abdelrady-cv.pdf`}
              download
              className="btn-primary !py-2 !px-4 text-xs"
            >
              Resume ↓
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-40 w-72 glass border-l border-border flex flex-col md:hidden"
          >
            <div className="h-16 border-b border-border flex items-center justify-between px-5">
              <span className="font-heading font-bold text-sm">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4 flex-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={e => { e.preventDefault(); scrollTo(href); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40" />
                  {label}
                </a>
              ))}
            </nav>

            <div className="p-4 border-t border-border flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
