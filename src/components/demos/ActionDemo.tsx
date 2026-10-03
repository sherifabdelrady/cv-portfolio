import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACTION_CLASSES = [
  { label: 'Running', color: '#3B82F6' },
  { label: 'Jumping', color: '#10B981' },
  { label: 'Walking', color: '#F59E0B' },
  { label: 'Standing', color: '#8B5CF6' },
  { label: 'Sitting', color: '#EC4899' },
  { label: 'Falling', color: '#EF4444' },
  { label: 'Gesturing', color: '#06B6D4' },
  { label: 'Throwing', color: '#84CC16' },
];

export default function ActionDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [probabilities, setProbabilities] = useState<number[]>([
    0.874, 0.052, 0.041, 0.012, 0.005, 0.001, 0.008, 0.007
  ]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const raw = ACTION_CLASSES.map(() => Math.random() * Math.random());
      const sum = raw.reduce((a, b) => a + b, 0);
      setProbabilities(raw.map(v => v / sum));
      setIsAnalyzing(false);
    }, 1500);
  };

  const topIndex = probabilities.indexOf(Math.max(...probabilities));
  const topAction = ACTION_CLASSES[topIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6 flex flex-col">
        <div className="bg-secondary/30 rounded-xl overflow-hidden border border-border aspect-video flex items-center justify-center relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent mix-blend-overlay" />
          <div className="text-center space-y-2 relative z-10">
            <div className="w-16 h-16 bg-card/50 rounded-full mx-auto flex items-center justify-center backdrop-blur shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <p className="text-sm font-mono text-muted-foreground font-semibold">Sample Video Stream</p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow hover:bg-primary/90 disabled:opacity-50 transition-all"
        >
          {isAnalyzing ? 'Running Inference...' : 'Analyze Sequence'}
        </button>

        <div className="text-xs text-muted-foreground font-mono bg-secondary/50 p-3 rounded-lg grid grid-cols-2 gap-2">
          <div><span className="opacity-70">Model:</span> SlowFast-R50</div>
          <div><span className="opacity-70">Temporal windows:</span> 8 × 8</div>
          <div><span className="opacity-70">Inference:</span> ~41ms</div>
          <div><span className="opacity-70">Status:</span> {isAnalyzing ? 'Processing' : 'Idle'}</div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm min-h-[400px] flex flex-col">
        <h4 className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">Action Probabilities</h4>
        
        <div className="mb-8">
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={topAction.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold flex items-center gap-3"
            >
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: topAction.color }} />
              Predicted: {topAction.label} <span className="text-muted-foreground text-lg ml-2">({(probabilities[topIndex] * 100).toFixed(1)}%)</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4 flex-1">
          {ACTION_CLASSES.map((action, i) => (
            <div key={action.label} className="relative">
              <div className="flex justify-between text-xs font-mono mb-1 z-10 relative px-1 mix-blend-luminosity">
                <span className="font-semibold text-foreground/80">{action.label}</span>
                <span className="font-bold">{(probabilities[i] * 100).toFixed(1)}%</span>
              </div>
              <div className="h-6 w-full bg-secondary rounded-md overflow-hidden relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full"
                  style={{ backgroundColor: action.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${probabilities[i] * 100}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
