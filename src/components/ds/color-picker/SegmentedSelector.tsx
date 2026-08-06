import * as React from "react";

import { cn } from "@/lib/cn";
import type { BackgroundType } from "./types";

export interface SegmentedSelectorProps {
  /** Active fill type. Only "solid" and "gradient" are represented. */
  value: BackgroundType;
  onChange: (value: "solid" | "gradient") => void;
  className?: string;
}

const SWATCH_BASE =
  "size-4 rounded-full border-[0.667px] border-white shadow-[0px_0px_0px_0.667px_#e4e4e7]";

/**
 * Solid ⟷ Gradient selector rendered as two circular swatches inside a muted
 * pill, matching the Figma "Tabs type". The active option sits on an elevated
 * white segment; its swatch uses the indigo accent, the inactive one is muted.
 */
export const SegmentedSelector = React.memo(function SegmentedSelector({
  value,
  onChange,
  className,
}: SegmentedSelectorProps) {
  const options: { type: "solid" | "gradient"; label: string }[] = [
    { type: "solid", label: "Solid" },
    { type: "gradient", label: "Gradient" },
  ];

  return (
    <div
      role="group"
      aria-label="Fill type"
      className={cn(
        "inline-flex w-16 shrink-0 items-center rounded-xl bg-muted p-1",
        className,
      )}
    >
      {options.map(({ type, label }) => {
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            onClick={() => onChange(type)}
            className={cn(
              "flex items-center justify-center rounded-lg px-1.5 py-1.5 outline-none transition-shadow",
              "drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected && "bg-background shadow-xs",
            )}
          >
            {type === "solid" ? (
              <span
                aria-hidden
                className={SWATCH_BASE}
                style={{ backgroundColor: selected ? "#818cf8" : "#a3a3a3" }}
              />
            ) : (
              <span
                aria-hidden
                className={SWATCH_BASE}
                style={{
                  backgroundImage: `linear-gradient(to bottom, #f4f4f5, ${
                    selected ? "#818cf8" : "#777777"
                  })`,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});
