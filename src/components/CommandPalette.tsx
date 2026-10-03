/**
 * ⌘K / Ctrl+K Command Palette
 * Sections · Projects · External links
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ArrowRight, Github, Linkedin, Mail, Download,
  User, Briefcase, BarChart3, FolderOpen, GitBranch, Cpu, MessageSquare,
  Play, ExternalLink, ShieldCheck,
} from 'lucide-react';

// ── Item catalogue ────────────────────────────────────────────────────────────
type PaletteItem = {
  id: string;
  group: 'Navigate' | 'Projects' | 'Links';
  label: string;
  sub?: string;
  icon: React.ElementType;
  action: (ctx: PaletteCtx) => void;
  keywords?: string;
};

type PaletteCtx = {
  close: () => void;
  openDemo: (id: string) => void;
};

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const ITEMS: PaletteItem[] = [
  // ── Navigate
  { id: 'nav-about',      group: 'Navigate', label: '01. About',       sub: 'Bio & skills',              icon: User,          action: ({ close }) => { scrollTo('about');      close(); }, keywords: 'bio skills stack' },
  { id: 'nav-experience', group: 'Navigate', label: '02. Experience',  sub: 'Freelance & foundations',   icon: Briefcase,     action: ({ close }) => { scrollTo('experience'); close(); }, keywords: 'work freelance self-taught' },
  { id: 'nav-proof',      group: 'Navigate', label: '03. Client Proof', sub: 'How I work remotely',     icon: ShieldCheck,   action: ({ close }) => { scrollTo('testimonials'); close(); }, keywords: 'testimonials trust clients remote' },
  { id: 'nav-impact',     group: 'Navigate', label: '04. Impact',      sub: 'Metrics & results',         icon: BarChart3,     action: ({ close }) => { scrollTo('metrics');    close(); }, keywords: 'metrics fps accuracy' },
  { id: 'nav-projects',   group: 'Navigate', label: '05. Projects',    sub: '14 CV systems',            icon: FolderOpen,    action: ({ close }) => { scrollTo('projects');   close(); }, keywords: 'mediscan urbansense yolo multimodal depth pose' },
  { id: 'nav-services',   group: 'Navigate', label: '06. Services',    sub: 'Freelance packages',        icon: Briefcase,     action: ({ close }) => { scrollTo('services');   close(); }, keywords: 'hire freelance packages pricing' },
  { id: 'nav-pipeline',   group: 'Navigate', label: '07. ML Pipeline', sub: '9-stage end-to-end',        icon: GitBranch,     action: ({ close }) => { scrollTo('pipeline');   close(); }, keywords: 'pipeline data training deploy' },
  { id: 'nav-stack',      group: 'Navigate', label: '08. Tech Stack',  sub: 'PyTorch · ONNX · Docker',   icon: Cpu,           action: ({ close }) => { scrollTo('skills');     close(); }, keywords: 'pytorch opencv docker triton' },
  { id: 'nav-contact',    group: 'Navigate', label: '09. Work With Me', sub: 'Get in touch',             icon: MessageSquare, action: ({ close }) => { scrollTo('contact');    close(); }, keywords: 'hire email message' },

  // ── Projects with demos
  { id: 'proj-mediscan',    group: 'Projects', label: 'MediScan',     sub: '97.3% acc · medical imaging',         icon: Play, action: ({ close, openDemo }) => { openDemo('mediscan');    close(); }, keywords: 'chest xray pneumonia covid' },
  { id: 'proj-urbansense',  group: 'Projects', label: 'UrbanSense',   sub: 'mAP 0.891 · 45 FPS detection',        icon: Play, action: ({ close, openDemo }) => { openDemo('urbansense');  close(); }, keywords: 'yolo detection pedestrian' },
  { id: 'proj-segforge',    group: 'Projects', label: 'SegForge',     sub: 'mIoU 0.843 · segmentation',           icon: Play, action: ({ close, openDemo }) => { openDemo('segforge');    close(); }, keywords: 'unet segmentation driving' },
  { id: 'proj-facevault',   group: 'Projects', label: 'FaceVault',    sub: 'TAR 99.2% · face recognition',        icon: Play, action: ({ close, openDemo }) => { openDemo('facevault');   close(); }, keywords: 'face arcface biometric spoof' },
  { id: 'proj-trackmaster', group: 'Projects', label: 'TrackMaster',  sub: 'MOTA 0.812 · multi-object tracking',  icon: Play, action: ({ close, openDemo }) => { openDemo('trackmaster'); close(); }, keywords: 'deepsort tracking video' },
  { id: 'proj-docuai',      group: 'Projects', label: 'DocuAI',       sub: 'Word acc 96.4% · OCR',                icon: Play, action: ({ close, openDemo }) => { openDemo('docuai');      close(); }, keywords: 'ocr crnn document text' },
  { id: 'proj-superres',    group: 'Projects', label: 'SuperRes',     sub: 'PSNR 32.7 dB · 4× upscale',          icon: Play, action: ({ close, openDemo }) => { openDemo('superres');    close(); }, keywords: 'esrgan super resolution' },
  { id: 'proj-actionnet',   group: 'Projects', label: 'ActionNet',    sub: 'Top-1 87.4% · action recognition',    icon: Play, action: ({ close, openDemo }) => { openDemo('actionnet');   close(); }, keywords: 'slowfast video action kinetics' },
  { id: 'proj-synthvision', group: 'Projects', label: 'SynthVision',  sub: 'FID 18.4 · GAN generation',           icon: Play, action: ({ close, openDemo }) => { openDemo('synthvision'); close(); }, keywords: 'stylegan gan generative faces' },
  { id: 'proj-inferedge',     group: 'Projects', label: 'InferEdge',       sub: '<8ms p99 · production serving',            icon: Play, action: ({ close, openDemo }) => { openDemo('inferedge');     close(); }, keywords: 'triton inference server onnx' },
  { id: 'proj-visionlang',   group: 'Projects', label: 'VisionLang',      sub: '92.4% Recall@5 · multimodal search',       icon: Play, action: ({ close, openDemo }) => { openDemo('visionlang');   close(); }, keywords: 'clip multimodal faiss visual search' },
  { id: 'proj-poseforge',    group: 'Projects', label: 'PoseForge',       sub: 'AP 77.1% · pose & gesture recognition',    icon: Play, action: ({ close, openDemo }) => { openDemo('poseforge');    close(); }, keywords: 'pose estimation gesture vitpose mediapipe' },
  { id: 'proj-depthpro',     group: 'Projects', label: 'DepthPro',        sub: 'δ1 93.2% · monocular depth estimation',    icon: Play, action: ({ close, openDemo }) => { openDemo('depthpro');     close(); }, keywords: 'depth estimation dpt midas 3d' },
  { id: 'proj-autoperception',group: 'Projects', label: 'AutoPerception',  sub: 'mAP 0.624 · BEV 3D object detection',     icon: Play, action: ({ close, openDemo }) => { openDemo('autoperception'); close(); }, keywords: 'autonomous lidar bev 3d detection nuscenes' },

  // ── External links
  { id: 'link-github',   group: 'Links', label: 'GitHub',       sub: 'github.com/sherifabdelrady',        icon: Github,   action: ({ close }) => { window.open('https://github.com/sherifabdelrady', '_blank'); close(); }, keywords: 'code repos' },
  { id: 'link-linkedin', group: 'Links', label: 'LinkedIn',     sub: 'linkedin.com/in/sherif-abd-el-rady', icon: Linkedin, action: ({ close }) => { window.open('https://linkedin.com/in/sherif-abd-el-rady', '_blank'); close(); }, keywords: 'profile network' },
  { id: 'link-email',    group: 'Links', label: 'Email',        sub: 'sherifabdelrady@gmail.com',          icon: Mail,     action: ({ close }) => { window.location.href = 'mailto:sherifabdelrady@gmail.com'; close(); }, keywords: 'contact hire' },
  { id: 'link-cv',       group: 'Links', label: 'Download CV',  sub: 'PDF — sherif-abdelrady-cv.pdf',      icon: Download, action: ({ close }) => { const a = document.createElement('a'); a.href='/sherif-abdelrady-cv.pdf'; a.download='sherif-abdelrady-cv.pdf'; a.click(); close(); }, keywords: 'resume pdf' },
];

const GROUP_ORDER: PaletteItem['group'][] = ['Navigate', 'Projects', 'Links'];

// ── Fuzzy filter ──────────────────────────────────────────────────────────────
function filterItems(items: PaletteItem[], query: string): PaletteItem[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      (item.sub ?? '').toLowerCase().includes(q) ||
      (item.keywords ?? '').toLowerCase().includes(q)
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  openDemo: (id: string) => void;
}

export default function CommandPalette({ open, onClose, openDemo }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const ctx: PaletteCtx = { close: onClose, openDemo };
  const filtered = filterItems(ITEMS, query);

  // Group filtered results
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: filtered.filter((i) => i.group === g),
  })).filter((g) => g.items.length > 0);

  // Flat list for keyboard nav
  const flat = grouped.flatMap((g) => g.items);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Clamp selected when filtered results change
  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, flat.length - 1)));
  }, [flat.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => (s + 1) % flat.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => (s - 1 + flat.length) % flat.length);
      } else if (e.key === 'Enter' && flat[selected]) {
        e.preventDefault();
        flat[selected].action(ctx);
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [flat, selected, ctx, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selected}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  // Global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  let flatIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search sections, projects, links…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground/60 bg-secondary border border-border rounded px-1.5 py-0.5 ml-2">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
              {grouped.length === 0 && (
                <p className="text-center text-muted-foreground font-mono text-sm py-10">
                  No results for "<span className="text-foreground">{query}</span>"
                </p>
              )}

              {grouped.map(({ group, items }) => (
                <div key={group}>
                  <p className="px-4 py-1.5 font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                    {group}
                  </p>
                  {items.map((item) => {
                    const idx = flatIdx++;
                    const Icon = item.icon;
                    const isSelected = idx === selected;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-idx={idx}
                        onMouseEnter={() => setSelected(idx)}
                        onClick={() => item.action(ctx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isSelected ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-primary/20' : 'bg-secondary'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium font-mono truncate">{item.label}</p>
                          {item.sub && (
                            <p className={`text-[11px] font-mono truncate transition-colors ${
                              isSelected ? 'text-primary/70' : 'text-muted-foreground'
                            }`}>{item.sub}</p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-primary/60 flex-shrink-0">
                            {item.group === 'Links' && <ExternalLink className="w-3 h-3" />}
                            {item.group !== 'Links' && <ArrowRight className="w-3 h-3" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="bg-secondary border border-border rounded px-1 py-0.5">↑</kbd>
                  <kbd className="bg-secondary border border-border rounded px-1 py-0.5">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-secondary border border-border rounded px-1 py-0.5">↵</kbd>
                  select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="bg-secondary border border-border rounded px-1.5 py-0.5">⌘K</kbd>
                to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
