/**
 * VisionLang Demo — Multimodal Visual Search
 * Gallery of 9 images indexed with MobileNet (simulates CLIP image encoder).
 * Text queries are matched against MobileNet predictions (simulates CLIP text encoder + cosine similarity).
 * Production uses CLIP ViT-L/14 + FAISS IVF-PQ over 1M+ images at <3ms p99.
 */
import React, { useState, useRef } from 'react';
import { Search, Database, Loader2, Info } from 'lucide-react';
import ModelStatus from './shared/ModelStatus';
import { runClassification } from '@/lib/vision/classification-engine';

type GalleryEntry = {
  id: number;
  url: string;
  labels: string[];
  topScore: number;
  matchScore: number;
};

// Curated picsum photo IDs that classify well with MobileNet
const GALLERY_IDS = [1, 10, 20, 30, 37, 40, 50, 67, 82];

function cosineSim(query: string, labels: string[]): number {
  if (!query.trim() || labels.length === 0) return 0;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const labelStr = labels.join(' ').toLowerCase();
  let hits = 0;
  for (const w of words) {
    if (labelStr.includes(w)) hits++;
  }
  return hits / words.length;
}

export default function VisionLangDemo() {
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [gallery, setGallery] = useState<GalleryEntry[]>(
    GALLERY_IDS.map((id) => ({ id, url: `https://picsum.photos/id/${id}/280/200`, labels: [], topScore: 0, matchScore: 0 }))
  );
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const indexGallery = async () => {
    setIndexing(true);
    setModelStatus('loading');
    try {
      const classified = await Promise.all(
        imgRefs.current.map(async (img, i) => {
          if (!img || !img.complete) return { id: GALLERY_IDS[i], labels: [], topScore: 0 };
          const preds = await runClassification(img, 5);
          const labels = preds.flatMap((p) =>
            p.className.split(',').map((s) => s.trim().toLowerCase())
          );
          return { id: GALLERY_IDS[i], labels, topScore: preds[0]?.probability ?? 0 };
        })
      );
      setGallery((prev) =>
        prev.map((g, i) => ({
          ...g,
          labels: classified[i].labels,
          topScore: classified[i].topScore,
        }))
      );
      setModelStatus('ready');
    } catch {
      setModelStatus('error');
    } finally {
      setIndexing(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);
    setGallery((prev) =>
      [...prev]
        .map((img) => ({ ...img, matchScore: cosineSim(query, img.labels) }))
        .sort((a, b) => b.matchScore - a.matchScore)
    );
  };

  const handleReset = () => {
    setSearched(false);
    setQuery('');
    setGallery((prev) => prev.map((g) => ({ ...g, matchScore: 0 })));
  };

  const indexed = gallery.some((g) => g.labels.length > 0);

  return (
    <div className="space-y-5">
      {/* Step 1 — Index */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-border">
        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs text-primary font-bold">1</div>
        <div className="flex-1 space-y-2">
          <p className="font-mono text-sm text-foreground font-medium">Index gallery with MobileNet</p>
          <p className="text-xs text-muted-foreground">Simulates CLIP image encoder — extracts semantic labels from each photo.</p>
          <ModelStatus
            status={modelStatus}
            firstRunNote="Downloads MobileNet (~8 MB) and classifies all 9 gallery images. Cached after first run."
            message={indexing ? `Classifying images with MobileNet…` : undefined}
          />
          {!indexed && (
            <button
              type="button"
              onClick={indexGallery}
              disabled={indexing}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {indexing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              {indexing ? 'Indexing…' : 'Build Index'}
            </button>
          )}
        </div>
      </div>

      {/* Step 2 — Search */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${indexed ? 'bg-secondary/40 border-border' : 'bg-secondary/20 border-border/40 opacity-60 pointer-events-none'}`}>
        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs text-primary font-bold">2</div>
        <div className="flex-1 space-y-2">
          <p className="font-mono text-sm text-foreground font-medium">Search by natural language</p>
          <p className="text-xs text-muted-foreground">Try: <span className="text-primary">mountain</span> · <span className="text-primary">dog</span> · <span className="text-primary">water</span> · <span className="text-primary">food</span> · <span className="text-primary">building</span></p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Describe what you're looking for…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={!query.trim()}
              className="bg-primary text-primary-foreground font-mono text-sm font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              Retrieve
            </button>
            {searched && (
              <button type="button" onClick={handleReset} className="px-3 py-2 border border-border rounded-lg font-mono text-sm hover:bg-secondary transition-colors">
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-3 gap-3">
        {gallery.map((img, i) => {
          const isMatch = searched && img.matchScore > 0;
          const isNoMatch = searched && img.matchScore === 0;
          return (
            <div
              key={img.id}
              className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                isMatch ? 'border-primary shadow-md shadow-primary/20 scale-[1.02]' :
                isNoMatch ? 'border-border opacity-40 scale-95' :
                'border-border'
              }`}
            >
              <div className="relative h-28 bg-secondary">
                <img
                  ref={(el) => { imgRefs.current[i] = el; }}
                  src={img.url}
                  alt={`Gallery image ${img.id}`}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/280/200?random=${img.id}`; }}
                />
                {isMatch && (
                  <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {(img.matchScore * 100).toFixed(0)}%
                  </div>
                )}
              </div>
              <div className="p-2 bg-card min-h-[44px]">
                {img.labels.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {img.labels.slice(0, 3).map((l) => (
                        <span key={l} className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border truncate max-w-[80px] ${
                          isMatch ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary border-border text-muted-foreground'
                        }`} title={l}>
                          {l.length > 12 ? l.slice(0, 11) + '…' : l}
                        </span>
                      ))}
                    </div>
                    {isMatch && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${img.matchScore * 100}%` }} />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] font-mono text-muted-foreground">not indexed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 text-[11px] font-mono text-muted-foreground border-t border-border pt-3">
        <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary/50" />
        <span>
          <span className="text-primary">Production:</span> CLIP ViT-L/14 image encoder → 512-d embeddings → FAISS IVF-PQ index (1M images, 3ms p99 query latency). Text encoder maps queries to same embedding space for cross-modal cosine similarity.
        </span>
      </div>
    </div>
  );
}
