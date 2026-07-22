import type { CSSProperties } from 'react';

/* Popup collect widget as its own stacked section (under Banner).
 * Reuses the floating-widget visual, laid out inline. */
const styles = {
  root: {
    padding: '8px 12px',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  widget: {
    width: 68,
    height: 68,
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'radial-gradient(circle at 50% 30%, #ffd968 0%, #f3b83d 55%, #dd9a25 100%)',
    boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 0 0 1.5px rgba(255,255,255,0.35)',
  },
  badge: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    lineHeight: 1,
    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))',
  },
  cta: {
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #8fd648 0%, #56a81f 100%)',
    boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.4)',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: 0.5,
    textShadow: '0 1px 1px rgba(0,0,0,0.45)',
  },
} satisfies Record<string, CSSProperties>;

export default styles;
