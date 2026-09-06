import React, {useCallback, useRef} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';
import {applyChromaKey, ChromaKeyOptions, defaultChromaKeyOptions} from './chroma-key';

export type GreenscreenVideoProps = {
  videoSrc: string;
  backgroundSrc: string;
  /** Clockwise rotation applied to the background photo, in degrees. */
  backgroundRotation: 0 | 90 | 180 | 270;
  chromaKey: ChromaKeyOptions;
};

export const greenscreenVideoDefaults: GreenscreenVideoProps = {
  videoSrc: 'greenscreen.mp4',
  backgroundSrc: 'background.jpg',
  backgroundRotation: 90,
  chromaKey: defaultChromaKeyOptions,
};

const RotatedBackground: React.FC<{src: string; rotation: number}> = ({
  src,
  rotation,
}) => {
  const {width, height} = useVideoConfig();
  const swapped = rotation === 90 || rotation === 270;
  const boxWidth = swapped ? height : width;
  const boxHeight = swapped ? width : height;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          width: boxWidth,
          height: boxHeight,
          left: (width - boxWidth) / 2,
          top: (height - boxHeight) / 2,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <Img
          src={src}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </div>
    </AbsoluteFill>
  );
};

export const GreenscreenVideo: React.FC<GreenscreenVideoProps> = ({
  videoSrc,
  backgroundSrc,
  backgroundRotation,
  chromaKey,
}) => {
  const {width, height} = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(frame, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      applyChromaKey(imageData.data, chromaKey);
      context.putImageData(imageData, 0, 0);
    },
    [chromaKey],
  );

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <RotatedBackground
        src={staticFile(backgroundSrc)}
        rotation={backgroundRotation}
      />
      {/*
        The video itself is never shown. It decodes frames, hands each one to
        the canvas for keying, and keeps its audio track in the render.
      */}
      <OffthreadVideo
        src={staticFile(videoSrc)}
        onVideoFrame={onVideoFrame}
        style={{opacity: 0, position: 'absolute'}}
      />
      <AbsoluteFill>
        <canvas ref={canvasRef} width={width} height={height} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
