import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ObjectDetectionDemo from './ObjectDetectionDemo';
import ClassificationDemo from './ClassificationDemo';
import OCRDemo from './OCRDemo';
import SegmentationDemo from './SegmentationDemo';
import FaceDetectionDemo from './FaceDetectionDemo';
import SuperResDemo from './SuperResDemo';
import GANGalleryDemo from './GANGalleryDemo';
import ActionDemo from './ActionDemo';
import InferEdgeDemo from './InferEdgeDemo';
import VisionLangDemo from './VisionLangDemo';
import PoseForgeDemo from './PoseForgeDemo';
import DepthProDemo from './DepthProDemo';
import AutoPerceptionDemo from './AutoPerceptionDemo';

const PROJECTS_META: Record<string, { title: string; domain: string }> = {
  mediscan:        { title: 'MediScan — Medical Image Classifier',         domain: 'Image Classification'  },
  urbansense:      { title: 'UrbanSense — Real-time Object Detection',     domain: 'Object Detection'      },
  segforge:        { title: 'SegForge — Semantic Segmentation Pipeline',   domain: 'Image Segmentation'    },
  facevault:       { title: 'FaceVault — Face Recognition & Anti-Spoofing',domain: 'Face & Biometrics'     },
  trackmaster:     { title: 'TrackMaster — Multi-Object Video Tracking',   domain: 'Video CV'              },
  actionnet:       { title: 'ActionNet — Video Action Recognition',        domain: 'Video CV'              },
  docuai:          { title: 'DocuAI — OCR & Document Intelligence',        domain: 'OCR & Document AI'     },
  synthvision:     { title: 'SynthVision — GAN Image Generation',          domain: 'Generative Vision'     },
  superres:        { title: 'SuperRes — Image Super-Resolution',           domain: 'Generative Vision'     },
  inferedge:       { title: 'InferEdge — Production Inference System',     domain: 'Production Systems'    },
  visionlang:      { title: 'VisionLang — Multimodal Visual Search',       domain: 'Multimodal AI'         },
  poseforge:       { title: 'PoseForge — Real-time Pose & Gesture',        domain: 'Pose & Gesture'        },
  depthpro:        { title: 'DepthPro — Monocular Depth Estimation',       domain: '3D & Depth'            },
  autoperception:  { title: 'AutoPerception — BEV 3D Object Detection',    domain: 'Autonomous Systems'    },
};

export default function DemoModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const meta = PROJECTS_META[projectId];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  const renderDemo = () => {
    switch (projectId) {
      case 'urbansense':      return <ObjectDetectionDemo variant="detection" />;
      case 'trackmaster':     return <ObjectDetectionDemo variant="tracking" />;
      case 'mediscan':        return <ClassificationDemo />;
      case 'docuai':          return <OCRDemo />;
      case 'segforge':        return <SegmentationDemo />;
      case 'facevault':       return <FaceDetectionDemo />;
      case 'superres':        return <SuperResDemo />;
      case 'synthvision':     return <GANGalleryDemo />;
      case 'actionnet':       return <ActionDemo />;
      case 'inferedge':       return <InferEdgeDemo />;
      case 'visionlang':      return <VisionLangDemo />;
      case 'poseforge':       return <PoseForgeDemo />;
      case 'depthpro':        return <DepthProDemo />;
      case 'autoperception':  return <AutoPerceptionDemo />;
      default:
        return (
          <div className="p-8 text-center text-muted-foreground font-mono">
            Demo not found for this project.
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative z-10 flex flex-col"
        >
          <div className="sticky top-0 bg-card/90 backdrop-blur border-b border-border p-6 flex justify-between items-start z-20">
            <div>
              <span className="font-mono text-xs text-primary bg-primary/8 border border-primary/20 px-2 py-0.5 rounded-full mb-2 inline-block">
                {meta?.domain ?? 'Demo'}
              </span>
              <h2 id="demo-modal-title" className="text-2xl font-bold tracking-tight">
                {meta?.title ?? 'Live Demo'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 bg-secondary hover:bg-secondary/80 rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 flex-1">
            {renderDemo()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
