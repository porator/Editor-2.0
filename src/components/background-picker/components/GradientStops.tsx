import * as React from "react";

import { cn } from "@/lib/utils";
import type { GradientStop } from "../BackgroundPicker.types";
import { STEP, STEP_LARGE, TRACK_HEIGHT } from "../styles/constants";
import { clamp } from "../utils/color";
import { toStopTrackCss } from "../utils/gradient";
import { CHECKERBOARD_STYLE } from "./LinearTrack";

export interface GradientStopsProps {
  stops: GradientStop[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, position: number) => void;
  className?: string;
}

/**
 * Interactive gradient stop track (Figma): the gradient rendered on a rounded
 * bar with draggable 15px handles. Drag to reposition/reorder, click to select,
 * Delete/Backspace to remove. New stops are added from the "+ Add" action in
 * the Stops section. No Design System equivalent — a new primitive.
 */
export const GradientStops = React.memo(function GradientStops({
  stops,
  selectedId,
  onSelect,
  onRemove,
  onMove,
  className,
}: GradientStopsProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const activeIdRef = React.useRef<string | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const pendingRef = React.useRef<number | null>(null);

  const positionFromClientX = React.useCallback((clientX: number): number => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return 0;
    return clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
  }, []);

  React.useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!activeIdRef.current) return;
      e.preventDefault();
      pendingRef.current = positionFromClientX(e.clientX);
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null;
          if (activeIdRef.current != null && pendingRef.current != null) {
            onMove(activeIdRef.current, pendingRef.current);
          }
        });
      }
    };
    const stop = () => {
      activeIdRef.current = null;
    };
    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [onMove, positionFromClientX]);

  const handleKeyDown = (e: React.KeyboardEvent, stop: GradientStop) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onRemove(stop.id);
      return;
    }
    const step = e.shiftKey ? STEP_LARGE : STEP;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onMove(stop.id, clamp(stop.position - step, 0, 100));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onMove(stop.id, clamp(stop.position + step, 0, 100));
    }
  };

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative w-full touch-none rounded-full",
        className,
      )}
      style={{ height: TRACK_HEIGHT }}
    >
      <span aria-hidden className="absolute inset-0 rounded-full" style={CHECKERBOARD_STYLE} />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ backgroundImage: toStopTrackCss(stops) }}
      />
      {stops.map((stop) => {
        const selected = stop.id === selectedId;
        return (
          <button
            key={stop.id}
            type="button"
            role="slider"
            aria-label={`Gradient stop at ${Math.round(stop.position)}%`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(stop.position)}
            aria-pressed={selected}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, stop)}
            onFocus={() => onSelect(stop.id)}
            onPointerDown={() => {
              onSelect(stop.id);
              activeIdRef.current = stop.id;
            }}
            className={cn(
              "absolute top-1/2 size-[15px] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-[3px] border-white bg-transparent shadow-[0px_1.875px_5.625px_0px_rgba(0,0,0,0.1),0px_1.875px_3.75px_0px_rgba(0,0,0,0.06)] outline-none transition-transform active:cursor-grabbing",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected && "z-10 scale-110 ring-2 ring-ring",
            )}
            style={{ left: `${stop.position}%` }}
          />
        );
      })}
    </div>
  );
});
