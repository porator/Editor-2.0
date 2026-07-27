import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/* ── Resizable vertical split inside the left drawer ──
 * Governs how much height the Webstore Blocks card gets versus the config
 * card stacked beneath it. Same shape as useResizableDrawer:
 *
 *   preferred — the ratio the user last dragged to. Persisted, user-only.
 *   effective — preferred clamped so neither card collapses.
 *
 * Kept separate so a short window can squeeze the split without destroying
 * the user's preference; a taller window restores it.
 *
 * The ratio is written straight to the DOM while dragging and committed to
 * React state on release — the top card holds the whole block tree, so a
 * re-render per pointermove would stutter on large trees.
 */

const STORAGE_KEY = 'ac-editor-stack-ratio';

export const STACK_DEFAULT_RATIO = 0.55;
/* Neither card may fall below this, so both keep a usable header + content. */
const MIN_PANE_PX = 120;
/* Backstop for very tall panels, where the pixel minimum barely binds. */
const MIN_RATIO = 0.2;
const MAX_RATIO = 0.8;

function clampRatio(ratio: number, containerHeight: number): number {
  let lo = MIN_RATIO;
  let hi = MAX_RATIO;
  if (containerHeight > MIN_PANE_PX * 2) {
    lo = Math.max(lo, MIN_PANE_PX / containerHeight);
    hi = Math.min(hi, 1 - MIN_PANE_PX / containerHeight);
  }
  if (lo > hi) return 0.5; // container too short to honour both minimums
  return Math.min(Math.max(ratio, lo), hi);
}

function readPreferred(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return STACK_DEFAULT_RATIO;
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : STACK_DEFAULT_RATIO;
  } catch {
    return STACK_DEFAULT_RATIO;
  }
}

/** @param enabled false when there's no second card to split against. */
export function useResizableStack(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const preferredRef = useRef<number>(
    typeof window === 'undefined' ? STACK_DEFAULT_RATIO : readPreferred(),
  );

  const [ratio, setRatio] = useState<number>(preferredRef.current);
  const [isResizing, setIsResizing] = useState(false);

  const ratioRef = useRef(ratio);
  const resizingRef = useRef(false);

  const persistPreferred = (r: number) => {
    preferredRef.current = r;
    try { window.localStorage.setItem(STORAGE_KEY, r.toFixed(4)); } catch { /* private mode */ }
  };

  /* Single writer for the DOM. The top card is sized imperatively rather than
   * through a React style prop, so a mid-drag re-render can't reapply the last
   * committed ratio and snap the divider back under the pointer. */
  const applyRatio = (r: number) => {
    ratioRef.current = r;
    if (topRef.current) topRef.current.style.flex = `0 0 ${(r * 100).toFixed(3)}%`;
  };

  useLayoutEffect(() => {
    if (!enabled) return;
    if (!resizingRef.current) {
      const h = containerRef.current?.getBoundingClientRect().height ?? 0;
      applyRatio(clampRatio(ratio, h));
    }
  }, [ratio, enabled]);

  /* Re-derive from the preference whenever the panel's height changes, so a
   * short window squeezes the split and a tall one restores the choice. */
  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(() => {
      if (resizingRef.current) return;
      applyRatio(clampRatio(preferredRef.current, el.getBoundingClientRect().height));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled]);

  const onPointerMove = useCallback((e: PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.height <= 0) return;
    applyRatio(clampRatio((e.clientY - r.top) / r.height, r.height));
  }, []);

  const endDrag = useCallback(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    resizingRef.current = false;
    setIsResizing(false);
    setRatio(ratioRef.current);
    persistPreferred(ratioRef.current);
  }, [onPointerMove]);

  const onDividerPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    resizingRef.current = true;
    setIsResizing(true);
    /* Hold the cursor even when the pointer outruns the 10px divider. */
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
  }, [onPointerMove, endDrag]);

  const onDividerDoubleClick = useCallback(() => {
    const h = containerRef.current?.getBoundingClientRect().height ?? 0;
    applyRatio(clampRatio(STACK_DEFAULT_RATIO, h));
    setRatio(STACK_DEFAULT_RATIO);
    persistPreferred(STACK_DEFAULT_RATIO);
  }, []);

  return { ratio, isResizing, containerRef, topRef, onDividerPointerDown, onDividerDoubleClick };
}
