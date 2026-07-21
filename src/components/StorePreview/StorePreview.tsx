import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PreviewState, SectionRect } from './types';
import { DEFAULT_PREVIEW_STATE, WIDGETS } from './state';
import { useFocusState } from '../../hooks/useSectionFocus';
import PreviewOverlay from './PreviewOverlay';
import WidgetsLayer from './Widgets';

/* ── StorePreview ──
 * Simulated mobile storefront. Owns layout only: scrolling, section
 * ordering (from state), hover detection, and the overlay layer.
 * Section content is owned entirely by each section component.
 * Hover focus is shared with the Sections drawer via SectionFocusProvider. */

interface Props {
  activeSection?: string;
  onSectionClick?: (id: string, label: string) => void;
  state?: PreviewState;
}

const rootStyle: CSSProperties = {
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  background: 'linear-gradient(180deg, #2f4a2e 0%, #263f28 100%)',
};

const contentStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  width: '100%',
};

/* Resolve the section id from any DOM node inside a section. */
function sectionIdFromNode(node: EventTarget | null): string | null {
  if (!(node instanceof Element)) return null;
  return node.closest('[data-section-id]')?.getAttribute('data-section-id') ?? null;
}

export default function StorePreview({
  activeSection,
  onSectionClick,
  state = DEFAULT_PREVIEW_STATE,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<Record<string, SectionRect>>({});
  const { hoveredSectionId, source, setHoveredSection } = useFocusState();

  const labels = Object.fromEntries([
    ...WIDGETS.map((w) => [w.id, w.label] as const),
    ...state.sections.map((s) => [s.id, s.label] as const),
  ]);

  /* Measure each section's bounding box relative to the content wrapper.
   * The overlay lives inside the (relatively positioned) content wrapper,
   * so these coordinates are scroll-independent. Never hardcoded. */
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const measure = () => {
      const parent = content.getBoundingClientRect();
      const next: Record<string, SectionRect> = {};
      content.querySelectorAll<HTMLElement>('[data-section-id]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        next[el.dataset.sectionId!] = {
          top: rect.top - parent.top,
          left: rect.left - parent.left,
          width: rect.width,
          height: rect.height,
        };
      });
      setRects(next);
    };

    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(content);
    content.querySelectorAll<HTMLElement>('[data-section-id]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [state]);

  /* Drawer-initiated hover → bring the section into view (only when needed). */
  useEffect(() => {
    if (source !== 'drawer' || !hoveredSectionId) return;
    const root = rootRef.current;
    const target = contentRef.current?.querySelector<HTMLElement>(
      `[data-section-id="${hoveredSectionId}"]`,
    );
    if (!root || !target) return;

    const rootRect = root.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const outside = rect.top < rootRect.top || rect.bottom > rootRect.bottom;
    if (outside) target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [source, hoveredSectionId]);

  return (
    <div ref={rootRef} style={rootStyle}>
      <div
        ref={contentRef}
        style={contentStyle}
        onMouseOver={(e) => {
          const id = sectionIdFromNode(e.target);
          if (id) setHoveredSection(id, 'preview');
        }}
        onMouseLeave={() => setHoveredSection(null)}
        onClick={(e) => {
          const id = sectionIdFromNode(e.target);
          if (id) onSectionClick?.(id, labels[id] ?? id);
        }}
      >
        {state.sections.map(({ id, component: Section, data, isVisible }) => (
          <Section key={id} sectionId={id} data={data} isVisible={isVisible} />
        ))}

        <WidgetsLayer />

        <PreviewOverlay
          rects={rects}
          labels={labels}
          hoveredId={hoveredSectionId}
          selectedId={activeSection ?? null}
        />
      </div>
    </div>
  );
}
