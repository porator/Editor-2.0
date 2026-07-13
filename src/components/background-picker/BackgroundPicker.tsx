import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import type {
  BackgroundPickerProps,
  BackgroundType,
  BackgroundValue,
  GradientBackground,
  ImageBackground,
  SolidBackground,
} from "./BackgroundPicker.types";
import { createDefaultFor, createDefaultSolid } from "./styles/constants";
import { normalizeHex } from "./utils/color";
import { SolidEditor } from "./components/SolidEditor";
import { GradientEditor } from "./components/GradientEditor";
import { ImageEditor } from "./components/ImageEditor";
import "./styles/animations.css";

/**
 * BackgroundPicker
 *
 * A Framer-inspired background editor (Solid · Gradient · Image) built from the
 * Editor Tool Design System. It owns the `BackgroundValue` state and drives
 * every child editor through props — no application state.
 *
 * Controlled:   <BackgroundPicker value={bg} onChange={setBg} />
 * Uncontrolled: <BackgroundPicker defaultValue={bg} onChange={handle} />
 */
export function BackgroundPicker({
  value,
  defaultValue,
  onChange,
  onClose,
  className,
  enableEyeDropper = true,
  enableImageEffects = true,
}: BackgroundPickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<BackgroundValue>(
    () => value ?? defaultValue ?? createDefaultSolid(),
  );
  const current = isControlled ? (value as BackgroundValue) : internal;

  const setValue = React.useCallback(
    (next: BackgroundValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  // Remember the last value per type so switching modes restores it.
  const draftsRef = React.useRef<Partial<Record<BackgroundType, BackgroundValue>>>(
    {},
  );
  draftsRef.current[current.type] = current;

  const handleTypeChange = React.useCallback(
    (type: BackgroundType) => {
      if (type === current.type) return;
      setValue(draftsRef.current[type] ?? createDefaultFor(type));
    },
    [current.type, setValue],
  );

  // Saved-colors palette — held here so it persists across mode switches.
  const [savedColors, setSavedColors] = React.useState<string[]>([]);
  const handleSaveColor = React.useCallback(() => {
    if (current.type !== "solid") return;
    const hex = normalizeHex(current.color);
    if (!hex) return;
    setSavedColors((prev) => (prev.includes(hex) ? prev : [...prev, hex]));
  }, [current]);

  const handleSelectSavedColor = React.useCallback(
    (color: string) => {
      const opacity = current.type === "solid" ? current.opacity : 1;
      setValue({ type: "solid", color, opacity } satisfies SolidBackground);
    },
    [current, setValue],
  );

  return (
    <TooltipProvider delayDuration={300}>
      <section
        aria-label="Background picker"
        className={cn(
          "flex w-full flex-col gap-4 rounded-[20px] bg-popover px-4 pb-[26px] pt-4 text-popover-foreground",
          "shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.06)]",
          className,
        )}
      >
        <div className="flex h-[17px] items-center justify-between">
          <span className="text-xs font-semibold leading-none text-foreground">
            Color
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 grid size-6 place-items-center rounded-md text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <X className="size-4" />
          </button>
        </div>

        <div key={current.type} className="bgpicker-fade">
          {current.type === "solid" && (
            <SolidEditor
              color={current.color}
              opacity={current.opacity}
              enableEyeDropper={enableEyeDropper}
              type={current.type}
              onTypeChange={handleTypeChange}
              savedColors={savedColors}
              onSaveColor={handleSaveColor}
              onSelectSavedColor={handleSelectSavedColor}
              onChange={({ color, opacity }) =>
                setValue({ type: "solid", color, opacity } satisfies SolidBackground)
              }
            />
          )}

          {current.type === "gradient" && (
            <GradientEditor
              value={current}
              type={current.type}
              onTypeChange={handleTypeChange}
              onChange={(next: GradientBackground) => setValue(next)}
            />
          )}

          {current.type === "image" && (
            <ImageEditor
              value={current}
              enableEffects={enableImageEffects}
              onChange={(next: ImageBackground) => setValue(next)}
            />
          )}
        </div>
      </section>
    </TooltipProvider>
  );
}

BackgroundPicker.displayName = "BackgroundPicker";
