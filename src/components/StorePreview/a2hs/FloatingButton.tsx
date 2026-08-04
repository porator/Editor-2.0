import type { CSSProperties } from 'react';
import { Smartphone } from 'lucide-react';
import { useA2HS } from '../../../hooks/useA2HS';

/* Legacy "Existing" template: a floating pill button pinned to the bottom of
 * the phone viewport. Tapping it opens the instruction popup. */

interface Props {
  onSelect?: (id: string, label: string) => void;
}

export default function FloatingButton({ onSelect }: Props) {
  const { config, entryVisible, openInstruction } = useA2HS();
  if (config.template !== 'existing' || !entryVisible) return null;

  return (
    <button
      type="button"
      style={styles.root}
      onClick={openInstruction}
      onContextMenu={(e) => { e.preventDefault(); onSelect?.('add-to-home-screen', 'Add to Home Screen'); }}
    >
      <span style={styles.icon}><Smartphone size={16} strokeWidth={2.25} /></span>
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
    gap: 8,
    padding: '10px 16px 10px 12px',
    borderRadius: 100,
    background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: 800,
    boxShadow: '0 6px 16px rgba(79,70,229,0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
    cursor: 'pointer',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, CSSProperties>;
