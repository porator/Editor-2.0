import * as React from "react";

import { cn } from "@/lib/cn";
import type { BackgroundType } from "./types";
import { useColor } from "./useColor";
import { SegmentedSelector } from "./SegmentedSelector";
import { ColorCanvas } from "./ColorCanvas";
import { HueSlider } from "./HueSlider";
import { AlphaSlider } from "./AlphaSlider";
import { ColorInput } from "./ColorInput";
import { SavedColors } from "./SavedColors";

export interface SolidEditorProps {
  /** Hex color, `#RRGGBB`. */
  color: string;
  /** Opacity, 0–1. */
  opacity: number;
  onChange: (next: { color: string; opacity: number }) => void;
  enableEyeDropper?: boolean;
  className?: string;
  /** Active fill type, for the Solid/Gradient selector. */
  type: BackgroundType;
  onTypeChange: (type: "solid" | "gradient") => void;
  /** Saved-colors palette (owned by BackgroundPicker so it persists). */
  savedColors: string[];
  onSaveColor: () => void;
  onSelectSavedColor: (color: string) => void;
}

/**
 * Solid color editor — matches the Figma "Color" tab: Solid/Gradient selector,
 * saturation/value canvas, hue + opacity tracks, HEX + opacity inputs, and the
 * Saved colors palette. Reuses the existing color hook/utilities; only the
 * presentation changed.
 */
export const SolidEditor = React.memo(function SolidEditor({
  color,
  opacity,
  onChange,
  enableEyeDropper = true,
  className,
  type,
  onTypeChange,
  savedColors,
  onSaveColor,
  onSelectSavedColor,
}: SolidEditorProps) {
  const { hsv, hex, setHue, setSaturationValue, setOpacity } = useColor({
    color,
    opacity,
    onChange,
  });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2.5">
        <SegmentedSelector value={type} onChange={onTypeChange} />
        <ColorCanvas
          hue={hsv.h}
          saturation={hsv.s}
          value={hsv.v}
          onChange={setSaturationValue}
        />
        <HueSlider hue={hsv.h} onChange={setHue} />
        <AlphaSlider color={hex} opacity={opacity} onChange={setOpacity} />
        <ColorInput
          color={hex}
          opacity={opacity}
          enableEyeDropper={enableEyeDropper}
          onChange={onChange}
        />
      </div>

      <SavedColors
        colors={savedColors}
        selectedColor={hex}
        onAdd={onSaveColor}
        onSelect={onSelectSavedColor}
      />
    </div>
  );
});
