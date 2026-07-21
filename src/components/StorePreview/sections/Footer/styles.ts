import type { CSSProperties } from 'react';

const styles = {
  root: {
    marginTop: 'auto',
    padding: '16px 12px 18px',
    background: 'linear-gradient(180deg, #22331f 0%, #16241a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  gameName: {
    color: '#ffd23e',
    fontSize: 13,
    fontWeight: 900,
    fontStyle: 'italic',
    textShadow: '0 1.5px 0 #8a2c1f',
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '6px 14px',
  },
  link: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10.5,
    fontWeight: 600,
    textDecoration: 'underline',
    textUnderlineOffset: 2,
    cursor: 'pointer',
  },
  legal: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9.5,
    textAlign: 'center',
  },
} satisfies Record<string, CSSProperties>;

export default styles;
