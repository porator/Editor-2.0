import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/cn";
import { normalizeHex } from "./color";

export interface SavedColorsProps {
  /** Saved hex colors, `#RRGGBB`. */
  colors: string[];
  /** Currently active color, used to render the selected ring. */
  selectedColor?: string;
  /** Add the current color to the palette. */
  onAdd: () => void;
  /** Apply a saved color. */
  onSelect: (color: string) => void;
  className?: string;
}

/**
 * "Saved colors" palette (Figma): a label row with a "+ Add" action, then a
 * row of 24px circular swatches led by a "+" add button. Shows an empty hint
 * when no colors are saved. No Design System equivalent — a new primitive
 * styled with DS tokens.
 */
export const SavedColors = React.memo(function SavedColors({
  colors,
  selectedColor,
  onAdd,
  onSelect,
  className,
}: SavedColorsProps) {
  const selected = selectedColor ? normalizeHex(selectedColor) : null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between text-xs font-semibold leading-none">
        <span className="text-primary">Saved colors</span>
        <button
          type="button"
          onClick={onAdd}
          className="text-[#a1a1aa] outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label="Add current color"
          onClick={onAdd}
          className="grid size-6 shrink-0 place-items-center rounded-full bg-[#fafafa] text-muted-foreground shadow-[0px_0px_0px_1px_#e4e4e7] outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Plus className="size-3.5" />
        </button>

        {colors.length === 0 ? (
          <span className="text-xs text-muted-foreground">No colors saved</span>
        ) : (
          colors.map((color, i) => {
            const isSelected = normalizeHex(color) === selected;
            return (
              <button
                key={`${color}-${i}`}
                type="button"
                aria-label={`Use color ${color}`}
                aria-pressed={isSelected}
                onClick={() => onSelect(color)}
                className={cn(
                  "size-6 shrink-0 rounded-full border border-white outline-none transition-transform",
                  "shadow-[0px_0px_0px_1px_#e4e4e7] hover:scale-105",
                  "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  isSelected &&
                    "ring-2 ring-ring ring-offset-2 ring-offset-background",
                )}
                style={{ backgroundColor: color }}
              />
            );
          })
        )}
      </div>
    </div>
  );
});
