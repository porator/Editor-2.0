import type { CSSProperties } from 'react';

const styles = {
  root: {
    padding: '8px 12px',
  },
  card: {
    position: 'relative',
    borderRadius: 12,
    background: '#E7CF88',
    boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '18px 12px 12px',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
    minWidth: 76,
  },
  heroIcon: {
    width: 53.511,
    height: 68.8,
    aspectRatio: '7/9',
    background: 'url(/assets/coin-bag.png) 50% / cover no-repeat',
  },
  heroAmount: {
    alignSelf: 'stretch',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadow: '0 0 2px #000',
    fontFamily: '"Lilita One"',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
  },
  heroOldAmount: {
    alignSelf: 'stretch',
    color: '#FF4747',
    textAlign: 'center',
    fontFamily: '"Lilita One"',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    textDecoration: 'line-through',
    whiteSpace: 'nowrap',
  },
  itemsGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px 6px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  itemIcon: {
    width: 26.442,
    height: 40,
    flexShrink: 0,
    aspectRatio: '26.44/40.00',
    background: 'url(/assets/potion.png) 50% / contain no-repeat',
    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))',
  },
  itemAmount: {
    color: '#FFFFFF',
    textAlign: 'center',
    textShadow: '0 0 2px #000',
    fontFamily: '"Lilita One"',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
  },
  /* badgeTopLeft/badgeTopRight both render via the shared <Badge> seal
   * component (see index.tsx) — same vector, re-themed per instance via
   * --badge-grad-start/--badge-grad-end. Only position is set here. */
  badgeSlotTopLeft: {
    position: 'absolute',
    zIndex: 1,
    top: -10,
    left: -10,
  },
  badgeSlotTopRight: {
    position: 'absolute',
    zIndex: 1,
    top: -10,
    right: -10,
  },
  badgeSealLabel: {
    color: '#F5FFFF',
    textAlign: 'center',
    textShadow: '0 0.234px 0 #024769',
    WebkitTextStrokeWidth: '0.23px',
    WebkitTextStrokeColor: '#024769',
    fontFamily: '"Lilita One"',
    fontSize: 10.539,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '10.539px',
  },
  /* Purple variant (100% MORE) — same label styling, stroke/shadow shifted
   * to the seal's own dark-purple border color instead of the blue seal's. */
  badgeSealLabelPurple: {
    textShadow: '0 0.234px 0 #4E0D89',
    WebkitTextStrokeColor: '#4E0D89',
  },
  /* Each word its own block-level line — matches Figma's two-<p> "Best" /
   * "Value" layout rather than relying on width-constrained wrapping. */
  badgeSealLine: {
    display: 'block',
  },
} satisfies Record<string, CSSProperties>;

export default styles;
