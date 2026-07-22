import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PreviewState, SectionRect } from './types';
import { DEFAULT_PREVIEW_STATE } from './state';
import { useFocusState } from '../../hooks/useSectionFocus';
import { useGrouping } from '../../hooks/useGrouping';
import PreviewOverlay from './PreviewOverlay';

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

/* One shared section boundary for a group — its child widgets lay out
 * horizontally, wrapping if the width is constrained. */
const groupSectionStyle: CSSProperties = {
  padding: '8px 12px',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 8,
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
  const { order, groups, groupOf } = useGrouping();

  /* All known sections keyed by id (the registry the tree draws from). */
  const registry = Object.fromEntries(state.sections.map((s) => [s.id, s] as const));

  const labels = Object.fromEntries([
    ...state.sections.map((s) => [s.id, s.label] as const),
    ...groups.map((g) => [g.id, g.title] as const),
  ]);

  /* The sections to render, in order: Header, then the Offers the tree
   * currently has (published `order` — so added blocks land at the bottom),
   * then Footer. Offers not in the tree aren't rendered. */
  const orderedSections = [
    registry['header'],
    ...order.map((id) => registry[id]),
    registry['footer'],
  ].filter((s): s is PreviewState['sections'][number] => Boolean(s));

  /* Render plan: grouped sections collapse into a single group container
   * (rendered at the first member's position); everything else renders
   * standalone. Member order follows the group's child order. */
  const renderPlan = (() => {
    type Entry =
      | { kind: 'section'; section: PreviewState['sections'][number] }
      | { kind: 'group'; id: string; members: PreviewState['sections'] };
    const done = new Set<string>();
    const plan: Entry[] = [];
    for (const section of orderedSections) {
      if (done.has(section.id)) continue;
      const grp = groupOf(section.id);
      if (grp) {
        const members = grp.childIds
          .map((cid) => registry[cid])
          .filter((s): s is PreviewState['sections'][number] => Boolean(s));
        members.forEach((m) => done.add(m.id));
        if (members.length) plan.push({ kind: 'group', id: grp.id, members });
      } else {
        done.add(section.id);
        plan.push({ kind: 'section', section });
      }
    }
    return plan;
  })();

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
        {renderPlan.map((entry) => {
          if (entry.kind === 'section') {
            const { id, component: Section, data, isVisible } = entry.section;
            return <Section key={id} sectionId={id} data={data} isVisible={isVisible} />;
          }
          return (
            <section
              key={entry.id}
              id={entry.id}
              data-section-id={entry.id}
              style={groupSectionStyle}
            >
              {entry.members.map(({ id, component: Member, data, isVisible }) => (
                <Member key={id} sectionId={id} data={data} isVisible={isVisible} bare />
              ))}
            </section>
          );
        })}

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
