import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/* ── Pointer-based drag engine for the Offer Blocks tree ──
 * Replaces native HTML5 drag-and-drop (no start threshold, no auto-scroll,
 * no continuous pointer feed) with pointer events, keeping the same data
 * model and row components.
 *
 * Model: the dragged row leaves the document flow entirely and rides the
 * cursor in a floating layer, while a live gap of the same height opens in
 * the list at the prospective insertion point. The list rearranges around
 * the cursor rather than the cursor pointing at the list.
 *
 * The load-bearing detail is MEASUREMENT ISOLATION (see measureRows): the
 * gap changes the layout it is derived from, so hit-testing against live
 * geometry would feed back on itself and oscillate. Every frame we measure
 * the list *as if the gap were absent and no FLIP transform applied*, so
 * the zone boundaries are a fixed property of the list, not of the drag. */

const START_THRESHOLD = 5;
const EDGE_SIZE = 40;
const MAX_SCROLL_SPEED = 16;
const AUTO_EXPAND_DELAY = 400;

/* Zones as fractions of row height, so behaviour is identical regardless of
 * how tall a row renders: top 25% before, middle 50% nest, bottom 25% after. */
const ZONE_TOP = 0.25;
const ZONE_BOTTOM = 0.75;
/* Boundaries widen in favour of the active zone, so a pointer resting on a
 * boundary cannot oscillate between two slots. */
const ZONE_HYSTERESIS = 0.08;
/* Hierarchy only changes on deliberate horizontal travel. */
const HORIZONTAL_THRESHOLD = 24;
const FLIP_DURATION = 180;

type Zone = 'before' | 'inside' | 'after';

export type DropTarget =
  | { kind: 'root'; anchorId: string; edge: 'before' | 'after'; beforeId: string | null }
  | { kind: 'group'; groupId: string; anchorId: string; edge: 'before' | 'after'; beforeId: string | null }
  | { kind: 'inside'; targetId: string };

const targetKey = (t: DropTarget | null): string => {
  if (!t) return '-';
  if (t.kind === 'inside') return `in:${t.targetId}`;
  return `${t.kind}:${t.anchorId}:${t.edge}`;
};

interface RootItem { id: string }

interface Options {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  getItems: () => RootItem[];
  isGroupId: (id: string) => boolean;
  getChildIds: (groupId: string) => string[];
  isGroupOpen: (id: string) => boolean;
  /** Whether `draggedId` can live inside a group at all (target independent). */
  isGroupableMember: (draggedId: string) => boolean;
  /** Whether the middle "nest zone" of `targetId` should offer nesting. */
  canNestInto: (draggedId: string, targetId: string) => boolean;
  onAutoExpand: (groupId: string) => void;
  /** Applied once, on release. */
  onCommit: (draggedId: string, target: DropTarget) => void;
  /** Changes whenever the committed order changes, so the post-drop
   * settle can be animated too. */
  orderSignature: string;
}

