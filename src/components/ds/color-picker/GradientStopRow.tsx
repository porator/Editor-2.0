import * as React from "react";
import { Minus } from "lucide-react";

import { cn } from "@/lib/cn";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { GradientStop } from "./types";
import { clamp, normalizeHex, toRgbaString } from "./color";

export interface GradientStopRowProps {
  stop: GradientStop;
  selected: boolean;
  canRemove: boolean;
  onSelect: (id: string) => void;
  onChange: (patch: Partial<Omit<GradientStop, "id">>) => void;
  onRemove: (id: string) => void;
}

const fieldClass =
  "h-9 rounded-lg border-input bg-muted text-sm leading-5 text-muted-foreground shadow-xs overflow-hidden text-ellipsis";

/**
 * One editable gradient stop (Figma "Stops" row): a color-dot HEX field, a
 * "%" opacity field and a remove button. Uses the existing gradient logic —
 * only the layout is new. Fields are buffered to avoid reformatting mid-edit.
 */
export const GradientStopRow = React.memo(function GradientStopRow({
  stop,
  selected,
  canRemove,
  onSelect,
  onChange,
  onRemove,
}: GradientStopRowProps) {
  const hex = normalizeHex(stop.color) ?? "#000000";

  const [hexDraft, setHexDraft] = React.useState(hex);
  const [hexFocused, setHexFocused] = React.useState(false);
  React.useEffect(() => {
    if (!hexFocused) setHexDraft(hex);
  }, [hex, hexFocused]);

  const [opacityDraft, setOpacityDraft] = React.useState(() =>
    String(Math.round(stop.opacity * 100)),
  );
  const [opacityFocused, setOpacityFocused] = React.useState(false);
  React.useEffect(() => {
    if (!opacityFocused) setOpacityDraft(String(Math.round(stop.opacity * 100)));
  }, [stop.opacity, opacityFocused]);

  return (
    <div
      className="flex items-center gap-2"
      onPointerDown={() => onSelect(stop.id)}
      onFocusCapture={() => onSelect(stop.id)}
    >
      <div className="relative flex-1">
        <span
          aria-hidden
          className={cn(
            "absolute left-3 top-1/2 size-4 -translate-y-1/2 rounded-full border border-white shadow-[0px_0px_0px_1px_#e4e4e7]",
            selected && "ring-2 ring-ring ring-offset-1 ring-offset-muted",
          )}
          style={{ backgroundColor: toRgbaString(stop.color, stop.opacity) }}
        />
        <Input
          aria-label="Stop hex color"
          value={hexDraft}
          spellCheck={false}
          autoComplete="off"
          className={cn(fieldClass, "pl-9 uppercase")}
          onChange={(e) => {
            setHexDraft(e.target.value);
            const parsed = normalizeHex(e.target.value);
            if (parsed) onChange({ color: parsed });
          }}
          onFocus={() => setHexFocused(true)}
          onBlur={() => {
            setHexFocused(false);
            setHexDraft(hex);
          }}
        />
      </div>

      <div className="relative w-[70px] shrink-0">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        >
          %
        </span>
        <Input
          aria-label="Stop opacity percentage"
          inputMode="numeric"
          value={opacityDraft}
          className={cn(fieldClass, "pl-7")}
          onChange={(e) => {
            setOpacityDraft(e.target.value);
            const n = Number(e.target.value.replace(/[^0-9.]/g, ""));
            if (Number.isFinite(n)) onChange({ opacity: clamp(n, 0, 100) / 100 });
          }}
          onFocus={() => setOpacityFocused(true)}
          onBlur={() => {
            setOpacityFocused(false);
            setOpacityDraft(String(Math.round(stop.opacity * 100)));
          }}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Remove stop"
        disabled={!canRemove}
        onClick={() => onRemove(stop.id)}
        className="shrink-0 text-muted-foreground"
      >
        <Minus className="size-[18px]" />
      </Button>
    </div>
  );
});
