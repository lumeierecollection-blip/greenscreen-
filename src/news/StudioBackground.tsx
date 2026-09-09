import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type StudioPalette = {
  deep: string;
  mid: string;
  glow: string;
  accent: string;
};

export const defaultStudioPalette: StudioPalette = {
  deep: '#050b1a',
  mid: '#12294f',
  glow: '#2f6fb8',
  accent: '#5aa3e8',
};

/**
 * Grain, a lens vignette and a very slight chromatic fringe at the corners.
 */
const FilmTexture: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0"
          />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(120% 80% at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  </AbsoluteFill>
);

/**
 * Curved panoramic screen wall with three panels: a rotating globe on the
 * left, a world map in the centre, and a city/newsroom montage on the right.
 * Red accent bars frame the edges.
 */
const CurvedScreenWall: React.FC<{palette: StudioPalette; scale: number}> = ({
  palette,
  scale,
}) => {
  const frame = useCurrentFrame();

  /* Slow globe rotation on the left panel. */
  const globePhase = (frame / 300) * Math.PI * 2;
  const globeX = Math.cos(globePhase) * 15;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: -20 * scale,
        right: -20 * scale,
        height: 680 * scale,
        display: 'flex',
        gap: 8 * scale,
        perspective: `${1400 * scale}px`,
        filter: `blur(${2.5 * scale}px)`,
      }}
    >
      {/* Left panel — globe */}
      <div
        style={{
          flex: 1,
          borderRadius: 8 * scale,
          overflow: 'hidden',
          transform: 'rotateY(18deg)',
          transformOrigin: 'right center',
          position: 'relative',
          background: `radial-gradient(circle at ${50 + globeX}% 45%, ${palette.glow} 0%, ${palette.mid} 40%, ${palette.deep} 80%)`,
          boxShadow: `inset 0 0 ${60 * scale}px ${palette.deep}`,
        }}
      >
        {/* Globe circle */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            opacity: 0.5,
          }}
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={palette.accent}
            strokeWidth="1"
            opacity="0.6"
          />
          {/* Latitude lines */}
          {[-40, -20, 0, 20, 40].map((lat) => (
            <ellipse
              key={`lat-${lat}`}
              cx="100"
              cy={100 + lat}
              rx={Math.sqrt(6400 - lat * lat)}
              ry={10}
              fill="none"
              stroke={palette.accent}
              strokeWidth="0.6"
              opacity="0.4"
            />
          ))}
          {/* Longitude arcs */}
          {[0, 30, 60, 90, 120, 150].map((lng) => (
            <ellipse
              key={`lng-${lng}`}
              cx="100"
              cy="100"
              rx={12}
              ry={80}
              fill="none"
              stroke={palette.accent}
              strokeWidth="0.6"
              opacity="0.4"
              transform={`rotate(${lng + globeX * 2}, 100, 100)`}
            />
          ))}
        </svg>
        {/* Red accent bar at left edge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '30%',
            bottom: '30%',
            width: 4 * scale,
            background: '#c41e2a',
            boxShadow: `0 0 ${20 * scale}px rgba(196,30,42,0.6)`,
          }}
        />
      </div>

      {/* Centre panel — world map */}
      <div
        style={{
          flex: 1.3,
          borderRadius: 8 * scale,
          overflow: 'hidden',
          position: 'relative',
          background: `linear-gradient(180deg, ${palette.mid} 0%, ${palette.deep} 100%)`,
          boxShadow: `inset 0 0 ${40 * scale}px ${palette.deep}`,
        }}
      >
        {/* Simplified world map using SVG paths */}
        <svg
          viewBox="0 0 360 180"
          style={{
            position: 'absolute',
            width: '90%',
            height: '70%',
            top: '15%',
            left: '5%',
            opacity: 0.35,
          }}
        >
          {/* Rough continental outlines */}
          {/* North America */}
          <path
            d="M60,35 L80,30 L95,35 L100,50 L95,60 L85,70 L75,80 L65,75 L55,60 Z"
            fill={palette.glow}
            opacity="0.5"
          />
          {/* South America */}
          <path
            d="M85,90 L95,85 L100,95 L98,115 L90,130 L80,120 L78,100 Z"
            fill={palette.glow}
            opacity="0.5"
          />
          {/* Europe */}
          <path
            d="M160,30 L175,28 L185,35 L180,45 L170,50 L160,45 Z"
            fill={palette.glow}
            opacity="0.5"
          />
          {/* Africa */}
          <path
            d="M165,55 L180,50 L190,60 L195,80 L185,110 L170,115 L160,95 L155,70 Z"
            fill={palette.glow}
            opacity="0.5"
          />
          {/* Asia */}
          <path
            d="M190,25 L230,20 L270,30 L280,45 L260,55 L240,50 L220,45 L200,40 Z"
            fill={palette.glow}
            opacity="0.5"
          />
          {/* Australia */}
          <path
            d="M260,100 L280,95 L290,105 L285,115 L270,118 L260,110 Z"
            fill={palette.glow}
            opacity="0.5"
          />
          {/* Grid lines */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            (x) => (
              <line
                key={`vg-${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="180"
                stroke={palette.accent}
                strokeWidth="0.3"
                opacity="0.2"
              />
            ),
          )}
          {[0, 30, 60, 90, 120, 150].map((y) => (
            <line
              key={`hg-${y}`}
              x1="0"
              y1={y}
              x2="360"
              y2={y}
              stroke={palette.accent}
              strokeWidth="0.3"
              opacity="0.2"
            />
          ))}
        </svg>
      </div>

      {/* Right panel — city/monitors */}
      <div
        style={{
          flex: 1,
          borderRadius: 8 * scale,
          overflow: 'hidden',
          transform: 'rotateY(-18deg)',
          transformOrigin: 'left center',
          position: 'relative',
          background: `linear-gradient(210deg, ${palette.accent}88 0%, ${palette.mid} 50%, ${palette.deep} 100%)`,
          boxShadow: `inset 0 0 ${60 * scale}px ${palette.deep}`,
        }}
      >
        {/* City skyline silhouette */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            opacity: 0.25,
          }}
        >
          <path
            d="M0,140 L10,140 L10,100 L20,100 L20,80 L30,80 L30,100 L35,100 L35,60 L45,60 L45,100 L50,100 L50,90 L55,90 L55,70 L65,70 L65,90 L70,90 L70,110 L80,110 L80,50 L90,50 L90,110 L95,110 L95,85 L105,85 L105,40 L115,40 L115,85 L120,85 L120,100 L130,100 L130,65 L140,65 L140,100 L150,100 L150,120 L160,120 L160,90 L170,90 L170,130 L180,130 L180,110 L190,110 L190,140 L200,140 L200,200 L0,200 Z"
            fill={palette.glow}
            opacity="0.4"
          />
          {/* Window dots */}
          {Array.from({length: 30}).map((_, i) => {
            const bx = 15 + (i % 10) * 18;
            const by = 75 + Math.floor(i / 10) * 20;
            const flicker = Math.sin(frame / 40 + i * 1.7) > 0.3 ? 0.7 : 0.2;
            return (
              <rect
                key={`w-${i}`}
                x={bx}
                y={by}
                width="4"
                height="5"
                fill={palette.accent}
                opacity={flicker}
              />
            );
          })}
        </svg>
        {/* Red accent bar at right edge */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '30%',
            bottom: '30%',
            width: 4 * scale,
            background: '#c41e2a',
            boxShadow: `0 0 ${20 * scale}px rgba(196,30,42,0.6)`,
          }}
        />
      </div>
    </div>
  );
};

/**
 * Red glow accents on the sides, as seen in the reference studio photo.
 */
const RedAccents: React.FC<{scale: number}> = ({scale}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: '15%',
        width: 60 * scale,
        height: '50%',
        background:
          'linear-gradient(90deg, rgba(196,30,42,0.25) 0%, transparent 100%)',
        filter: `blur(${15 * scale}px)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: '15%',
        width: 60 * scale,
        height: '50%',
        background:
          'linear-gradient(270deg, rgba(196,30,42,0.25) 0%, transparent 100%)',
        filter: `blur(${15 * scale}px)`,
      }}
    />
  </>
);

