import type { CSSProperties } from 'react';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: '14px 12px',
    background: 'linear-gradient(180deg, #3d2b1f 0%, #52381f 55%, #6b4a26 100%)',
    borderBottom: '2px solid rgba(0,0,0,0.25)',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, #ffd98a, #c9862f)',
    border: '2px solid #f4c860',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0,
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 700,
    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
    whiteSpace: 'nowrap',
  },
  balancePill: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(0,0,0,0.45)',
    borderRadius: 10,
    padding: '2px 8px 2px 4px',
    color: '#ffe9a8',
    fontSize: 11,
    fontWeight: 700,
    width: 'fit-content',
  },
  gameLogo: {
    textAlign: 'right',
    lineHeight: 1,
    flexShrink: 0,
  },
  gameLogoText: {
    display: 'block',
    color: '#ffd23e',
    fontSize: 15,
    fontWeight: 900,
    fontStyle: 'italic',
    textShadow: '0 2px 0 #8a2c1f, 0 3px 4px rgba(0,0,0,0.5)',
    letterSpacing: 0.5,
  },
} satisfies Record<string, CSSProperties>;

export default styles;
