/**
 * Classification Engine
 * Depthwise-separable CNN with global average pooling.
 * 1 000-class ImageNet backbone; fine-tunable on domain datasets.
 * Runs entirely in-browser via WebGL; no server round-trips.
 */

export type ClassPrediction = {
  className: string;
  probability: number;
};

let _clf: { classify: (img: HTMLImageElement, topK: number) => Promise<ClassPrediction[]> } | null = null;

export async function initClassificationEngine(): Promise<void> {
  if (_clf) return;
  await import('@tensorflow/tfjs');
  const runtime = await import('@tensorflow-models/mobilenet');
  _clf = await runtime.load();
}

export async function runClassification(
  img: HTMLImageElement,
  topK = 5
): Promise<ClassPrediction[]> {
  await initClassificationEngine();
  return _clf!.classify(img, topK);
}
