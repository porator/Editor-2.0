import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/* ── Resizable left drawer ──
 * Lets the user trade panel width against preview width on smaller screens.
 *
 * Two distinct values, deliberately:
 *   preferred — what the user last dragged to. Persisted. Only the user
 *               changes it.
 *   effective — preferred clamped to what the current viewport allows.
 * Collapsing these would make the clamp destructive: shrink the window once
 * and the preference is overwritten with the smaller value, so widening the
 * window again never gives the user their panel back.
 *
 * The effective width is written straight to the DOM while dragging and only
 * committed to React state on release — the panel holds the whole block tree,
 * so a re-render per pointermove would make the drag stutter on large trees.
 * The preview still tracks in real time because it is `flex: 1`: the browser
 * reflows it from the panel's new width with no React involvement.
 */

const STORAGE_KEY = 'ac-editor-panel-width';

export const DRAWER_DEFAULT_WIDTH = 300;
/* Below this the tree stops being readable. Labels already truncate via
 * text-overflow, so this is where truncation stops being graceful. */
export const DRAWER_MIN_WIDTH = 200;
/* Never let the panel crowd out the preview. */
const MAX_VIEWPORT_RATIO = 0.45;

const maxWidthFor = (viewportWidth: number) =>
  Math.max(DRAWER_MIN_WIDTH, Math.round(viewportWidth * MAX_VIEWPORT_RATIO));

/* Rounded: the drag seeds from getBoundingClientRect(), which is fractional,
 * and a sub-pixel width would otherwise be written and persisted verbatim. */
const clampWidth = (w: number, viewportWidth: number) =>
  Math.round(Math.min(Math.max(w, DRAWER_MIN_WIDTH), maxWidthFor(viewportWidth)));

const viewport = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);

function readPreferred(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return DRAWER_DEFAULT_WIDTH;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : DRAWER_DEFAULT_WIDTH;
  } catch {
    return DRAWER_DEFAULT_WIDTH;
  }
}

export function useResizableDrawer() {
  const panelRef = useRef<HTMLElement | null>(null);
  const preferredRef = useRef<number>(
    typeof window === 'undefined' ? DRAWER_DEFAULT_WIDTH : readPreferred(),
  );

  const [width, setWidth] = useState<number>(() => clampWidth(preferredRef.current, viewport()));
  const [isResizing, setIsResizing] = useState(false);

  /* Deliberately NOT re-synced from `width` on every render: a render during
   * a drag would clobber the live value mid-gesture and commit a stale width
   * on release. Every writer below updates this ref explicitly. */
  const widthRef = useRef(width);
  const dragStart = useRef({ x: 0, w: 0 });
  const resizingRef = useRef(false);

  const persistPreferred = (w: number) => {
    preferredRef.current = w;
    try { window.localStorage.setItem(STORAGE_KEY, String(w)); } catch { /* private mode */ }
  };

  /* Single writer for the DOM width. The panel is sized imperatively rather
   * than through a React `style` prop, because a mid-drag re-render would
   * otherwise reapply the last committed state and snap the panel backwards
   * under the pointer. */
  const applyWidth = (w: number) => {
    widthRef.current = w;
    if (panelRef.current) panelRef.current.style.width = `${w}px`;
  };

  useLayoutEffect(() => {
    if (!resizingRef.current) applyWidth(width);
  }, [width]);

  /* Re-derive from the *preference* on every viewport change, so a narrow
   * window clamps down and a wide one restores what the user actually chose. */
  useEffect(() => {
    const onResize = () => setWidth(clampWidth(preferredRef.current, window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    applyWidth(clampWidth(dragStart.current.w + (e.clientX - dragStart.current.x), window.innerWidth));
  }, []);

  const endDrag = useCallback(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    resizingRef.current = false;
    setIsResizing(false);
    setWidth(widthRef.current);
    persistPreferred(widthRef.current);
  }, [onPointerMove]);

  const onHandlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragStart.current = {
      x: e.clientX,
      w: panelRef.current?.getBoundingClientRect().width ?? widthRef.current,
    };
    resizingRef.current = true;
    setIsResizing(true);
    /* Suppress selection, and hold the resize cursor even when the pointer
     * outruns the 10px handle mid-drag. */
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
  }, [onPointerMove, endDrag]);

  /* Double-click the handle → back to the shipped default. */
  const onHandleDoubleClick = useCallback(() => {
    const next = clampWidth(DRAWER_DEFAULT_WIDTH, window.innerWidth);
    applyWidth(next);
    setWidth(next);
    persistPreferred(DRAWER_DEFAULT_WIDTH);
  }, []);

  return { width, isResizing, panelRef, onHandlePointerDown, onHandleDoubleClick };
}
