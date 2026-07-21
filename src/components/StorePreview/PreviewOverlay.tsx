import { useRef } from 'react';
import { PanelTop } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { SectionRect } from './types';

/* ── Overlay layer ──
 * Sits above all sections. Renders editor chrome only — the Focus Frame
 * (hover) and Selection Frame (active), and later resize handles / drop
 * indicators. pointer-events: none — the preview handles all interaction.
 *
 * The Focus Frame is a single persistent element: it MOVES between
 * sections (animated top/left/width/height) and fades in/out. It is
 * never unmounted and recreated during hover transitions. */

interface Props {
  rects: Record<string, SectionRect>;
  labels: Record<string, string>;
  hoveredId: string | null;
  selectedId: string | null;
}

/* Label placement: outside (above the frame) by default; inside when the
 * frame is too close to the top of the Preview for the label to fit.
 * Derived from measured geometry — never hardcoded per section, so it
 * stays correct when sections are hidden, removed, or reordered. */
type LabelPosition = 'outside' | 'inside';

const LABEL_HEIGHT = 36;

function labelPositionFor(rect: SectionRect): LabelPosition {
  return rect.top < LABEL_HEIGHT + 8 ? 'inside' : 'outside';
}

const overlayStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
};

const chipBase: CSSProperties = {
  position: 'absolute',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '5px 8px',
  background: '#6366f1',
  color: '#ffffff',
  fontSize: 11,
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const chipOutside: CSSProperties = {
  ...chipBase,
  bottom: '100%',
  left: -2,
  borderRadius: '6px 6px 0 0',
};

/* Inside chip nests into the frame's top-left corner (Figma "Top Focus"):
 * flush against the border, top-left radius following the frame's rounded
 * corner, bottom-right rounded, remaining corners square. */
const chipInside: CSSProperties = {
  ...chipBase,
  top: 0,
  left: 0,
  padding: '5px 12px 5px 10px',
  borderRadius: '18px 0 10px 0',
};

/* Single reusable frame — used for both hover focus and selection.
 * Only the label position varies, chosen from available space above. */
function Frame({ rect, label, visible, animated }: {
  rect: SectionRect;
  label: string;
  visible: boolean;
  animated?: boolean;
}) {
  const labelPosition = labelPositionFor(rect);
  return (
    <div
      style={{
        position: 'absolute',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        border: '2px solid #6366f1',
        /* Top section: follow the canvas's rounded top corners (Figma "Top Focus") */
        borderRadius: labelPosition === 'inside' ? '20px 20px 4px 4px' : 4,
        boxSizing: 'border-box',
        opacity: visible ? 1 : 0,
        transition: animated
          ? visible
            ? 'top 180ms ease, left 180ms ease, width 180ms ease, height 180ms ease, opacity 150ms ease-out'
            : 'opacity 120ms ease'
          : undefined,
      }}
    >
      <span style={labelPosition === 'inside' ? chipInside : chipOutside}>
        <PanelTop size={12} strokeWidth={2} />
        {label}
      </span>
    </div>
  );
}

export default function PreviewOverlay({ rects, labels, hoveredId, selectedId }: Props) {
  /* Hover target — suppressed while it matches the selection frame. */
  const targetId = hoveredId && hoveredId !== selectedId ? hoveredId : null;
  const target = targetId ? rects[targetId] ?? null : null;

  /* Remember the last hovered geometry so the frame can fade out in
   * place (and glide from its previous position on the next hover). */
  const lastRef = useRef<{ rect: SectionRect; label: string } | null>(null);
  if (targetId && target) {
    lastRef.current = { rect: target, label: labels[targetId] ?? targetId };
  }
  const frame = lastRef.current;

  const selected = selectedId ? rects[selectedId] ?? null : null;

  return (
    <div style={overlayStyle} aria-hidden>
      {frame && (
        <Frame
          rect={frame.rect}
          label={frame.label}
          visible={Boolean(target)}
          animated
        />
      )}
      {selected && selectedId && (
        <Frame
          rect={selected}
          label={labels[selectedId] ?? selectedId}
          visible
        />
      )}
    </div>
  );
}
