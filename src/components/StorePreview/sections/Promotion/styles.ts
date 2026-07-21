import type { CSSProperties } from 'react';

const styles = {
  root: {
    padding: '8px 12px',
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #e6c987 0%, #d9b96f 30%, #c9a75d 100%)',
    boxShadow: '0 3px 8px rgba(0,0,0,0.35)',
  },
  title: {
    textAlign: 'center',
    padding: '14px 0 10px',
    color: '#f7a325',
    fontSize: 24,
    fontWeight: 900,
    textShadow: '0 2px 0 #8a4a10, 0 3px 5px rgba(0,0,0,0.4)',
  },
  itemsStrip: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 6,
    margin: '0 12px',
    padding: '12px 10px',
    borderRadius: 12,
    background: 'rgba(20, 16, 10, 0.55)',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  itemIcon: {
    fontSize: 30,
    lineHeight: 1,
    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))',
  },
  itemAmount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 800,
    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
    whiteSpace: 'nowrap',
  },
  itemOldAmount: {
    color: '#ff5a4e',
    fontSize: 10,
    fontWeight: 700,
    textDecoration: 'line-through',
    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 14px 8px',
    color: '#fff6dd',
    fontSize: 10.5,
    fontWeight: 700,
    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
  },
  buyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: '0 10px 10px',
    padding: '10px 0',
    borderRadius: 10,
    background: 'linear-gradient(180deg, #9fdd4f 0%, #63b52a 55%, #4c9c1d 100%)',
    boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.35)',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 900,
    textShadow: '0 1px 2px rgba(0,0,0,0.45)',
  },
  oldPrice: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: 700,
    textDecoration: 'line-through',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    background: '#ffffff',
  },
} satisfies Record<string, CSSProperties>;

export default styles;
