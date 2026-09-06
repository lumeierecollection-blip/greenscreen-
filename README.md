# Greenscreen

A [Remotion](https://www.remotion.dev) project that replaces green screen
backdrops. Two compositions:

| Composition | What it makes |
| --- | --- |
| `Greenscreen` | Puts the photo in `public/background.jpg` behind the subject |
| `NewsBroadcast` | Drops the subject into a news studio with full broadcast graphics |

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
npm run render   # write out/video.mp4 (photo background)
npm run render:news  # write out/news-broadcast.mp4 (news studio)
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

The `Greenscreen` composition takes its size and duration from the video file
itself, so swapping in a different clip needs no code change.

## The news studio

`NewsBroadcast` builds the whole set in code, no stock footage — the sandbox
this runs in has no general internet access, only code registries like npm and
GitHub, so a real photo background isn't fetchable here. Behind the anchor is
an out-of-focus wall of screens, warm bokeh from practical lights, and a
glossy floor with a soft reflection, blurred and graded like something a
camera actually shot rather than a flat vector render. On top sit the graphics
a broadcast carries: a network bug, a pulsing LIVE pill with a clock, a lower
third that springs in from the left, and a crawl along the bottom that loops
seamlessly by measuring its own text.

The frame is fixed at 720x1280 so the graphics keep their proportions whatever
the source clip measures. The anchor is scaled to cover it, and `anchorZoom`,
`anchorOffsetX` and `anchorOffsetY` reposition her within the frame.

If you'd rather composite onto an actual photographed studio, drop the image
into `public/` and swap `StudioBackground` in `NewsBroadcast.tsx` for an `Img`
the same way the `Greenscreen` composition uses `background.jpg` — the keying
and graphics layers don't change.

### Clean edges

The cutout computes an alpha value per pixel first, then box-blurs the whole
alpha mask before applying it (`chroma-key.ts`, `edgeBlur`). Thresholding
pixels independently leaves a jagged, blocky edge wherever video compression
has softened the boundary; blurring only the mask — never the colour —
rounds that into the kind of soft edge a camera lens produces, which is what
keeps the cutout from reading as a green screen.

Every piece of text is a prop. To put a real name on the banner:

```
npx remotion render NewsBroadcast out/news-broadcast.mp4 \
  --props='{"name":"Her Name","role":"Senior Correspondent","headline":"Breaking","network":"NW News","clock":"20:00","tickerLabel":"Breaking","tickerHeadlines":["First headline","Second headline"],"tickerSpeed":90,"lowerThirdStart":20,"videoSrc":"greenscreen-news.mp4","anchorZoom":1,"anchorOffsetX":0,"anchorOffsetY":0}'
```

Editing them in Remotion Studio is easier than passing the whole prop object.
The studio colours come from `palette`, so the set can be recoloured without
touching the components. This second clip is lit unevenly, with the backdrop
scoring 67 to 144 and the anchor never above 1, so it uses a slightly lower
threshold of its own.
