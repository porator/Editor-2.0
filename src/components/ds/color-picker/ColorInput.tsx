import * as React from "react";
import { Pipette } from "lucide-react";

import { cn } from "@/lib/cn";
import { Input } from "./ui/input";
import { clamp, normalizeHex } from "./color";

/** Minimal typing for the experimental EyeDropper API. */
interface EyeDropperCtor {
  new (): { open: () => Promise<{ sRGBHex: string }> };
}
declare global {
  interface Window {
    EyeDropper?: EyeDropperCtor;
  }
}

export interface ColorInputProps {
  color: string;
  opacity: number;
  onChange: (next: { color: string; opacity: number }) => void;
  /** Show the eyedropper affordance inside the HEX field where supported. */
  enableEyeDropper?: boolean;
  className?: string;
}

/**
 * HEX field (with an inline eyedropper icon) + opacity field, matching the
 * Figma layout: fixed 144px HEX input and a flexible opacity input showing a
 * leading "%". Built from the Design System Input (filled/muted variant).
 * Fields are buffered so an intermediate, invalid value isn't reformatted
 * mid-edit.
 */
export const ColorInput = React.memo(function ColorInput({
  color,
  opacity,
  onChange,
  enableEyeDropper = true,
  className,
}: ColorInputProps) {
  const hex = normalizeHex(color) ?? "#000000";

  const [draft, setDraft] = React.useState(hex);
  const [focused, setFocused] = React.useState(false);
  React.useEffect(() => {
    if (!focused) setDraft(hex);
  }, [hex, focused]);

  const commitHex = (raw: string) => {
    const parsed = normalizeHex(raw);
    if (parsed) onChange({ color: parsed, opacity });
  };

  const [opacityDraft, setOpacityDraft] = React.useState(() =>
    String(Math.round(opacity * 100)),
  );
  const [opacityFocused, setOpacityFocused] = React.useState(false);
  React.useEffect(() => {
    if (!opacityFocused) setOpacityDraft(String(Math.round(opacity * 100)));
  }, [opacity, opacityFocused]);

  const commitOpacity = (raw: string) => {
    const n = Number(raw.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(n)) onChange({ color, opacity: clamp(n, 0, 100) / 100 });
  };

  const supportsEyeDropper =
    enableEyeDropper &&
    typeof window !== "undefined" &&
    typeof window.EyeDropper === "function";

  const pickWithEyeDropper = async () => {
    if (!window.EyeDropper) return;
    try {
      const { sRGBHex } = await new window.EyeDropper().open();
      const picked = normalizeHex(sRGBHex);
      if (picked) onChange({ color: picked, opacity });
    } catch {
      /* cancelled — no-op */
    }
  };

  const fieldClass =
    "h-9 rounded-lg border-input bg-muted text-sm leading-5 text-muted-foreground shadow-xs overflow-hidden text-ellipsis";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative w-[144px] shrink-0">
        {supportsEyeDropper ? (
          <button
            type="button"
            aria-label="Pick a color from the screen"
            onClick={pickWithEyeDropper}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
          >
            <Pipette className="size-4" />
          </button>
        ) : (
          <Pipette
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        )}
        <Input
          aria-label="Hex color"
          value={draft}
          spellCheck={false}
          autoComplete="off"
          className={cn(fieldClass, "pl-9 uppercase")}
          onChange={(e) => {
            setDraft(e.target.value);
            commitHex(e.target.value);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setDraft(hex);
          }}
        />
      </div>

      <div className="relative flex-1">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        >
          %
        </span>
        <Input
          aria-label="Opacity percentage"
          inputMode="numeric"
          value={opacityDraft}
          className={cn(fieldClass, "pl-7")}
          onChange={(e) => {
            setOpacityDraft(e.target.value);
            commitOpacity(e.target.value);
          }}
          onFocus={() => setOpacityFocused(true)}
          onBlur={() => {
            setOpacityFocused(false);
            setOpacityDraft(String(Math.round(opacity * 100)));
          }}
        />
      </div>
    </div>
  );
});
