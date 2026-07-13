import * as React from "react";

import { clamp } from "../utils/color";

export interface DragPosition {
  /** Normalized 0–1 across the element width. */
  x: number;
  /** Normalized 0–1 across the element height. */
  y: number;
}

/**
 * Pointer-drag helper shared by ColorCanvas, HueSlider, AlphaSlider and
 * GradientStops. Reports the normalized pointer position within the target
 * element, coalesced to animation frames for smooth 60fps dragging.
 *
 * Returns an `onPointerDown` handler to spread onto the target element and a
 * live `isDragging` flag.
 */
export function usePointerDrag(
  onChange: (pos: DragPosition, event: PointerEvent) => void,
) {
  const [isDragging, setIsDragging] = React.useState(false);
  const targetRef = React.useRef<HTMLElement | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const latestRef = React.useRef<{ pos: DragPosition; event: PointerEvent } | null>(
    null,
  );

  // Keep the callback fresh without re-subscribing listeners.
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const compute = React.useCallback(
    (event: PointerEvent): DragPosition | null => {
      const el = targetRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      return {
        x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
      };
    },
    [],
  );

  const flush = React.useCallback(() => {
    frameRef.current = null;
    const latest = latestRef.current;
    if (latest) onChangeRef.current(latest.pos, latest.event);
  }, []);

  const schedule = React.useCallback(
    (event: PointerEvent) => {
      const pos = compute(event);
      if (!pos) return;
      latestRef.current = { pos, event };
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(flush);
      }
    },
    [compute, flush],
  );

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMove = (event: PointerEvent) => {
      event.preventDefault();
      schedule(event);
    };
    const stop = () => setIsDragging(false);

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isDragging, schedule]);

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      targetRef.current = event.currentTarget;
      event.currentTarget.focus({ preventScroll: true });
      setIsDragging(true);
      // Emit immediately so a click (without move) still registers.
      const pos = compute(event.nativeEvent);
      if (pos) onChangeRef.current(pos, event.nativeEvent);
    },
    [compute],
  );

  return { onPointerDown, isDragging } as const;
}
