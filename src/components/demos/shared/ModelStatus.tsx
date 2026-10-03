import React from 'react';
import { Loader2, CheckCircle2, XCircle, Info } from 'lucide-react';

export interface ModelStatusProps {
  status: 'idle' | 'loading' | 'ready' | 'error';
  message?: string;
  /** Shown below the uploader before first run — rough model size / load time hint */
  firstRunNote?: string;
}

export default function ModelStatus({ status, message, firstRunNote }: ModelStatusProps) {
  return (
    <>
      {/* Pre-run hint — only when idle and a note is provided */}
      {status === 'idle' && firstRunNote && (
        <div className="flex items-start gap-2 font-mono text-xs py-2 px-3 rounded-md bg-secondary/60 border border-border text-muted-foreground">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary/60" />
          <span>{firstRunNote}</span>
        </div>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div className="flex items-center gap-2 font-mono text-sm py-2 px-3 rounded-md bg-secondary border border-border">
          <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
          <span className="text-muted-foreground">{message || 'Loading AI model — first run only, cached after…'}</span>
        </div>
      )}

      {/* Ready */}
      {status === 'ready' && (
        <div className="flex items-center gap-2 font-mono text-sm py-2 px-3 rounded-md bg-secondary border border-border">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="text-emerald-600 dark:text-emerald-400">{message || 'Model ready'}</span>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex items-start gap-2 font-mono text-sm py-2 px-3 rounded-md bg-destructive/10 border border-destructive/30">
          <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-destructive block">{message || 'Failed to load model'}</span>
            <span className="text-[11px] text-muted-foreground block">
              Try refreshing the page. Requires a modern browser with WebGL enabled.
            </span>
          </div>
        </div>
      )}
    </>
  );
}
