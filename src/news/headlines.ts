/**
 * Timed headline entries for the news broadcast. Each entry defines a
 * headline that appears on the main bar between startSec and endSec.
 */
export type TimedHeadline = {
  /** Second the headline appears. */
  startSec: number;
  /** Second the headline disappears. */
  endSec: number;
  /** Headline text (will be uppercased at render time). */
  text: string;
};

export const churchHeadlines: TimedHeadline[] = [
  {startSec: 5, endSec: 14, text: 'Evangelism This Saturday'},
  {startSec: 14, endSec: 21, text: 'Proverbs 11:30 – And He Who Is Wise Wins Souls'},
  {startSec: 21, endSec: 51, text: "Samag's Camp Registration Now Open"},
  {startSec: 83, endSec: 100, text: 'Items To Pack: Play Clothes, Blankets, Warm Clothing, Toiletries'},
  {startSec: 100, endSec: 115, text: 'Note: No Cell Phones, Snacks To Be Provided'},
  {startSec: 152, endSec: 157, text: 'CFC JHP Celebration'},
  {startSec: 157, endSec: 177, text: 'CFC Celebration From The 27th Of September To The 2nd Of October'},
  {startSec: 209, endSec: 234, text: 'Theme: Jesus Is Building His Church'},
  {startSec: 528, endSec: 529, text: 'Young Adults Meeting'},
  {startSec: 529, endSec: 541, text: 'Alternating Weekly Meetings'},
  {startSec: 541, endSec: 556, text: 'For More Information, Contact Chile And Lebo'},
  {startSec: 642, endSec: 652, text: "Children's World Is A Phone Free Zone"},
  {startSec: 652, endSec: 665, text: 'Thanks For Watching'},
];

/** Returns the headline active at a given second, or null if none. */
export const getHeadlineAtTime = (
  headlines: TimedHeadline[],
  timeSec: number,
): TimedHeadline | null => {
  for (const h of headlines) {
    if (timeSec >= h.startSec && timeSec < h.endSec) {
      return h;
    }
  }
  return null;
};
