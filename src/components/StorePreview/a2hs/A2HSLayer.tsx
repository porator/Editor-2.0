import type { CSSProperties } from 'react';
import { RotateCcw } from 'lucide-react';
import { useA2HS } from '../../../hooks/useA2HS';
import FloatingButton from './FloatingButton';
import InstructionPopup from './InstructionPopup';
import RewardPopup from './RewardPopup';

/* Viewport-pinned A2HS overlay: the floating-button entry point, the
 * instruction/reward popups, and a small demo-control chip (editor-only) for
 * exercising the flow — platform switch, Android-native toggle, and reset.
 * The persistent Banner entry point renders separately, in-flow (A2HSBanner). */

interface Props {
  onSelect?: (id: string, label: string) => void;
}

export default function A2HSLayer({ onSelect }: Props) {
  const { config, runtime, setRuntime, resetFlow, setPlatform } = useA2HS();
  if (!config.enabled) return null;

  return (
    <>
      <FloatingButton onSelect={onSelect} />
      <InstructionPopup />
      <RewardPopup />

      {/* Demo controls — editor affordance, not part of the player store.
       * Dock opposite the active entry point so they never overlap it: top for
       * the floating-button template, bottom for the banner template. */}
      <div style={{ ...styles.controls, ...(config.template === 'existing' ? styles.controlsTop : styles.controlsBottom) }}>
        <span style={styles.controlsLabel}>A2HS demo</span>
        <div style={styles.segment}>
          {(['ios', 'android'] as const).map((p) => (
            <button
              key={p}
              type="button"
              style={{ ...styles.segBtn, ...(runtime.platform === p ? styles.segBtnOn : null) }}
              onClick={() => setPlatform(p)}
            >
              {p === 'ios' ? 'iOS' : 'Android'}
            </button>
          ))}
        </div>
        {runtime.platform === 'android' && (
          <button
            type="button"
            style={{ ...styles.toggle, ...(runtime.androidNativeAvailable ? styles.toggleOn : null) }}
            onClick={() => setRuntime((r) => ({ ...r, androidNativeAvailable: !r.androidNativeAvailable }))}
            title="Toggle whether the native install prompt is available"
          >
            {runtime.androidNativeAvailable ? 'Native prompt' : 'Fallback steps'}
          </button>
        )}
        <button type="button" style={styles.reset} onClick={resetFlow} title="Reset A2HS flow">
          <RotateCcw size={12} strokeWidth={2.25} />
          Reset
        </button>
      </div>
    </>
  );
}

const styles = {
  controls: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 6px',
    borderRadius: 100,
    background: 'rgba(17,24,39,0.82)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  controlsTop: {
    top: 8,
  },
  controlsBottom: {
    bottom: 8,
  },
  controlsLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    paddingLeft: 4,
  },
  segment: {
    display: 'flex',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: 100,
    padding: 2,
    gap: 2,
  },
  segBtn: {
    padding: '3px 8px',
    borderRadius: 100,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10.5,
    fontWeight: 700,
    cursor: 'pointer',
  },
  segBtnOn: {
    background: '#ffffff',
    color: '#111827',
  },
  toggle: {
    padding: '4px 9px',
    borderRadius: 100,
    background: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10.5,
    fontWeight: 700,
    cursor: 'pointer',
  },
  toggleOn: {
    background: 'rgba(129,140,248,0.35)',
    color: '#ffffff',
  },
  reset: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 9px',
    borderRadius: 100,
    background: 'rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10.5,
    fontWeight: 700,
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;
