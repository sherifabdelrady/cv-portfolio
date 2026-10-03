import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="font-mono text-primary text-sm mb-4 uppercase tracking-widest">Error 404</div>
        <h1 className="text-6xl font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-[0_4px_16px_rgba(59,130,246,0.2)]"
          >
            <Home className="w-4 h-4" />
            Back to Portfolio
          </a>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground border border-border font-mono rounded-lg hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
