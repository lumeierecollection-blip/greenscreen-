import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {measureText} from '@remotion/layout-utils';
import {getHeadlineAtTime, TimedHeadline} from './headlines';

export const NEWS_FONT = 'Liberation Sans, Arial, Helvetica, sans-serif';

const RED = '#d81f2a';

/** Network badge in the top corner. */
export const LogoBug: React.FC<{name: string; scale: number}> = ({
  name,
  scale,
}) => (
  <div
    style={{
      position: 'absolute',
      top: 30 * scale,
      left: 26 * scale,
      display: 'flex',
      alignItems: 'stretch',
      fontFamily: NEWS_FONT,
      boxShadow: `0 ${4 * scale}px ${16 * scale}px rgba(0,0,0,0.45)`,
    }}
  >
    <div
      style={{
        background: RED,
        color: 'white',
        fontSize: 30 * scale,
        fontWeight: 700,
        letterSpacing: 1 * scale,
        padding: `${8 * scale}px ${12 * scale}px`,
        lineHeight: 1,
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
    <div
      style={{
        background: 'rgba(4,9,28,0.82)',
        color: 'white',
        fontSize: 19 * scale,
        fontWeight: 700,
        letterSpacing: 3 * scale,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${14 * scale}px`,
      }}
    >
      {name.toUpperCase()}
    </div>
  </div>
);

/** Pulsing LIVE pill with the on-air clock underneath. */
export const LiveBadge: React.FC<{clock: string; scale: number}> = ({
  clock,
  scale,
}) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(
    Math.sin((frame / 15) * Math.PI),
    [-1, 1],
    [0.35, 1],
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 30 * scale,
        right: 26 * scale,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8 * scale,
        fontFamily: NEWS_FONT,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8 * scale,
          background: RED,
          padding: `${7 * scale}px ${13 * scale}px`,
          boxShadow: `0 ${4 * scale}px ${16 * scale}px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          style={{
            width: 11 * scale,
            height: 11 * scale,
            borderRadius: '50%',
            background: 'white',
            opacity: pulse,
          }}
        />
        <span
          style={{
            color: 'white',
            fontSize: 21 * scale,
            fontWeight: 700,
            letterSpacing: 2 * scale,
          }}
        >
          LIVE
        </span>
      </div>
      <div
        style={{
          background: 'rgba(4,9,28,0.82)',
          color: 'white',
          fontSize: 18 * scale,
          fontWeight: 700,
          letterSpacing: 1.5 * scale,
          padding: `${5 * scale}px ${11 * scale}px`,
        }}
      >
        {clock}
      </div>
    </div>
  );
};

/**
 * Main headline bar — red, full width, shows the current timed headline.
 * Slides in from the left when a headline appears and slides out when it ends.
 */
export const HeadlineBar: React.FC<{
  headlines: TimedHeadline[];
  scale: number;
}> = ({headlines, scale}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const timeSec = frame / fps;

  const active = getHeadlineAtTime(headlines, timeSec);

  if (!active) {
    return null;
  }

  /* Animate the bar entering (first 8 frames) and leaving (last 8 frames). */
  const startFrame = active.startSec * fps;
  const endFrame = active.endSec * fps;
  const enterProgress = spring({
    frame: frame - startFrame,
    fps,
    config: {damping: 200, mass: 0.6},
  });
  const framesUntilEnd = endFrame - frame;
  const exitProgress =
    framesUntilEnd < 10
      ? interpolate(framesUntilEnd, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const opacity = Math.min(enterProgress, exitProgress);
  const slideX = interpolate(enterProgress, [0, 1], [-100, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 114 * scale,
        height: 56 * scale,
        background: RED,
        display: 'flex',
        alignItems: 'center',
        fontFamily: NEWS_FONT,
        opacity,
        transform: `translateX(${slideX}%)`,
        boxShadow: `0 ${4 * scale}px ${18 * scale}px rgba(0,0,0,0.5)`,
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 28 * scale,
          fontWeight: 700,
          letterSpacing: 1.5 * scale,
          padding: `0 ${24 * scale}px`,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
        }}
      >
        {active.text.toUpperCase()}
      </div>
    </div>
  );
};

/**
 * Black scrolling ticker at the very bottom — continuously scrolls through
 * all headline texts regardless of timing.
 */
export const ScrollingTicker: React.FC<{
  headlines: TimedHeadline[];
  scale: number;
  speed: number;
}> = ({headlines, scale, speed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const height = 58 * scale;
  const fontSize = 22 * scale;

  const segment =
    headlines.map((h) => h.text.toUpperCase()).join('     •     ') +
    '     •     ';
  const segmentWidth = measureText({
    text: segment,
    fontFamily: NEWS_FONT,
    fontSize,
    fontWeight: '700',
    letterSpacing: `${1 * scale}px`,
  }).width;

  const travelled = (frame / fps) * speed * scale;
  const shift = segmentWidth > 0 ? -(travelled % segmentWidth) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height,
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: NEWS_FONT,
        background: 'rgba(0,0,0,0.92)',
        borderTop: `${2 * scale}px solid ${RED}`,
      }}
    >
      <div style={{flex: 1, overflow: 'hidden', position: 'relative'}}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 16 * scale,
            transform: `translate(${shift}px, -50%)`,
            whiteSpace: 'pre',
            color: 'white',
            fontSize,
            fontWeight: 700,
            letterSpacing: 1 * scale,
          }}
        >
          {segment.repeat(4)}
        </div>
      </div>
    </div>
  );
};

/** Thin accent strip between headline bar and ticker. */
export const AccentStrip: React.FC<{scale: number}> = ({scale}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 58 * scale,
      height: 56 * scale,
      pointerEvents: 'none',
    }}
  />
);

export const NewsOverlay: React.FC<{
  network: string;
  clock: string;
  headlines: TimedHeadline[];
  tickerSpeed: number;
}> = ({network, clock, headlines, tickerSpeed}) => {
  const {width} = useVideoConfig();
  const scale = width / 720;

  return (
    <AbsoluteFill>
      <LogoBug name={network} scale={scale} />
      <LiveBadge clock={clock} scale={scale} />
      <HeadlineBar headlines={headlines} scale={scale} />
      <ScrollingTicker headlines={headlines} scale={scale} speed={tickerSpeed} />
    </AbsoluteFill>
  );
};
