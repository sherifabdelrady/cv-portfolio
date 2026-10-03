import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function generateFaceArt(canvas: HTMLCanvasElement, seed: number) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = 256; canvas.height = 256;
  
  const skinHue = (seed * 37) % 60;
  const grad = ctx.createRadialGradient(128, 110, 20, 128, 120, 130);
  grad.addColorStop(0, `hsl(${skinHue}, 60%, 75%)`);
  grad.addColorStop(0.7, `hsl(${skinHue}, 40%, 55%)`);
  grad.addColorStop(1, `hsl(${(seed*17)%360}, 30%, 20%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  
  ctx.save();
  ctx.scale(1, 1.3);
  ctx.beginPath();
  ctx.arc(128, 88, 70 + (seed % 10), 0, Math.PI * 2);
  ctx.fillStyle = `hsl(${skinHue}, 55%, 72%)`;
  ctx.fill();
  ctx.restore();
  
  [[90, 100], [166, 100]].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.ellipse(ex, ey, 12 + (seed%5), 7, 0, 0, Math.PI*2);
    ctx.fillStyle = `hsl(${(seed*53)%360}, 60%, 25%)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 2, ey, 4, 0, Math.PI*2);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 3, ey - 2, 1.5, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
  });
  
  ctx.beginPath();
  ctx.arc(128, 130, 5, 0, Math.PI*2);
  ctx.fillStyle = `hsl(${skinHue}, 40%, 60%)`;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(128, 155, 18 + (seed%8), Math.PI * 0.1, Math.PI * 0.9);
  ctx.strokeStyle = `hsl(${(seed*29)%30 + 340}, 60%, 35%)`;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(128, 68, 73, 45, 0, Math.PI, Math.PI*2);
  ctx.fillStyle = `hsl(${(seed*41)%360}, 50%, 20%)`;
  ctx.fill();
  
  const imageData = ctx.getImageData(0, 0, 256, 256);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.sin(i * seed * 0.001) * 8);
    imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + noise));
    imageData.data[i+1] = Math.min(255, Math.max(0, imageData.data[i+1] + noise*0.8));
    imageData.data[i+2] = Math.min(255, Math.max(0, imageData.data[i+2] + noise*0.6));
  }
  ctx.putImageData(imageData, 0, 0);
}

function FaceCanvas({ seed, index }: { seed: number, index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      generateFaceArt(canvasRef.current, seed);
    }
  }, [seed]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative group rounded-lg overflow-hidden border border-border shadow-sm"
    >
      <canvas ref={canvasRef} className="w-full h-auto block" />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-mono p-1 text-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
        Sample #{index + 1} | Epoch 2400
      </div>
    </motion.div>
  );
}

export default function GANGalleryDemo() {
  const [seeds, setSeeds] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setSeeds(Array.from({length: 9}, (_, i) => i + 1));
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSeeds(Array.from({length: 9}, () => Math.floor(Math.random() * 1000)));
      setIsGenerating(false);
    }, 300);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-6 flex flex-col sticky top-0">
        <div>
          <h3 className="text-xl font-bold mb-2">Latent Space Exploration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Interactive visualization of synthetic face generation. Each sample is generated deterministically from a latent noise vector.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            Generate New Batch
          </button>
        </div>
        
        <div className="bg-secondary/50 p-4 rounded-xl border border-border text-xs font-mono space-y-2">
          <h4 className="font-bold text-foreground mb-1 uppercase tracking-wider">Training Stats</h4>
          <div className="flex justify-between"><span className="text-muted-foreground">FID (Fréchet Inception Distance):</span><span className="font-bold text-primary">18.4</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">IS (Inception Score):</span><span className="font-bold text-primary">7.2</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Epoch:</span><span className="font-bold">2400</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Resolution:</span><span>256×256</span></div>
        </div>
        
        <p className="text-xs text-muted-foreground font-mono bg-secondary/30 p-3 rounded-lg">
          StyleGAN2 architecture. These samples are procedurally generated by the browser for demo purposes to simulate the trained model output.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <AnimatePresence mode="wait">
          {!isGenerating && seeds.map((seed, i) => (
            <FaceCanvas key={`${seed}-${i}`} seed={seed} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
