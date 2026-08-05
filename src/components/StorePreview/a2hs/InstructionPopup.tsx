import { useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { Share, Plus, Check, X } from 'lucide-react';
import { useA2HS } from '../../../hooks/useA2HS';

/* Appcharge-managed instruction popup shown after the CTA. Presentation is
 * publisher-configured: a bottom drawer (drag down to dismiss) or an inline
 * banner-style panel. iOS shows the 3-step share-sheet guide; Android shows a
 * simulated native install prompt, falling back to the iOS steps when the
 * native prompt is unavailable. Publisher rich text / background / opacity sit
 * behind the Appcharge-managed steps. */

const IOS_STEPS = [
  { icon: <Share size={15} strokeWidth={2.25} />, text: 'Tap the Share button at the bottom of your browser' },
  { icon: <Plus size={15} strokeWidth={2.25} />, text: 'Scroll down and tap "Add to Home Screen"' },
  { icon: <Check size={15} strokeWidth={2.25} />, text: 'Tap "Add" to confirm' },
];

export default function InstructionPopup() {
  const { config, runtime, closeInstruction, simulateHomeEntry } = useA2HS();
  const { instruction } = config;
  const { platform, androidNativeAvailable, instructionOpen } = runtime;

  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);

  if (!instructionOpen) return null;

  const isDrawer = instruction.presentation === 'drawer';
  const androidNative = platform === 'android' && androidNativeAvailable;

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!isDrawer) return;
    dragStart.current = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (dragStart.current === null) return;
    setDragY(Math.max(0, e.clientY - dragStart.current));
  };
  const onPointerUp = () => {
    if (dragStart.current === null) return;
    if (dragY > 80) closeInstruction();
    dragStart.current = null;
    setDragY(0);
  };

  const bg: CSSProperties = instruction.bgImage
    ? { backgroundImage: `url(${instruction.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: instruction.bgColor };

  const panelStyle: CSSProperties = isDrawer
    ? { ...styles.panel, ...styles.drawer, transform: `translateY(${dragY}px)`, transition: dragStart.current === null ? 'transform 180ms ease' : 'none' }
    : { ...styles.panel, ...styles.inline };

  return (
    <div style={styles.scrim} onClick={closeInstruction}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...styles.bg, ...bg, opacity: instruction.opacity / 100 }} />

        <div style={styles.body}>
          <button
            type="button"
            style={styles.close}
            aria-label="Dismiss"
            onClick={closeInstruction}
          >
            {instruction.dismissIcon
              ? <img src={instruction.dismissIcon} alt="" style={styles.closeImg} />
              : <X size={15} strokeWidth={2.5} />}
          </button>

          {isDrawer && (
            <div
              style={styles.handleZone}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <span style={styles.handle} />
            </div>
          )}

          <h3 style={styles.title}>Add to Home Screen</h3>
          {instruction.richText && (
            <div style={styles.rich} dangerouslySetInnerHTML={{ __html: instruction.richText }} />
          )}

          {androidNative ? (
            /* Simulated Android native install prompt */
            <div style={styles.nativePrompt}>
              <div style={styles.nativeHead}>
                <span style={styles.nativeIcon}>🛍️</span>
                <div>
                  <div style={styles.nativeTitle}>Add store to Home screen?</div>
                  <div style={styles.nativeUrl}>store.example.com</div>
                </div>
              </div>
              <div style={styles.nativeActions}>
                <button type="button" style={styles.nativeGhost} onClick={closeInstruction}>Cancel</button>
                <button type="button" style={styles.nativePrimary} onClick={simulateHomeEntry}>Install</button>
              </div>
            </div>
          ) : (
            /* iOS step-by-step guide (also the Android fallback) */
            <ol style={styles.steps}>
              {IOS_STEPS.map((s, i) => (
                <li key={i} style={styles.step}>
                  <span style={styles.stepNum}>{i + 1}</span>
                  <span style={styles.stepIcon}>{s.icon}</span>
                  <span style={styles.stepText}>{s.text}</span>
                </li>
              ))}
            </ol>
          )}

          {!androidNative && (
            <div style={styles.actions}>
              <button type="button" style={styles.primary} onClick={simulateHomeEntry}>
                Simulate opening from Home Screen
              </button>
              <button type="button" style={styles.secondary} onClick={closeInstruction}>
                {instruction.ctaText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  scrim: {
    position: 'absolute',
    inset: 0,
    zIndex: 40,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    padding: 14,
  },
  panel: {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    boxShadow: '0 -6px 24px rgba(0,0,0,0.3)',
    color: '#111827',
  },
  drawer: {
    marginTop: 'auto',
    width: '100%',
    borderRadius: '18px 18px 0 0',
    marginLeft: -14,
    marginRight: -14,
    marginBottom: -14,
    paddingBottom: 0,
  },
  inline: {
    margin: 'auto',
    width: '100%',
    borderRadius: 16,
  },
  bg: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  body: {
    position: 'relative',
    zIndex: 1,
    padding: '4px 16px 18px',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 2,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(17,24,39,0.06)',
    color: 'rgba(17,24,39,0.55)',
    cursor: 'pointer',
  },
  closeImg: {
    width: 16,
    height: 16,
    objectFit: 'contain',
    display: 'block',
  },
  handleZone: {
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0 6px',
    cursor: 'grab',
    touchAction: 'none',
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    background: 'rgba(17,24,39,0.2)',
  },
  title: {
    margin: '6px 0 6px',
    fontSize: 16,
    fontWeight: 800,
    color: 'inherit',
  },
  rich: {
    margin: '0 0 14px',
    fontSize: 12.5,
    lineHeight: 1.45,
    color: 'rgba(17,24,39,0.72)',
  },
  steps: {
    listStyle: 'none',
    margin: '0 0 16px',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  stepNum: {
    flexShrink: 0,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#4f46e5',
    color: '#fff',
    fontSize: 11,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    flexShrink: 0,
    width: 26,
    height: 26,
    borderRadius: 7,
    background: 'rgba(79,70,229,0.1)',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 12.5,
    lineHeight: 1.35,
    color: '#111827',
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingBottom: 14,
  },
  primary: {
    height: 40,
    borderRadius: 10,
    background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(79,70,229,0.35)',
  },
  secondary: {
    height: 38,
    borderRadius: 10,
    background: 'transparent',
    color: '#4f46e5',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
  },
  nativePrompt: {
    margin: '2px 0 14px',
    padding: 14,
    borderRadius: 14,
    background: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
  },
  nativeHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  nativeIcon: {
    fontSize: 26,
    lineHeight: 1,
  },
  nativeTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    color: '#111827',
  },
  nativeUrl: {
    fontSize: 11.5,
    color: '#6b7280',
  },
  nativeActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 6,
  },
  nativeGhost: {
    padding: '8px 14px',
    borderRadius: 8,
    color: '#4f46e5',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
  },
  nativePrimary: {
    padding: '8px 16px',
    borderRadius: 8,
    background: '#4f46e5',
    color: '#fff',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;
