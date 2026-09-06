# Greenscreen

A [Remotion](https://www.remotion.dev) project that replaces the green backdrop
in `public/greenscreen.mp4` with the photo in `public/background.jpg`.

## How it works

`OffthreadVideo` hands every decoded frame to a canvas, which keys out the
backdrop and draws the result on top of the photo. The video element itself is
invisible; it stays in the tree so its audio track is kept in the render.

The key measures how large a share of a pixel's total light sits in the green
channel, rather than an absolute channel difference. On this footage that share
is 0.46 across the whole backdrop, brightly lit middle and deep shadowed folds
alike, while the subject stays near the neutral 0.33. A single threshold
therefore removes the shadows without eating into skin, hair, or the grey
trousers. Surviving edge pixels get their green spill pulled back so they do not
glow against the new background.

## Commands

```
npm install
npm run dev      # open Remotion Studio
npm run render   # write out/video.mp4
npm run still    # write out/frame.png
```

Rendering needs a Chrome that Remotion can drive. If the machine has no Chrome,
pass one explicitly:

```
npx remotion render Greenscreen out/video.mp4 --browser-executable=/path/to/chrome
```

## Tuning

All settings are props on the `Greenscreen` composition, editable live in
Remotion Studio or passable with `--props`:

| Prop | Meaning |
| --- | --- |
| `videoSrc` | Green screen video in `public/` |
| `backgroundSrc` | Replacement image in `public/` |
| `backgroundRotation` | Clockwise rotation of the photo, in degrees. The supplied photo is stored sideways, so it is `90` |
| `chromaKey.threshold` | Greenness at which a pixel disappears. Lower removes more |
| `chromaKey.softness` | Width of the fade below the threshold. Higher gives softer edges |
| `chromaKey.spillSuppression` | How much green bounce is taken off the subject, 0 to 1 |
| `chromaKey.minBrightness` | Near-black pixels below this are always kept |

Example:

```
npx remotion render Greenscreen out/video.mp4 \
  --props='{"videoSrc":"greenscreen.mp4","backgroundSrc":"background.jpg","backgroundRotation":90,"chromaKey":{"threshold":70,"softness":35,"spillSuppression":0.9,"minBrightness":24}}'
```

The composition's size and duration are read from the video file itself, so
swapping in a different clip needs no code change.
