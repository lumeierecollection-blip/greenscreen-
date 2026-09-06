import React from 'react';
import {Composition, staticFile} from 'remotion';
import {parseMedia} from '@remotion/media-parser';
import {GreenscreenVideo, greenscreenVideoDefaults} from './GreenscreenVideo';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Greenscreen"
      component={GreenscreenVideo}
      defaultProps={greenscreenVideoDefaults}
      durationInFrames={378}
      fps={FPS}
      width={720}
      height={1280}
      calculateMetadata={async ({props}) => {
        // parseMedia reads the container directly, so this works in Chrome
        // builds that cannot decode H.264 themselves.
        const {slowDurationInSeconds, dimensions} = await parseMedia({
          src: staticFile(props.videoSrc),
          fields: {slowDurationInSeconds: true, dimensions: true},
        });

        return {
          durationInFrames: Math.floor(slowDurationInSeconds * FPS),
          width: dimensions?.width ?? 720,
          height: dimensions?.height ?? 1280,
        };
      }}
    />
  );
};
