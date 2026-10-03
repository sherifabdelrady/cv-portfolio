import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Server, Zap, RotateCcw } from 'lucide-react';

export default function InferEdgeDemo() {
  const [requestCount, setRequestCount] = useState(0);
  const [avgLatency, setAvgLatency] = useState(7);
  const [throughput, setThroughput] = useState(0);
  const [history, setHistory] = useState<number[]>(Array(20).fill(7));
  const [startTime] = useState(Date.now());
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newReqs = Math.floor(Math.random() * 5) + 3;
      const currentLatency = 7 + (Math.random() * 4 - 2); // 5-9ms
      
      setRequestCount(prev => prev + newReqs);
      
      setHistory(prev => {
        const next = [...prev, currentLatency];
        if (next.length > 20) next.shift();
        return next;
      });

      setAvgLatency(prev => (prev * 0.9) + (currentLatency * 0.1));
      
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds > 0) {
        setThroughput(Math.round(requestCount / elapsedSeconds));
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isActive, requestCount, startTime]);

  const p50 = 7.1;
  const p90 = 8.5;
  const p99 = history[history.length-1] > 9 ? history[history.length-1] : 9.2;

  const reset = () => {
    setRequestCount(0);
    setThroughput(0);
    setHistory(Array(20).fill(7));
  };

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary/40 border border-border p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">{avgLatency.toFixed(1)} ms</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Avg Latency</div>
          </div>
        </div>
        <div className="bg-secondary/40 border border-border p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">{throughput} req/s</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Throughput</div>
          </div>
        </div>
        <div className="bg-secondary/40 border border-border p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono">99.99%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Uptime</div>
          </div>
        </div>
      </div>

      {/* Pipeline Vis */}
      <div className="bg-card border border-border rounded-xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between max-w-3xl mx-auto gap-8">
          
          <div className="flex flex-col items-center z-10">
            <div className="w-20 h-20 bg-secondary rounded-2xl border border-border flex items-center justify-center mb-3 relative">
              <Server className="w-8 h-8 text-muted-foreground" />
              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold font-mono"
                key={requestCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
              >
                {requestCount % 100}
              </motion.div>
            </div>
            <span className="font-mono text-xs font-semibold">Request Queue</span>
          </div>

          <div className="flex-1 h-px bg-border relative w-full md:w-auto my-8 md:my-0">
            <motion.div 
              className="absolute top-1/2 left-0 w-2 h-2 bg-primary rounded-full -translate-y-1/2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              animate={{ left: ["0%", "100%"] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="w-24 h-24 bg-primary/10 border-2 border-primary rounded-2xl flex flex-col items-center justify-center mb-3 relative overflow-hidden group">
              <motion.div 
                className="absolute inset-0 bg-primary/10"
                animate={{ y: ["100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
              />
              <Cpu className="w-10 h-10 text-primary relative z-10" />
            </div>
            <span className="font-mono text-xs font-semibold text-primary">GPU Inference (Triton)</span>
          </div>

          <div className="flex-1 h-px bg-border relative w-full md:w-auto my-8 md:my-0">
            <motion.div 
              className="absolute top-1/2 left-0 w-2 h-2 bg-emerald-500 rounded-full -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              animate={{ left: ["0%", "100%"] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            />
          </div>

          <div className="flex flex-col items-center z-10">
            <div className="w-20 h-20 bg-secondary rounded-2xl border border-border flex items-center justify-center mb-3 relative">
              <span className="font-mono font-bold text-lg text-emerald-600">200</span>
            </div>
            <span className="font-mono text-xs font-semibold">Response</span>
          </div>
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        {/* Histogram */}
        <div className="bg-secondary/20 p-6 rounded-xl border border-border">
          <h4 className="font-mono text-xs font-semibold text-muted-foreground uppercase mb-6 flex justify-between">
            <span>Latency Distribution</span>
            <span className="text-primary">Live</span>
          </h4>
          <div className="flex items-end justify-between h-32 gap-2">
            {[
              { label: 'p50', val: p50 },
              { label: 'p75', val: 7.8 },
              { label: 'p90', val: p90 },
              { label: 'p95', val: 8.8 },
              { label: 'p99', val: p99 },
              { label: 'Max', val: 12.4 }
            ].map(stat => (
              <div key={stat.label} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-6">
                  {stat.val.toFixed(1)}
                </div>
                <motion.div 
                  className={`w-full rounded-t-sm ${stat.label === 'p99' ? 'bg-primary' : 'bg-primary/30'}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(100, stat.val * 8)}%` }}
                  transition={{ type: 'spring' }}
                />
                <div className="text-[10px] font-mono text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-muted-foreground font-mono bg-secondary/50 p-4 rounded-xl space-y-2 border border-border">
            <div className="flex justify-between"><span className="font-semibold">Model:</span> <span>EfficientDet-D3</span></div>
            <div className="flex justify-between"><span className="font-semibold">Batch size:</span> <span>32 (dynamic)</span></div>
            <div className="flex justify-between"><span className="font-semibold">Quantization:</span> <span>INT8 (TensorRT)</span></div>
            <div className="flex justify-between"><span className="font-semibold">Backend:</span> <span>Triton Inference Server</span></div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex-1 border border-border font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-secondary transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isActive ? 'Pause Traffic' : 'Resume Traffic'}
            </button>
            <button
              onClick={reset}
              className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
