import type { CSSProperties } from 'react';

/* Palette follows Promotion/Bundle: gold card, dark inset well, green fill. */
const styles = {
  root: {
    padding: '8px 12px',
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    padding: '12px 14px 14px',
    background: 'linear-gradient(180deg, #e6c987 0%, #d9b96f 30%, #c9a75d 100%)',
    boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    color: '#f7a325',
    fontSize: 16,
    fontWeight: 900,
    textShadow: '0 2px 0 #8a4a10, 0 3px 5px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  progressLabel: {
    color: '#fff6dd',
    fontSize: 11,
    fontWeight: 800,
    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  /* Dark well matching Promotion's itemsStrip, so the track reads as inset. */
  track: {
    position: 'relative',
    height: 14,
    borderRadius: 999,
    background: 'rgba(20, 16, 10, 0.55)',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(180deg, #8ed94f 0%, #5cb324 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)',
  },
  /* Milestones sit under the track, positioned by percentage so they line up
   * with the points on it they refer to. */
  milestones: {
    position: 'relative',
    height: 42,
    marginTop: 6,
  },
  milestone: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    /* `left` and `transform` are both set inline per milestone — the shift is
     * interpolated (0% at the start, -100% at the end) rather than a flat
     * -50%, so milestones at the track's extremes stay inside the card
     * instead of hanging half-off the edge. */
  },
  milestoneIcon: {
    fontSize: 22,
    lineHeight: 1,
    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))',
  },
  milestoneLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 800,
    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, CSSProperties>;

export default styles;
