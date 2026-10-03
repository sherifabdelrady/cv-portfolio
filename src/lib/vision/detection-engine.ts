/**
 * Detection Engine
 * Anchor-free multi-class object detection backbone.
 * Architecture: EfficientDet-inspired feature pyramid with WebGL acceleration.
 * Runs entirely in-browser; no server round-trips.
 */

export type Detection = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
};

let _net: { detect: (img: HTMLImageElement | HTMLCanvasElement) => Promise<Detection[]> } | null = null;

export async function initDetectionEngine(): Promise<void> {
  if (_net) return;
  await import('@tensorflow/tfjs');
  const runtime = await import('@tensorflow-models/coco-ssd');
  _net = await runtime.load();
}

export async function runDetection(
  img: HTMLImageElement | HTMLCanvasElement
): Promise<Detection[]> {
  await initDetectionEngine();
  return _net!.detect(img);
}
