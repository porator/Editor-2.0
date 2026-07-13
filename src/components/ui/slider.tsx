import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Single-value slider (array to mirror the Radix API used across the app). */
  value?: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number[]) => void;
  "aria-label"?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/**
 * Self-contained single-thumb slider (no external dependency) mirroring the
 * Design System slider: muted track, primary range, 16px thumb with focus ring.
 * API matches the shadcn/Radix slider subset used in this codebase.
 */
const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      onValueChange,
      ...props
    },
    _ref,
  ) => {
    const current = value?.[0] ?? min;
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = React.useState(false);

    const pct = ((current - min) / (max - min || 1)) * 100;

    const setFromClientX = React.useCallback(
      (clientX: number) => {
        const el = trackRef.current;
        if (!el || disabled) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return;
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        const raw = min + ratio * (max - min);
        const snapped = Math.round(raw / step) * step;
        onValueChange?.([clamp(Number(snapped.toFixed(5)), min, max)]);
      },
      [disabled, min, max, step, onValueChange],
    );

    React.useEffect(() => {
      if (!dragging) return;
      const move = (e: PointerEvent) => {
        e.preventDefault();
        setFromClientX(e.clientX);
      };
      const up = () => setDragging(false);
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      };
    }, [dragging, setFromClientX]);

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      let next = current;
      const big = e.shiftKey ? step * 10 : step;
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          next -= big;
          break;
        case "ArrowRight":
        case "ArrowUp":
          next += big;
          break;
        case "Home":
          next = min;
          break;
        case "End":
          next = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      onValueChange?.([clamp(Number(next.toFixed(5)), min, max)]);
    };

    return (
      <div
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        <div
          ref={trackRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-label={props["aria-label"]}
          aria-disabled={disabled || undefined}
          onPointerDown={(e) => {
            if (disabled || e.button !== 0) return;
            e.currentTarget.focus();
            setDragging(true);
            setFromClientX(e.nativeEvent.clientX);
          }}
          onKeyDown={onKeyDown}
          className="relative h-1.5 w-full grow cursor-pointer rounded-full bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary bg-surface shadow-sm"
            style={{ left: `${pct}%` }}
          />
        </div>
      </div>
    );
  },
);
Slider.displayName = "Slider";

export { Slider };
