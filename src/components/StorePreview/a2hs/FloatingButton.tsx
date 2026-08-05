import type { CSSProperties } from 'react';
import { useA2HS } from '../../../hooks/useA2HS';

/* "Button" template: a floating pill button pinned to the bottom of the phone
 * viewport. Text and fill color are publisher-configured; tapping it opens the
 * instruction popup. */

interface Props {
  onSelect?: (id: string, label: string) => void;
}

export default function FloatingButton({ onSelect }: Props) {
  const { config, entryVisible, openInstruction } = useA2HS();
  if (config.template !== 'existing' || !entryVisible) return null;

  return (
    <button
      type="button"
      style={{ ...styles.root, background: config.buttonBgColor }}
      onClick={openInstruction}
      onContextMenu={(e) => { e.preventDefault(); onSelect?.('add-to-home-screen', 'Add to Home Screen'); }}
    >
      <span style={styles.label}>{config.ctaText}</span>
    </button>
  );
}

const styles = {
  root: {
    position: 'absolute',
    right: 14,
    bottom: 16,
    zIndex: 6,
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderRadius: 100,
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: 800,
    boxShadow: '0 6px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
    cursor: 'pointer',
  },
  label: {
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, CSSProperties>;
