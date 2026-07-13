import * as React from "react";
import { ArrowRightLeft, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  BackgroundType,
  GradientBackground,
} from "../BackgroundPicker.types";
import { sortStops, swapStopColors } from "../utils/gradient";
import { useGradient } from "../hooks/useGradient";
import { useColor } from "../hooks/useColor";
import { SegmentedSelector } from "./SegmentedSelector";
import { ColorCanvas } from "./ColorCanvas";
import { HueSlider } from "./HueSlider";
import { AlphaSlider } from "./AlphaSlider";
import { GradientStops } from "./GradientStops";
import { GradientStopRow } from "./GradientStopRow";

export interface GradientEditorProps {
  value: GradientBackground;
  onChange: (next: GradientBackground) => void;
  className?: string;
  /** Active fill type, for the Solid/Gradient selector. */
  type: BackgroundType;
  onTypeChange: (type: "solid" | "gradient") => void;
  enableEyeDropper?: boolean;
}

/** Small muted action button matching the Figma toolbar triggers. */
function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          onClick={onClick}
          className="text-muted-foreground"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Gradient editor — Solid/Gradient selector with swap + rotate actions, a
 * saturation/value canvas + hue/opacity sliders that edit the currently
 * selected stop (exactly like the Solid editor), an interactive stop track,
 * and the editable Stops list. Reuses the existing color + gradient hooks.
 */
export const GradientEditor = React.memo(function GradientEditor({
  value,
  onChange,
  className,
  type,
  onTypeChange,
}: GradientEditorProps) {
  const {
    stops,
    selectedId,
    selectedStop,
    selectStop,
    addStop,
    removeStop,
    updateStop,
    setAngle,
  } = useGradient(value, onChange);

  // The canvas / hue / alpha edit whichever stop is selected — same controls
  // and logic as the Solid editor, so color-editing is never duplicated.
  const { hsv, hex, opacity, setHue, setSaturationValue, setOpacity } = useColor({
    color: selectedStop?.color ?? "#000000",
    opacity: selectedStop?.opacity ?? 1,
    onChange: ({ color, opacity: nextOpacity }) => {
      if (selectedStop) updateStop(selectedStop.id, { color, opacity: nextOpacity });
    },
  });

  const applyStops = (next: GradientBackground["stops"]) =>
    onChange({ ...value, stops: next });

  /** Add a stop midway between the selected stop and its next neighbour. */
  const handleAdd = () => {
    const sorted = sortStops(stops);
    const index = sorted.findIndex((s) => s.id === selectedId);
    let position = 50;
    if (index >= 0) {
      const current = sorted[index];
      const next = sorted[index + 1];
      position = next
        ? (current.position + next.position) / 2
        : (current.position + 100) / 2;
    }
    addStop(position);
  };

  const canRemove = stops.length > 2;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <SegmentedSelector value={type} onChange={onTypeChange} />
          <div className="flex items-center gap-1">
            <ActionButton label="Swap colors" onClick={() => applyStops(swapStopColors(stops))}>
              <ArrowRightLeft className="size-4" />
            </ActionButton>
            <ActionButton label="Rotate gradient" onClick={() => setAngle(value.angle + 45)}>
              <RotateCw className="size-4" />
            </ActionButton>
          </div>
        </div>

        <ColorCanvas
          hue={hsv.h}
          saturation={hsv.s}
          value={hsv.v}
          onChange={setSaturationValue}
        />
        <HueSlider hue={hsv.h} onChange={setHue} />
        <AlphaSlider color={hex} opacity={opacity} onChange={setOpacity} />

        <GradientStops
          stops={stops}
          selectedId={selectedId}
          onSelect={selectStop}
          onRemove={removeStop}
          onMove={(id, position) => updateStop(id, { position })}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs font-semibold leading-none">
          <span className="text-foreground">Stops</span>
          <button
            type="button"
            onClick={handleAdd}
            className="text-[#a1a1aa] outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            + Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {sortStops(stops).map((stop) => (
            <GradientStopRow
              key={stop.id}
              stop={stop}
              selected={stop.id === selectedId}
              canRemove={canRemove}
              onSelect={selectStop}
              onChange={(patch) => updateStop(stop.id, patch)}
              onRemove={removeStop}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
