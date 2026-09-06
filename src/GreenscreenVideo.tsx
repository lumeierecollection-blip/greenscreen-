import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {ChromaKeyOptions, defaultChromaKeyOptions} from './chroma-key';
import {KeyedVideo} from './KeyedVideo';

export type GreenscreenVideoProps = {
  videoSrc: string;
  backgroundSrc: string;
  /** Clockwise rotation applied to the background photo, in degrees. */
  backgroundRotation: 0 | 90 | 180 | 270;
  /** Mirrors the background photo left-to-right. */
  backgroundFlip?: boolean;
  /** Extra scale on the background photo, applied about its centre. */
  backgroundZoom?: number;
  /** Horizontal shift of the background photo, in pixels. */
  backgroundOffsetX?: number;
  /** Vertical shift of the background photo, in pixels. */
  backgroundOffsetY?: number;
  chromaKey: ChromaKeyOptions;
};

export const greenscreenVideoDefaults: GreenscreenVideoProps = {
  videoSrc: 'greenscreen.mp4',
  backgroundSrc: 'background.jpg',
  backgroundRotation: 90,
  backgroundFlip: false,
  backgroundZoom: 1,
  backgroundOffsetX: 0,
  backgroundOffsetY: 0,
  chromaKey: defaultChromaKeyOptions,
};

const RotatedBackground: React.FC<{
  src: string;
  rotation: number;
  flip?: boolean;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
}> = ({src, rotation, flip, zoom = 1, offsetX = 0, offsetY = 0}) => {
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
          // offsetX/Y are plain screen-pixel shifts: translate is the outermost
          // step, so it moves the final image regardless of the rotate/scale
          // applied to reach it. zoom is applied about the box centre so the
          // shift never uncovers empty edges as long as it is generous enough.
          transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scaleX(${flip ? -1 : 1}) scale(${zoom})`,
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
  backgroundFlip,
  backgroundZoom,
  backgroundOffsetX,
  backgroundOffsetY,
  chromaKey,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <RotatedBackground
        src={staticFile(backgroundSrc)}
        rotation={backgroundRotation}
        flip={backgroundFlip}
        zoom={backgroundZoom}
        offsetX={backgroundOffsetX}
        offsetY={backgroundOffsetY}
      />
      <KeyedVideo src={videoSrc} chromaKey={chromaKey} />
    </AbsoluteFill>
  );
};
