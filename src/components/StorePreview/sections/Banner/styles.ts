import type { CSSProperties } from 'react';

const styles = {
  root: {
    padding: '10px 12px 4px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'linear-gradient(105deg, #9ed8f7 0%, #7fc3ec 45%, #a5dbf8 100%)',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.35), 0 2px 6px rgba(0,0,0,0.25)',
    overflow: 'hidden',
  },
  logo: {
    lineHeight: 1,
    flexShrink: 0,
    textAlign: 'center',
  },
  logoText: {
    display: 'block',
    color: '#e8412c',
    fontSize: 16,
    fontWeight: 900,
    fontStyle: 'italic',
    textShadow: '0 1.5px 0 #7d1a10, 0 2px 3px rgba(0,0,0,0.35)',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  title: {
    color: '#f7a325',
    fontSize: 19,
    fontWeight: 900,
    textShadow: '0 2px 0 #8a4a10, 0 3px 4px rgba(0,0,0,0.35)',
    whiteSpace: 'nowrap',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 800,
    textShadow: '0 2px 0 #3d78a8, 0 3px 4px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, CSSProperties>;

export default styles;
