import {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';

/* ── Shared hover focus state (Sections drawer ⇄ Store Preview) ──
 * One global hover state; both surfaces subscribe to it. `source` tells
 * the listener which side initiated the hover so it can auto-scroll. */

export type FocusSource = 'preview' | 'drawer';

export interface FocusState {
  hoveredSectionId: string | null;
  source: FocusSource | null;
}

interface FocusContextValue extends FocusState {
  setHoveredSection: (id: string | null, source?: FocusSource | null) => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function SectionFocusProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FocusState>({ hoveredSectionId: null, source: null });

  const setHoveredSection = useCallback(
    (id: string | null, source: FocusSource | null = null) => {
      setState((prev) => {
        const nextSource = id ? source : null;
        if (prev.hoveredSectionId === id && prev.source === nextSource) return prev;
        return { hoveredSectionId: id, source: nextSource };
      });
    },
    [],
  );

  const value = useMemo(() => ({ ...state, setHoveredSection }), [state, setHoveredSection]);
  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

export function useFocusState(): FocusContextValue {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocusState must be used inside a SectionFocusProvider');
  return ctx;
}

/* ── Per-section hook ──
 * Centralizes the hover contract for one section id. `bindHover(source)`
 * returns the mouse handlers to spread onto the section's DOM node.
 * List-style surfaces that render rows in a loop use useFocusState()
 * directly (hooks can't run per iteration) — same state, same contract. */
export function useSectionFocus(sectionId: string) {
  const { hoveredSectionId, source, setHoveredSection } = useFocusState();
  const isHovered = hoveredSectionId === sectionId;

  const bindHover = useCallback(
    (src: FocusSource) => ({
      onMouseEnter: () => setHoveredSection(sectionId, src),
      onMouseLeave: () => setHoveredSection(null),
    }),
    [sectionId, setHoveredSection],
  );

  /* Live DOM bounding box of the hovered section, viewport-relative.
   * Overlay consumers convert into their own container space. */
  const focusRect = isHovered
    ? document.querySelector(`[data-section-id="${sectionId}"]`)?.getBoundingClientRect() ?? null
    : null;

  return { isHovered, source, bindHover, focusRect };
}
