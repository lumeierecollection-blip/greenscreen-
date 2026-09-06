import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {measureText} from '@remotion/layout-utils';

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
  const pulse = interpolate(Math.sin((frame / 15) * Math.PI), [-1, 1], [0.35, 1]);

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

/** Name and role banner, sliding in over the anchor's shoulder. */
export const LowerThird: React.FC<{
  headline: string;
  name: string;
  role: string;
  scale: number;
  startFrame: number;
}> = ({headline, name, role, scale, startFrame}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  const enter = spring({
    frame: frame - startFrame,
    fps,
    config: {damping: 200, mass: 0.7},
  });
  const slide = interpolate(enter, [0, 1], [-width, 0]);
  const headlineEnter = spring({
    frame: frame - startFrame - 8,
    fps,
    config: {damping: 200, mass: 0.7},
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 132 * scale,
        fontFamily: NEWS_FONT,
      }}
    >
      <div
        style={{
          transform: `translateX(${interpolate(headlineEnter, [0, 1], [-width, 0])}px)`,
          background: RED,
          color: 'white',
          fontSize: 25 * scale,
          fontWeight: 700,
          letterSpacing: 1.5 * scale,
          padding: `${9 * scale}px ${20 * scale}px`,
          marginLeft: 26 * scale,
          display: 'inline-block',
        }}
      >
        {headline.toUpperCase()}
      </div>
      <div
        style={{
          transform: `translateX(${slide}px)`,
          marginTop: 5 * scale,
          background:
            'linear-gradient(90deg, rgba(6,17,46,0.96) 0%, rgba(11,36,86,0.92) 100%)',
          borderLeft: `${6 * scale}px solid ${RED}`,
          padding: `${13 * scale}px ${22 * scale}px ${15 * scale}px`,
          maxWidth: width - 52 * scale,
          marginLeft: 26 * scale,
          boxShadow: `0 ${6 * scale}px ${22 * scale}px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 38 * scale,
            fontWeight: 700,
            letterSpacing: 0.5 * scale,
            lineHeight: 1.1,
          }}
        >
          {name.toUpperCase()}
        </div>
        <div
          style={{
            color: '#8fc4ff',
            fontSize: 21 * scale,
            fontWeight: 700,
            letterSpacing: 2 * scale,
            marginTop: 5 * scale,
          }}
        >
          {role.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

/** Bottom crawl. The headlines repeat, so the strip never runs out. */
export const Ticker: React.FC<{
  label: string;
  headlines: string[];
  scale: number;
  /** Pixels per second, before scaling. */
  speed: number;
}> = ({label, headlines, scale, speed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const height = 74 * scale;
  const fontSize = 23 * scale;

  const segment = headlines.map((h) => h.toUpperCase()).join('     •     ') + '     •     ';
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
        background: 'rgba(4,9,28,0.94)',
        borderTop: `${3 * scale}px solid ${RED}`,
      }}
    >
      <div
        style={{
          background: RED,
          color: 'white',
          fontSize: 22 * scale,
          fontWeight: 700,
          letterSpacing: 2 * scale,
          display: 'flex',
          alignItems: 'center',
          padding: `0 ${16 * scale}px`,
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        {label.toUpperCase()}
      </div>
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

/** Thin bar of colour that separates the crawl from the lower third. */
export const AccentStrip: React.FC<{scale: number}> = ({scale}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 74 * scale,
      height: 40 * scale,
      background: 'linear-gradient(90deg, #0b2456 0%, #123a80 100%)',
      borderTop: `${2 * scale}px solid rgba(63,169,255,0.5)`,
    }}
  />
);

export const NewsOverlay: React.FC<{
  network: string;
  clock: string;
  headline: string;
  name: string;
  role: string;
  tickerLabel: string;
  tickerHeadlines: string[];
  tickerSpeed: number;
  lowerThirdStart: number;
}> = ({
  network,
  clock,
  headline,
  name,
  role,
  tickerLabel,
  tickerHeadlines,
  tickerSpeed,
  lowerThirdStart,
}) => {
  const {width} = useVideoConfig();
  const scale = width / 720;

  return (
    <AbsoluteFill>
      <LogoBug name={network} scale={scale} />
      <LiveBadge clock={clock} scale={scale} />
      <LowerThird
        headline={headline}
        name={name}
        role={role}
        scale={scale}
        startFrame={lowerThirdStart}
      />
      <AccentStrip scale={scale} />
      <Ticker
        label={tickerLabel}
        headlines={tickerHeadlines}
        scale={scale}
        speed={tickerSpeed}
      />
    </AbsoluteFill>
  );
};
