import type { CSSProperties } from 'react';
import { WIDGETS } from './state';
import type { WidgetDef } from './state';

/* ── Floating widgets — Figma "Widget (popup / reward / Daily)" (157-2853/8/63) ──
 * 68×68 collect buttons pinned over the storefront. Each carries the
 * data-section-id of the block it represents (popup / reward-calendar /
 * daily-bonus), so tree sync, hover focus, and selection frames work
 * through the existing preview delegation with no extra logic. */

const stackStyle: CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 150,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const widgetStyle: CSSProperties = {
  width: 68,
  height: 68,
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  background: 'radial-gradient(circle at 50% 30%, #ffd968 0%, #f3b83d 55%, #dd9a25 100%)',
  boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 0 0 1.5px rgba(255,255,255,0.35)',
};

const badgeStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 30,
  lineHeight: 1,
  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))',
};

const ctaStyle: CSSProperties = {
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
};

export function Widget({ def }: { def: WidgetDef }) {
  return (
    <div
      data-section-id={def.id}
      role="button"
      aria-label={def.label}
      style={widgetStyle}
    >
      <span style={badgeStyle}>{def.icon}</span>
      <span style={ctaStyle}>{def.cta}</span>
    </div>
  );
}

export default function WidgetsLayer() {
  return (
    <div style={stackStyle}>
      {WIDGETS.map((def) => (
        <Widget key={def.id} def={def} />
      ))}
    </div>
  );
}
