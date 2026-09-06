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
  chromaKey: ChromaKeyOptions;
};

export const greenscreenVideoDefaults: GreenscreenVideoProps = {
  videoSrc: 'greenscreen.mp4',
  backgroundSrc: 'background.jpg',
  backgroundRotation: 90,
  backgroundFlip: false,
  chromaKey: defaultChromaKeyOptions,
};

const RotatedBackground: React.FC<{
  src: string;
  rotation: number;
  flip?: boolean;
}> = ({src, rotation, flip}) => {
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
          transform: `rotate(${rotation}deg) scaleX(${flip ? -1 : 1})`,
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
  chromaKey,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <RotatedBackground
        src={staticFile(backgroundSrc)}
        rotation={backgroundRotation}
        flip={backgroundFlip}
      />
      <KeyedVideo src={videoSrc} chromaKey={chromaKey} />
    </AbsoluteFill>
  );
};