export function useOfferTreeDrag(opts: Options) {
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const [dragId, setDragId] = useState<string | null>(null);
  const [target, setTarget] = useState<DropTarget | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  /* Gap matches the dragged row's height exactly, so the list opens by
   * precisely the space the block will occupy. */
  const [gapSize, setGapSize] = useState(0);
  const [dragWidth, setDragWidth] = useState(0);

  const dragIdRef = useRef<string | null>(null);
  const targetRef = useRef<DropTarget | null>(null);
  const draggingRef = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });
  /* Where inside the row the user grabbed, so the floating block keeps its
   * position relative to the cursor instead of snapping its corner to it. */
  const grabOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const rowEls = useRef(new Map<string, HTMLElement>());
  const rowRefCache = useRef(new Map<string, (el: HTMLElement | null) => void>());
  const layerEl = useRef<HTMLElement | null>(null);
  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expandCandidateId = useRef<string | null>(null);
  const zoneMemo = useRef<{ rowId: string; zone: Zone } | null>(null);
  const flipPrev = useRef<Map<string, number> | null>(null);

  const registerRow = useCallback((id: string) => {
    let cb = rowRefCache.current.get(id);
    if (!cb) {
      cb = (el) => {
        if (el) rowEls.current.set(id, el);
        else rowEls.current.delete(id);
      };
      rowRefCache.current.set(id, cb);
    }
    return cb;
  }, []);

  const registerLayer = useCallback((el: HTMLElement | null) => { layerEl.current = el; }, []);

  const clearExpandTimer = () => {
    if (expandTimer.current) { clearTimeout(expandTimer.current); expandTimer.current = null; }
    expandCandidateId.current = null;
  };

  /* ── Measurement isolation ──
   * Read every row's geometry with the gap collapsed and FLIP transforms
   * neutralised, then restore both. All writes/reads happen synchronously
   * inside one frame, so nothing is ever painted in this state — but the
   * numbers describe the stable "no gap, no animation" list. Without this,
   * the gap would move the rows that decide where the gap goes. */
  const measureRows = (): Map<string, { top: number; height: number }> => {
    /* Find the gap by attribute rather than by ref. When the gap moves to a
     * different parent, React can invoke the *old* node's ref callback with
     * null AFTER the new node's, leaving a ref null while the element is very
     * much on screen — which silently disables this whole isolation step and
     * lets the feedback loop run. A DOM query can't get out of sync. */
    const root = optsRef.current.scrollContainerRef.current;
    const gaps = root ? Array.from(root.querySelectorAll<HTMLElement>('[data-drag-gap]')) : [];

    const savedGapDisplay = gaps.map((el) => el.style.display);
    const savedTransforms: Array<[HTMLElement, string, string]> = [];
    rowEls.current.forEach((el) => {
      savedTransforms.push([el, el.style.transform, el.style.transition]);
      // Neutralise in-flight FLIP transforms so we read layout, not animation.
      el.style.transition = 'none';
      el.style.transform = 'none';
    });
    gaps.forEach((el) => { el.style.display = 'none'; });

    const out = new Map<string, { top: number; height: number }>();
    rowEls.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      if (r.height > 0) out.set(id, { top: r.top, height: r.height });
    });

    gaps.forEach((el, i) => { el.style.display = savedGapDisplay[i]; });
    savedTransforms.forEach(([el, transform, transition]) => {
      el.style.transform = transform;
      el.style.transition = transition;
    });
    return out;
  };

  const resolve = (
    rects: Map<string, { top: number; height: number }>,
    y: number,
    dx: number,
  ): DropTarget | null => {
    const o = optsRef.current;
    const draggedId = dragIdRef.current;
    if (!draggedId) return null;
    const rootItems = o.getItems();
    const rootIds = rootItems.map((i) => i.id).filter((id) => id !== draggedId);

    type Candidate = { id: string; top: number; height: number; parentGroupId: string | null; isGroup: boolean };
    const candidates: Candidate[] = [];
    const push = (id: string, parentGroupId: string | null, isGroup: boolean) => {
      const r = rects.get(id);
      if (r) candidates.push({ id, top: r.top, height: r.height, parentGroupId, isGroup });
    };
    for (const item of rootItems) {
      if (item.id !== draggedId) push(item.id, null, o.isGroupId(item.id));
      // Children are only hit-testable while their group is open.
      if (o.isGroupId(item.id) && o.isGroupOpen(item.id)) {
        for (const childId of o.getChildIds(item.id)) {
          if (childId !== draggedId) push(childId, item.id, false);
        }
      }
    }
    if (candidates.length === 0) { clearExpandTimer(); return null; }

    /* Nearest row wins, but a row the pointer is inside always beats a merely
     * close one — no pixel-perfect placement required. */
    let best = candidates[0];
    let bestScore = Infinity;
    for (const c of candidates) {
      const mid = c.top + c.height / 2;
      const inside = y >= c.top && y <= c.top + c.height;
      const score = (inside ? -1e6 : 0) + Math.abs(y - mid);
      if (score < bestScore) { bestScore = score; best = c; }
    }

    const relY = (y - best.top) / best.height;
    const prev = zoneMemo.current?.rowId === best.id ? zoneMemo.current.zone : null;
    let topB = ZONE_TOP;
    let botB = ZONE_BOTTOM;
    if (prev === 'before') topB += ZONE_HYSTERESIS;
    else if (prev === 'after') botB -= ZONE_HYSTERESIS;
    else if (prev === 'inside') { topB -= ZONE_HYSTERESIS; botB += ZONE_HYSTERESIS; }

    let zone: Zone = relY < topB ? 'before' : relY > botB ? 'after' : 'inside';

    const nestAllowed = o.isGroupableMember(draggedId) && o.canNestInto(draggedId, best.id);
    // Middle zone over an incompatible target degrades to the nearer edge.
    if (zone === 'inside' && !nestAllowed) zone = relY < 0.5 ? 'before' : 'after';

    let forceRoot = false;
    if (dx > HORIZONTAL_THRESHOLD && nestAllowed) {
      zone = 'inside';
    } else if (dx < -HORIZONTAL_THRESHOLD) {
      if (zone === 'inside') zone = relY < 0.5 ? 'before' : 'after';
      forceRoot = true;
    }

    zoneMemo.current = { rowId: best.id, zone };

    // Auto-expand only while genuinely previewing a nest into a closed group.
    if (zone === 'inside' && best.isGroup && !o.isGroupOpen(best.id)) {
      if (expandCandidateId.current !== best.id) {
        clearExpandTimer();
        expandCandidateId.current = best.id;
        const id = best.id;
        expandTimer.current = setTimeout(() => optsRef.current.onAutoExpand(id), AUTO_EXPAND_DELAY);
      }
    } else {
      clearExpandTimer();
    }

    if (zone === 'inside') return { kind: 'inside', targetId: best.id };

    const after = (ids: string[], id: string): string | null => {
      const i = ids.indexOf(id);
      return i === -1 ? null : (ids[i + 1] ?? null);
    };

    /* Hovering a child while dragging leftwards (or with a block that can't
     * be a member) resolves against the parent group's own root-level slot. */
    if (best.parentGroupId && (forceRoot || !o.isGroupableMember(draggedId))) {
      const gid = best.parentGroupId;
      const edge = relY < 0.5 ? 'before' : 'after';
      return { kind: 'root', anchorId: gid, edge, beforeId: edge === 'before' ? gid : after(rootIds, gid) };
    }

    if (best.parentGroupId) {
      const siblings = o.getChildIds(best.parentGroupId).filter((id) => id !== draggedId);
      return {
        kind: 'group',
        groupId: best.parentGroupId,
        anchorId: best.id,
        edge: zone,
        beforeId: zone === 'before' ? best.id : after(siblings, best.id),
      };
    }

    return {
      kind: 'root',
      anchorId: best.id,
      edge: zone,
      beforeId: zone === 'before' ? best.id : after(rootIds, best.id),
    };
  };

  /* Visual positions (transforms and gap included) captured just before the
   * slot moves, so the FLIP pass below can animate the delta. */
  const captureFlip = () => {
    const m = new Map<string, number>();
    rowEls.current.forEach((el, id) => m.set(id, el.getBoundingClientRect().top));
    flipPrev.current = m;
  };

  /* Neighbours slide into their new positions instead of snapping, both as
   * the gap moves and as the list settles after the drop. */
  useLayoutEffect(() => {
    const prev = flipPrev.current;
    if (!prev) return;
    flipPrev.current = null;
    rowEls.current.forEach((el, id) => {
      const before = prev.get(id);
      if (before === undefined) return;
      const dy = before - el.getBoundingClientRect().top;
      if (Math.abs(dy) < 0.5) return;
      el.style.transition = 'none';
      el.style.transform = `translateY(${dy}px)`;
      void el.offsetHeight; // reflow, so the transition below actually runs
      el.style.transition = `transform ${FLIP_DURATION}ms cubic-bezier(0.2, 0, 0, 1)`;
      el.style.transform = '';
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey(target), opts.orderSignature]);

  const autoScroll = () => {
    const el = optsRef.current.scrollContainerRef.current?.parentElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = lastPointer.current.y;
    let speed = 0;
    if (y < rect.top + EDGE_SIZE) {
      speed = -Math.ceil(((rect.top + EDGE_SIZE - y) / EDGE_SIZE) * MAX_SCROLL_SPEED);
    } else if (y > rect.bottom - EDGE_SIZE) {
      speed = Math.ceil(((y - (rect.bottom - EDGE_SIZE)) / EDGE_SIZE) * MAX_SCROLL_SPEED);
    }
    if (speed !== 0) el.scrollTop += speed;
  };

  const tick = () => {
    if (!draggingRef.current) return;
    autoScroll();
    /* Float the dragged block by writing transform directly — a React
     * re-render per frame would be both slower and jerkier. */
    if (layerEl.current) {
      const x = lastPointer.current.x - grabOffset.current.x;
      const y = lastPointer.current.y - grabOffset.current.y;
      layerEl.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    const next = resolve(measureRows(), lastPointer.current.y, lastPointer.current.x - startPos.current.x);
    if (targetKey(next) !== targetKey(targetRef.current)) {
      captureFlip();
      targetRef.current = next;
      setTarget(next);
    }
    rafId.current = requestAnimationFrame(tick);
  };

  const finish = (commit: boolean) => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('keydown', handleKeyDown);
    if (rafId.current !== null) { cancelAnimationFrame(rafId.current); rafId.current = null; }
    clearExpandTimer();
    const shouldCommit = commit && draggingRef.current && dragIdRef.current && targetRef.current;
    // Capture before the layout collapses so the settle animates too.
    if (draggingRef.current) captureFlip();
    if (shouldCommit) optsRef.current.onCommit(dragIdRef.current!, targetRef.current!);
    draggingRef.current = false;
    dragIdRef.current = null;
    targetRef.current = null;
    zoneMemo.current = null;
    setDragId(null);
    setTarget(null);
    setIsDragging(false);
    setGapSize(0);
  };

  function handlePointerMove(e: PointerEvent) {
    lastPointer.current = { x: e.clientX, y: e.clientY };
    if (!draggingRef.current) {
      // Threshold guard: a click that drifts a pixel or two is still a click.
      if (Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y) < START_THRESHOLD) return;
      const el = dragIdRef.current ? rowEls.current.get(dragIdRef.current) : null;
      if (el) {
        // Measure before the row leaves the flow, so the floating block and
        // the gap both keep the row's real dimensions.
        const r = el.getBoundingClientRect();
        grabOffset.current = { x: startPos.current.x - r.left, y: startPos.current.y - r.top };
        setGapSize(r.height);
        setDragWidth(r.width);
      }
      draggingRef.current = true;
      setIsDragging(true);
      rafId.current = requestAnimationFrame(tick);
    }
  }

  function handlePointerUp() { finish(true); }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') finish(false);
  }

  const startDrag = useCallback((id: string) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragIdRef.current = id;
    setDragId(id);
    startPos.current = { x: e.clientX, y: e.clientY };
    lastPointer.current = startPos.current;
    zoneMemo.current = null;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
    window.addEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dragId, target, isDragging, gapSize, dragWidth,
    registerRow, registerLayer, startDrag,
  };
}
