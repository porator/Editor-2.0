import * as React from "react";

import { cn } from "@/lib/utils";
import { CANVAS_HEIGHT, STEP, STEP_LARGE } from "../styles/constants";
import { clamp, hsvToHex, isLight } from "../utils/color";
import { usePointerDrag } from "../hooks/usePointerDrag";

export interface ColorCanvasProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (saturation: number, value: number) => void;
  className?: string;
}

/**
 * Saturation/Value picking surface (no Design System equivalent — a genuinely
 * new primitive). Styled with DS tokens: rounded-md, border, focus ring.
 */
export const ColorCanvas = React.memo(function ColorCanvas({
  hue,
  saturation,
  value,
  onChange,
  className,
}: ColorCanvasProps) {
  const { onPointerDown, isDragging } = usePointerDrag(({ x, y }) => {
    onChange(x * 100, (1 - y) * 100);
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? STEP_LARGE : STEP;
    let s = saturation;
    let v = value;
    switch (e.key) {
      case "ArrowLeft":
        s -= step;
        break;
      case "ArrowRight":
        s += step;
        break;
      case "ArrowUp":
        v += step;
        break;
      case "ArrowDown":
        v -= step;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(clamp(s, 0, 100), clamp(v, 0, 100));
  };

  const thumbColor = hsvToHex({ h: hue, s: saturation, v: value });

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Saturation and brightness"
      aria-valuetext={`Saturation ${Math.round(saturation)}%, brightness ${Math.round(
        value,
      )}%`}
      onPointerDown={onPointerDown}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative w-full cursor-crosshair touch-none overflow-hidden rounded-[6px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      style={{
        height: CANVAS_HEIGHT,
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
        backgroundImage:
          "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
      }}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-transparent shadow-[0px_1.875px_5.625px_0px_rgba(0,0,0,0.1),0px_1.875px_3.75px_0px_rgba(0,0,0,0.06)]",
          isDragging && "scale-110",
          isLight(thumbColor) ? "border-black/30" : "border-white",
        )}
        style={{
          left: `${saturation}%`,
          top: `${100 - value}%`,
          transition: isDragging ? "none" : "transform 120ms ease",
        }}
      />
    </div>
  );
});
