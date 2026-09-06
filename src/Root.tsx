import React from 'react';
import {Composition, staticFile} from 'remotion';
import {parseMedia} from '@remotion/media-parser';
import {GreenscreenVideo, greenscreenVideoDefaults} from './GreenscreenVideo';
import {NewsBroadcast, newsBroadcastDefaults} from './news/NewsBroadcast';

const FPS = 30;

/**
 * Reads size and duration from the container itself. parseMedia is used rather
 * than a video tag so this also works in Chrome builds that cannot decode
 * H.264 on their own.
 */
const durationOf = async (videoSrc: string) => {
  const {slowDurationInSeconds} = await parseMedia({
    src: staticFile(videoSrc),
    fields: {slowDurationInSeconds: true},
  });

  return Math.floor(slowDurationInSeconds * FPS);
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Greenscreen"
        component={GreenscreenVideo}
        defaultProps={greenscreenVideoDefaults}
        durationInFrames={378}
        fps={FPS}
        width={720}
        height={1280}
        calculateMetadata={async ({props}) => {
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
      <Composition
        id="NewsBroadcast"
        component={NewsBroadcast}
        defaultProps={newsBroadcastDefaults}
        durationInFrames={504}
        fps={FPS}
        // Fixed 9:16 so the graphics keep their proportions no matter what the
        // source clip measures; the anchor is scaled to cover it.
        width={720}
        height={1280}
        calculateMetadata={async ({props}) => ({
          durationInFrames: await durationOf(props.videoSrc),
        })}
      />
    </>
  );
};
