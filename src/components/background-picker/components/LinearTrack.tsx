import * as React from "react";

import { cn } from "@/lib/utils";
import { THUMB_SIZE, TRACK_HEIGHT } from "../styles/constants";
import { clamp } from "../utils/color";
import { usePointerDrag } from "../hooks/usePointerDrag";

/** Small checkerboard used behind translucent colors (alpha track / swatches). */
export const CHECKERBOARD_STYLE: React.CSSProperties = {
  backgroundImage:
    "conic-gradient(#0000001a 25%, transparent 0 50%, #0000001a 0 75%, transparent 0)",
  backgroundSize: "8px 8px",
  backgroundColor: "#fff",
};

export interface LinearTrackProps {
  /** Normalized thumb position, 0–1. */
  value: number;
  /** Emits the normalized position, 0–1. */
  onChange: (value: number) => void;
  /** Track fill (gradient); rendered above the optional checkerboard. */
  trackStyle: React.CSSProperties;
  /** Render an alpha checkerboard beneath the track fill. */
  checkerboard?: boolean;
  ariaLabel: string;
  /** Human-readable current value, e.g. `"210°"` or `"50%"`. */
  ariaValueText: string;
  /** Keyboard step as a fraction of the full range (0–1). */
  step?: number;
  largeStep?: number;
  className?: string;
}

/**
 * Shared horizontal track+thumb control used by HueSlider and AlphaSlider.
 * Centralises pointer dragging (via usePointerDrag) and keyboard handling so
 * neither slider duplicates that logic. The thumb matches the Figma slider
 * knob (15px white circle, subtle border + shadow, focus ring).
 */
export const LinearTrack = React.memo(function LinearTrack({
  value,
  onChange,
  trackStyle,
  checkerboard = false,
  ariaLabel,
  ariaValueText,
  step = 0.01,
  largeStep = 0.1,
  className,
}: LinearTrackProps) {
  const { onPointerDown, isDragging } = usePointerDrag(({ x }) => onChange(x));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const s = e.shiftKey ? largeStep : step;
    let next = value;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next -= s;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next += s;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(clamp(next, 0, 1));
  };

  return (
    <div
      className={cn("relative flex items-center", className)}
      style={{ height: THUMB_SIZE }}
    >
      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={ariaValueText}
        onPointerDown={onPointerDown}
        onKeyDown={handleKeyDown}
        className="relative w-full cursor-pointer touch-none rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        style={{ height: TRACK_HEIGHT }}
      >
        {checkerboard && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={CHECKERBOARD_STYLE}
          />
        )}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={trackStyle}
        />
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-transparent shadow-[0px_1.875px_5.625px_0px_rgba(0,0,0,0.1),0px_1.875px_3.75px_0px_rgba(0,0,0,0.06)]",
            isDragging ? "" : "transition-transform",
          )}
          style={{ left: `${clamp(value, 0, 1) * 100}%` }}
        />
      </div>
    </div>
  );
});