/**
 * Soft circular practical lights — warm bokeh from the studio rig.
 */
const PracticalLights: React.FC<{scale: number}> = ({scale}) => {
  const frame = useCurrentFrame();
  const lights = [
    {x: 0.14, y: 0.16, r: 150, color: 'rgba(255,214,170,0.5)', period: 130},
    {x: 0.82, y: 0.1, r: 190, color: 'rgba(120,180,255,0.4)', period: 160},
    {x: 0.92, y: 0.34, r: 110, color: 'rgba(255,190,140,0.35)', period: 95},
    {x: 0.06, y: 0.4, r: 120, color: 'rgba(140,190,255,0.3)', period: 110},
  ];

  return (
    <AbsoluteFill style={{filter: `blur(${26 * scale}px)`}}>
      {lights.map((light, i) => {
        const flicker = interpolate(
          Math.sin((frame / light.period) * Math.PI * 2),
          [-1, 1],
          [0.75, 1],
        );
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${light.x * 100}%`,
              top: `${light.y * 100}%`,
              width: light.r * scale,
              height: light.r * scale,
              marginLeft: (-light.r * scale) / 2,
              marginTop: (-light.r * scale) / 2,
              borderRadius: '50%',
              background: light.color,
              opacity: flicker,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Glossy studio floor with a faint upward reflection, matching the reflective
 * surface and desk sweep from the reference image.
 */
const Floor: React.FC<{palette: StudioPalette; scale: number}> = ({
  palette,
  scale,
}) => (
  <div
    style={{
      position: 'absolute',
      left: -80 * scale,
      right: -80 * scale,
      bottom: 0,
      height: 520 * scale,
      background: `linear-gradient(180deg, transparent 0%, ${palette.mid} 30%, ${palette.deep} 65%)`,
      overflow: 'hidden',
    }}
  >
    {/* Reflection glow from screens above */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '55%',
        background: `radial-gradient(70% 100% at 50% 0%, ${palette.accent}55 0%, transparent 70%)`,
        filter: `blur(${20 * scale}px)`,
      }}
    />
    {/* Red reflection strips on floor edges */}
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: 0,
        width: '30%',
        height: '30%',
        background:
          'radial-gradient(ellipse at 0% 50%, rgba(196,30,42,0.15) 0%, transparent 70%)',
        filter: `blur(${12 * scale}px)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '10%',
        right: 0,
        width: '30%',
        height: '30%',
        background:
          'radial-gradient(ellipse at 100% 50%, rgba(196,30,42,0.15) 0%, transparent 70%)',
        filter: `blur(${12 * scale}px)`,
      }}
    />
    {/* Specular highlight band */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 40%, transparent 55%)',
      }}
    />
  </div>
);

export const StudioBackground: React.FC<{palette: StudioPalette}> = ({
  palette,
}) => {
  const {width} = useVideoConfig();
  const scale = width / 720;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(130% 90% at 50% 22%, ${palette.mid} 0%, ${palette.deep} 75%)`,
        overflow: 'hidden',
      }}
    >
      <CurvedScreenWall palette={palette} scale={scale} />
      <RedAccents scale={scale} />
      <PracticalLights scale={scale} />
      <Floor palette={palette} scale={scale} />
      <FilmTexture />
    </AbsoluteFill>
  );
};
