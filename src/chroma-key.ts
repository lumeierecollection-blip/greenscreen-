export type ChromaKeyOptions = {
  /**
   * Greenness above which a pixel becomes fully transparent, on the 0-255
   * scale produced by `greenScore`. Measured on this footage the backdrop
   * scores 94-107 everywhere, including deep shadow, while the subject never
   * exceeds 35.
   */
  threshold: number;
  /**
   * Width of the soft edge below the threshold. Pixels in that band fade out
   * gradually, which keeps hair and shoulder edges from looking cut out.
   */
  softness: number;
  /**
   * How much of the green light bouncing off the subject is neutralised.
   * 0 keeps the spill, 1 removes all of it.
   */
  spillSuppression: number;
  /**
   * Pixels darker than this (sum of the three channels) are always kept.
   * Near-black pixels carry too little colour for the ratio below to mean
   * anything, and would otherwise flicker.
   */
  minBrightness: number;
};

export const defaultChromaKeyOptions: ChromaKeyOptions = {
  threshold: 75,
  softness: 30,
  spillSuppression: 0.9,
  minBrightness: 24,
};

/**
 * How green a pixel is, independent of how brightly it is lit.
 *
 * A neutral pixel puts a third of its total light in the green channel, so the
 * green share is measured against that baseline and rescaled to roughly 0-255.
 * Using the share rather than an absolute channel difference is what lets a
 * shadowed fold of the backdrop key out with the same setting as the brightly
 * lit middle of it.
 */
export const greenScore = (r: number, g: number, b: number) => {
  const sum = r + g + b;
  if (sum === 0) {
    return 0;
  }

  return (g / sum - 1 / 3) * 765;
};

/** Removes the green background from `data` in place. */
export const applyChromaKey = (
  data: Uint8ClampedArray,
  options: ChromaKeyOptions,
) => {
  const {threshold, softness, spillSuppression, minBrightness} = options;
  const lower = threshold - softness;
  const span = Math.max(softness, 1);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r + g + b < minBrightness) {
      continue;
    }

    const score = greenScore(r, g, b);
    if (score <= lower) {
      continue;
    }

    const alpha = score >= threshold ? 0 : 1 - (score - lower) / span;
    data[i + 3] = Math.round(data[i + 3] * alpha);

    if (alpha > 0 && spillSuppression > 0) {
      // Pull the green channel back towards the other channels so the
      // surviving edge pixels do not glow green over the new background.
      const strongestOther = Math.max(r, b);
      if (g > strongestOther) {
        data[i + 1] = Math.round(g - (g - strongestOther) * spillSuppression);
      }
    }
  }
};
