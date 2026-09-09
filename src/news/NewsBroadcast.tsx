import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ChromaKeyOptions} from '../chroma-key';
import {KeyedVideo} from '../KeyedVideo';
import {NewsOverlay} from './Graphics';
import {churchHeadlines, TimedHeadline} from './headlines';
import {defaultStudioPalette, StudioBackground, StudioPalette} from './StudioBackground';

export type NewsBroadcastProps = {
  videoSrc: string;
  chromaKey: ChromaKeyOptions;
  /** Scale and position of the anchor inside the frame. */
  anchorZoom: number;
  anchorOffsetX: number;
  anchorOffsetY: number;
  palette: StudioPalette;
  network: string;
  clock: string;
  headlines: TimedHeadline[];
  tickerSpeed: number;
};

/**
 * The green screen in this clip is lit unevenly: the backdrop scores 67 to 144
 * on the greenness scale while the anchor never rises above 1, so the key sits
 * comfortably between the two.
 */
export const newsChromaKey: ChromaKeyOptions = {
  threshold: 60,
  softness: 28,
  spillSuppression: 0.9,
  minBrightness: 24,
  edgeBlur: 1.5,
};

export const newsBroadcastDefaults: NewsBroadcastProps = {
  videoSrc: 'greenscreen-news.mp4',
  chromaKey: newsChromaKey,
  anchorZoom: 1,
  anchorOffsetX: 0,
  anchorOffsetY: 0,
  palette: defaultStudioPalette,
  network: 'CFC',
  clock: '20:00',
  headlines: churchHeadlines,
  tickerSpeed: 90,
};

export const NewsBroadcast: React.FC<NewsBroadcastProps> = ({
  videoSrc,
  chromaKey,
  anchorZoom,
  anchorOffsetX,
  anchorOffsetY,
  palette,
  network,
  clock,
  headlines,
  tickerSpeed,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: palette.deep}}>
      <StudioBackground palette={palette} />
      <KeyedVideo
        src={videoSrc}
        chromaKey={chromaKey}
        zoom={anchorZoom}
        offsetX={anchorOffsetX}
        offsetY={anchorOffsetY}
        filter="drop-shadow(0 10px 26px rgba(0,0,0,0.6))"
      />
      <NewsOverlay
        network={network}
        clock={clock}
        headlines={headlines}
        tickerSpeed={tickerSpeed}
      />
    </AbsoluteFill>
  );
};
