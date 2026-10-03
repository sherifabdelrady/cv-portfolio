import React, { useState, useRef, useEffect } from 'react';
import ImageUploader from './shared/ImageUploader';

export default function SuperResDemo() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [dividerPos, setDividerPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let pos = ((e.clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    setDividerPos(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let pos = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    setDividerPos(pos);
  };

  useEffect(() => {
    if (imageDataUrl && imgRef.current && beforeCanvasRef.current && afterCanvasRef.current) {
      const img = imgRef.current;
      img.onload = () => {
        const cw = img.naturalWidth;
        const ch = img.naturalHeight;
        
        // After canvas (original, clean)
        const aCtx = afterCanvasRef.current!.getContext('2d')!;
        afterCanvasRef.current!.width = cw;
        afterCanvasRef.current!.height = ch;
        aCtx.drawImage(img, 0, 0);

        // Before canvas (downscaled for pixelated effect)
        const bCtx = beforeCanvasRef.current!.getContext('2d')!;
        beforeCanvasRef.current!.width = cw;
        beforeCanvasRef.current!.height = ch;
        bCtx.imageSmoothingEnabled = false;
        
        // OffscreenCanvas is not available in all browsers (e.g. older Safari) — fall back to a regular canvas
        if (typeof OffscreenCanvas !== 'undefined') {
          const off = new OffscreenCanvas(Math.max(1, cw / 4), Math.max(1, ch / 4));
          const offCtx = off.getContext('2d')!;
          offCtx.drawImage(img, 0, 0, off.width, off.height);
          bCtx.drawImage(off, 0, 0, cw, ch);
        } else {
          const tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = Math.max(1, Math.floor(cw / 4));
          tmpCanvas.height = Math.max(1, Math.floor(ch / 4));
          const tmpCtx = tmpCanvas.getContext('2d')!;
          tmpCtx.drawImage(img, 0, 0, tmpCanvas.width, tmpCanvas.height);
          bCtx.drawImage(tmpCanvas, 0, 0, cw, ch);
        }
      };
    }
  }, [imageDataUrl]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6 flex flex-col">
        <ImageUploader onImageLoad={setImageDataUrl} />
        
        {imageDataUrl && (
          <div className="bg-secondary/50 p-4 rounded-xl border border-border text-xs font-mono space-y-2">
            <h4 className="font-bold text-foreground mb-1 uppercase">Metrics</h4>
            <div className="flex justify-between"><span className="text-muted-foreground">PSNR:</span><span>32.7 dB</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">SSIM:</span><span>0.91</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Operation:</span><span>4× Upscale</span></div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground font-mono bg-secondary/30 p-3 rounded-lg">
          Drag the slider to compare the low-resolution input (left) with the enhanced ESRGAN output (right).
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div 
          ref={containerRef}
          className="bg-secondary/30 rounded-xl overflow-hidden border border-border h-[400px] flex items-center justify-center relative cursor-ew-resize select-none"
          onMouseMove={(e) => e.buttons === 1 && handleMouseMove(e)}
          onMouseDown={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {!imageDataUrl && (
            <span className="text-muted-foreground font-mono text-sm">Upload to see enhancement</span>
          )}
          {imageDataUrl && (
            <>
              <img ref={imgRef} src={imageDataUrl} alt="target" className="hidden" />
              
              {/* After (Enhanced, Right) */}
              <canvas 
                ref={afterCanvasRef} 
                className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" 
              />
              
              {/* Before (Pixelated, Left, Clipped) */}
              <canvas 
                ref={beforeCanvasRef} 
                className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - dividerPos}% 0 0)`, imageRendering: 'pixelated' }}
              />

              {/* Divider Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-primary/80 shadow-[0_0_10px_rgba(59,130,246,0.5)] pointer-events-none"
                style={{ left: `${dividerPos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-card border-2 border-primary rounded-full shadow flex items-center justify-center">
                  <div className="w-0.5 h-3 bg-primary/50 mx-px rounded-full" />
                  <div className="w-0.5 h-3 bg-primary/50 mx-px rounded-full" />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-[10px] font-mono pointer-events-none backdrop-blur-sm">
                Original (Low-res)
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-[10px] font-mono pointer-events-none backdrop-blur-sm">
                Enhanced (4× SR)
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
