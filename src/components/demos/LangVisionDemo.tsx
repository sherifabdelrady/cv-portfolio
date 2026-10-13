import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, RotateCcw, Brain } from 'lucide-react';

const DEMO_QA: Array<{ image: string; icon: string; questions: Array<{ q: string; a: string; tokens: number; ms: number }> }> = [
  {
    image: 'Chest X-ray',
    icon: '🫁',
    questions: [
      { q: 'What abnormalities are visible?', a: 'Bilateral lower-lobe infiltrates consistent with bacterial pneumonia. No pleural effusion or pneumothorax. Cardiac silhouette within normal limits. Recommend follow-up CT in 4–6 weeks.', tokens: 48, ms: 312 },
      { q: 'Is this urgent?', a: 'Yes — bilateral pneumonia with consolidation warrants prompt clinical evaluation. Oxygen saturation monitoring and empirical antibiotics should be considered immediately.', tokens: 36, ms: 241 },
    ],
  },
  {
    image: 'Invoice Document',
    icon: '📄',
    questions: [
      { q: 'What is the total amount due?', a: '$4,287.50 USD. Breakdown: Consulting services (3 days × $1,200) = $3,600.00; Travel expenses = $687.50. Payment due: 30 days from invoice date.', tokens: 52, ms: 344 },
      { q: 'Who is the vendor?', a: 'TechConsult LLC, registered in Delaware. VAT ID: US-88-4521673. Primary contact: accounts@techconsult.io.', tokens: 31, ms: 208 },
    ],
  },
  {
    image: 'Street Scene',
    icon: '🏙️',
    questions: [
      { q: 'How many people are in the scene?', a: '7 pedestrians visible. 3 are crossing at the marked crosswalk, 2 are waiting at the corner, 1 is cycling on the bike lane, 1 is partially occluded behind a vehicle on the right edge.', tokens: 55, ms: 367 },
      { q: 'What time of day does this appear to be?', a: 'Late afternoon — estimated 5–6 PM. Indicators: long shadows cast westward, warm golden lighting angle, moderate pedestrian density consistent with post-work hours.', tokens: 42, ms: 281 },
    ],
  },
];

export default function LangVisionDemo() {
  const [sceneIdx, setSceneIdx]   = useState(0);
  const [qIdx, setQIdx]           = useState(0);
  const [phase, setPhase]         = useState<'idle'|'thinking'|'streaming'|'done'>('idle');
  const [displayed, setDisplayed] = useState('');
  const [tokenCount, setTokenCount] = useState(0);

  const scene   = DEMO_QA[sceneIdx];
  const current = scene.questions[qIdx];

  const ask = () => {
    setPhase('thinking');
    setDisplayed('');
    setTokenCount(0);

    // Simulate LLM thinking delay then streaming
    setTimeout(() => {
      setPhase('streaming');
      const answer = current.a;
      let i = 0;
      const interval = setInterval(() => {
        i += Math.floor(Math.random() * 3) + 1;
        const chunk = answer.slice(0, Math.min(i, answer.length));
        setDisplayed(chunk);
        setTokenCount(Math.floor((chunk.length / answer.length) * current.tokens));
        if (i >= answer.length) {
          clearInterval(interval);
          setTokenCount(current.tokens);
          setPhase('done');
        }
      }, 18);
    }, 480);
  };

  const reset = () => { setPhase('idle'); setDisplayed(''); setTokenCount(0); };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
        <Brain className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          LLaVA-1.6 answers questions about images. Select a scene, pick a question, watch tokens stream.
        </p>
      </div>

      {/* Scene selector */}
      <div className="flex gap-2">
        {DEMO_QA.map((s, i) => (
          <button
            key={s.image}
            onClick={() => { setSceneIdx(i); setQIdx(0); reset(); }}
            className={`flex-1 py-2 px-3 rounded-lg border font-mono text-xs transition-all ${
              sceneIdx === i
                ? 'bg-primary/10 border-primary/40 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            {s.icon} {s.image}
          </button>
        ))}
      </div>

      {/* Chat UI */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-secondary/40 px-4 py-2.5 border-b border-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">LLaVA-1.6 · {scene.icon} {scene.image}</span>
          <span className="ml-auto text-xs font-mono text-muted-foreground">35 tok/s · A100</span>
        </div>

        {/* Question selector */}
        <div className="p-4 border-b border-border space-y-2">
          {scene.questions.map((item, i) => (
            <button
              key={i}
              onClick={() => { setQIdx(i); reset(); }}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                qIdx === i ? 'border-primary/40 bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 inline mr-2 opacity-60" />
              {item.q}
            </button>
          ))}
        </div>

        {/* Response area */}
        <div className="p-4 min-h-[100px] font-mono text-sm">
          {phase === 'idle' && (
            <p className="text-muted-foreground text-xs">Select a question and click Ask →</p>
          )}
          {phase === 'thinking' && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
              LLaVA thinking…
            </div>
          )}
          {(phase === 'streaming' || phase === 'done') && (
            <p className="text-foreground leading-relaxed">
              {displayed}
              {phase === 'streaming' && <span className="animate-pulse text-primary">▋</span>}
            </p>
          )}
        </div>

        {/* Metrics bar */}
        {phase !== 'idle' && (
          <div className="px-4 py-2 bg-secondary/30 border-t border-border flex gap-4 text-xs font-mono text-muted-foreground">
            <span>Tokens: <span className="text-primary">{tokenCount}</span></span>
            <span>Latency: <span className="text-primary">{current.ms}ms</span></span>
            <span>Backend: <span className="text-primary">vLLM · PagedAttention</span></span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={ask}
          disabled={phase === 'thinking' || phase === 'streaming'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-mono text-sm font-semibold disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {phase === 'thinking' ? 'Thinking…' : phase === 'streaming' ? 'Generating…' : 'Ask LLaVA'}
        </motion.button>
        <button onClick={reset} className="px-4 py-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-secondary/30 rounded-xl p-4 border border-border text-xs font-mono text-muted-foreground space-y-1">
        <p><span className="text-primary">Vision:</span> CLIP ViT-L/14 at 672×672 → 2880 visual tokens (LLaVA-1.6 dynamic tiling)</p>
        <p><span className="text-amber-400">LLM:</span> LLaMA-3-8B + LoRA (r=16) fine-tuned on 50K domain samples</p>
        <p><span className="text-emerald-400">Serving:</span> vLLM PagedAttention → 3× throughput vs HuggingFace</p>
      </div>
    </div>
  );
}
