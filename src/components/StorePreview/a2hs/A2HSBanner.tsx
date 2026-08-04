import type { CSSProperties } from 'react';
import { X } from 'lucide-react';
import { useA2HS } from '../../../hooks/useA2HS';

/* Persistent header banner (Banner template). Renders in-flow at the top of
 * the store scroll container as a sticky bar, so it stays pinned while the
 * store scrolls beneath it. Body click selects the block (opens config);
 * the CTA opens the instruction popup; X dismisses for the session. */

interface Props {
  onSelect?: (id: string, label: string) => void;
}

const SECTION_ID = 'add-to-home-screen';

export default function A2HSBanner({ onSelect }: Props) {
  const { config, entryVisible, openInstruction, dismissEntry } = useA2HS();
  if (config.template !== 'banner' || !entryVisible) return null;

  const { banner, ctaText } = config;
  const bg: CSSProperties = banner.bgImage
    ? { backgroundImage: `url(${banner.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: banner.bgColor };

  return (
    <div
      data-section-id={SECTION_ID}
      style={styles.root}
      onClick={() => onSelect?.(SECTION_ID, 'Add to Home Screen')}
    >
      {/* Background layer — opacity applies to the fill only, not the content. */}
      <div style={{ ...styles.bg, ...bg, opacity: banner.opacity / 100 }} />

      <div style={styles.content}>
        {banner.productEmoji && (
          <span style={styles.product}>{banner.productEmoji}</span>
        )}
        <span style={styles.text}>{banner.richText}</span>
        <button
          type="button"
          style={styles.cta}
          onClick={(e) => { e.stopPropagation(); openInstruction(); }}
        >
          {ctaText}
        </button>
        <button
          type="button"
          style={styles.dismiss}
          aria-label="Dismiss"
          onClick={(e) => { e.stopPropagation(); dismissEntry(); }}
        >
          <X size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 5,
    isolation: 'isolate',
    cursor: 'pointer',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  },
  product: {
    flexShrink: 0,
    width: 34,
    height: 34,
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    lineHeight: 1,
    background: 'rgba(255,255,255,0.18)',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)',
  },
  text: {
    flex: 1,
    minWidth: 0,
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: 700,
    lineHeight: 1.25,
    textShadow: '0 1px 2px rgba(0,0,0,0.35)',
  },
  cta: {
    flexShrink: 0,
    padding: '7px 12px',
    borderRadius: 8,
    background: '#ffffff',
    color: '#111827',
    fontSize: 11.5,
    fontWeight: 800,
    letterSpacing: 0.2,
    boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  dismiss: {
    flexShrink: 0,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;
