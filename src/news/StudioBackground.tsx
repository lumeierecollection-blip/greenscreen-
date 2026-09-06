import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type StudioPalette = {
  deep: string;
  mid: string;
  glow: string;
  accent: string;
};

export const defaultStudioPalette: StudioPalette = {
  deep: '#04091c',
  mid: '#0d2350',
  glow: '#1d5bb0',
  accent: '#3fa9ff',
};

/** The wall of screens behind the desk, drawn as a row of lit panels. */
const VideoWall: React.FC<{palette: StudioPalette; scale: number}> = ({
  palette,
  scale,
}) => {
  const frame = useCurrentFrame();
  const panels = 9;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: -40 * scale,
        right: -40 * scale,
        height: 900 * scale,
        display: 'flex',
        gap: 6 * scale,
        transform: 'perspective(1400px) rotateX(4deg)',
        transformOrigin: 'top center',
      }}
    >
      {new Array(panels).fill(true).map((_, i) => {
        // Each panel breathes on its own slow cycle so the wall never reads as
        // a flat gradient.
        const phase = Math.sin((frame / 70) * Math.PI + i * 0.8);
        const brightness = interpolate(phase, [-1, 1], [0.55, 1]);

        return (
          <div
            key={i}
            style={{
              flex: 1,
              background: `linear-gradient(180deg, ${palette.mid} 0%, ${palette.deep} 78%)`,
              opacity: brightness,
              borderTop: `${2 * scale}px solid ${palette.accent}`,
              boxShadow: `inset 0 ${8 * scale}px ${24 * scale}px rgba(63,169,255,${
                0.18 * brightness
              })`,
            }}
          />
        );
      })}
    </div>
  );
};

/** A slowly turning wireframe globe, the stock centrepiece of a news set. */
const Globe: React.FC<{palette: StudioPalette; scale: number}> = ({
  palette,
  scale,
}) => {
  const frame = useCurrentFrame();
  const radius = 210 * scale;
  const meridians = 7;

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      style={{
        position: 'absolute',
        left: `calc(50% - ${radius}px)`,
        top: 150 * scale,
        opacity: 0.5,
      }}
    >
      <defs>
        <radialGradient id="globe-glow">
          <stop offset="45%" stopColor={palette.glow} stopOpacity={0.45} />
          <stop offset="100%" stopColor={palette.glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={radius} cy={radius} r={radius} fill="url(#globe-glow)" />
      <circle
        cx={radius}
        cy={radius}
        r={radius * 0.72}
        fill="none"
        stroke={palette.accent}
        strokeWidth={1.6 * scale}
        opacity={0.8}
      />
      {new Array(meridians).fill(true).map((_, i) => {
        // Rotating a sphere makes each meridian's projected width swing
        // between full and zero, which is all an ellipse needs to fake it.
        const angle = (i / meridians) * Math.PI + frame / 220;
        const rx = Math.abs(Math.cos(angle)) * radius * 0.72;

        return (
          <ellipse
            key={i}
            cx={radius}
            cy={radius}
            rx={Math.max(rx, 0.5)}
            ry={radius * 0.72}
            fill="none"
            stroke={palette.accent}
            strokeWidth={1.2 * scale}
            opacity={0.5}
          />
        );
      })}
      {[-0.42, -0.15, 0.15, 0.42].map((offset) => {
        const ry = radius * 0.72;
        const cy = radius + offset * ry * 2;
        const rx = Math.sqrt(Math.max(1 - (offset * 2) ** 2, 0.01)) * ry;

        return (
          <ellipse
            key={offset}
            cx={radius}
            cy={cy}
            rx={rx}
            ry={ry * 0.12}
            fill="none"
            stroke={palette.accent}
            strokeWidth={1.2 * scale}
            opacity={0.4}
          />
        );
      })}
    </svg>
  );
};

/** The anchor desk, seen from just above its front edge. */
const Desk: React.FC<{palette: StudioPalette; scale: number}> = ({
  palette,
  scale,
}) => (
  <div
    style={{
      position: 'absolute',
      left: -80 * scale,
      right: -80 * scale,
      bottom: 0,
      height: 430 * scale,
      background: `linear-gradient(180deg, ${palette.mid} 0%, ${palette.deep} 55%)`,
      borderTop: `${3 * scale}px solid ${palette.accent}`,
      boxShadow: `0 ${-12 * scale}px ${40 * scale}px rgba(4,9,28,0.9)`,
      transform: 'perspective(900px) rotateX(-10deg)',
      transformOrigin: 'top center',
    }}
  />
);

export const StudioBackground: React.FC<{palette: StudioPalette}> = ({
  palette,
}) => {
  const {width} = useVideoConfig();
  const frame = useCurrentFrame();
  const scale = width / 720;

  // A soft highlight drifting across the set, so the backdrop is never static.
  const sweep = interpolate(frame % 300, [0, 300], [-60, 160]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 70% at 50% 28%, ${palette.mid} 0%, ${palette.deep} 70%)`,
        overflow: 'hidden',
      }}
    >
      <VideoWall palette={palette} scale={scale} />
      <Globe palette={palette} scale={scale} />
      <Desk palette={palette} scale={scale} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(100deg, transparent ${sweep - 25}%, rgba(63,169,255,0.10) ${sweep}%, transparent ${
            sweep + 25
          }%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(80% 55% at 50% 45%, transparent 40%, rgba(2,5,14,0.85) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
