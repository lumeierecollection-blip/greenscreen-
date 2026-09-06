import React, {useCallback, useRef} from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';
import {applyChromaKey, ChromaKeyOptions} from './chroma-key';

const intrinsicSize = (source: CanvasImageSource) => {
  if (source instanceof HTMLVideoElement) {
    return {width: source.videoWidth, height: source.videoHeight};
  }

  if (source instanceof HTMLImageElement) {
    return {width: source.naturalWidth, height: source.naturalHeight};
  }

  const sized = source as {width?: number; height?: number};
  return {width: sized.width ?? 0, height: sized.height ?? 0};
};

/**
 * Plays a green screen video with the backdrop removed, leaving whatever is
 * behind it visible.
 *
 * The video element itself is invisible. It stays mounted so that Remotion
 * decodes its frames and keeps its audio track in the render; every frame is
 * handed to the canvas, keyed, and drawn there instead.
 */
export const KeyedVideo: React.FC<{
  src: string;
  chromaKey: ChromaKeyOptions;
  /** Extra scale applied to the subject, 1 fills the frame. */
  zoom?: number;
  /** Horizontal nudge as a fraction of the frame width. */
  offsetX?: number;
  /** Vertical nudge as a fraction of the frame height. */
  offsetY?: number;
  volume?: number;
  /**
   * CSS filter applied to the keyed subject. A drop shadow reads off the alpha
   * channel, which grounds the subject against the new background.
   */
  filter?: string;
}> = ({src, chromaKey, zoom = 1, offsetX = 0, offsetY = 0, volume, filter}) => {
  const {width, height} = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d', {willReadFrequently: true});
      if (!canvas || !context) {
        return;
      }

      const source = intrinsicSize(frame);
      if (!source.width || !source.height) {
        return;
      }

      // Cover the frame, then apply the caller's zoom and nudge.
      const scale =
        Math.max(canvas.width / source.width, canvas.height / source.height) *
        zoom;
      const drawWidth = source.width * scale;
      const drawHeight = source.height * scale;
      const left = (canvas.width - drawWidth) / 2 + offsetX * canvas.width;
      const top = (canvas.height - drawHeight) / 2 + offsetY * canvas.height;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(frame, left, top, drawWidth, drawHeight);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      applyChromaKey(imageData.data, chromaKey);
      context.putImageData(imageData, 0, 0);
    },
    [chromaKey, offsetX, offsetY, zoom],
  );

  return (
    <>
      <OffthreadVideo
        src={staticFile(src)}
        onVideoFrame={onVideoFrame}
        volume={volume}
        style={{opacity: 0, position: 'absolute'}}
      />
      <AbsoluteFill style={{filter}}>
        <canvas ref={canvasRef} width={width} height={height} />
      </AbsoluteFill>
    </>
  );
};
