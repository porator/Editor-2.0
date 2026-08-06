import * as React from 'react';
import type { BackgroundValue, GradientBackground, SolidBackground } from './types';
import { TooltipProvider } from './ui/tooltip';
import { SolidEditor } from './SolidEditor';
import { GradientEditor } from './GradientEditor';
import { createStopId } from './gradient';
import { valueToCss, cssToValue } from './serialize';

/* The atom-components BackgroundPicker (github.com/porator/atom-components),
 * vendored and wired to the A2HS config. Full Solid + Gradient editing, exactly
 * as in Storybook. Value is the CSS string stored in config (a solid hex or a
 * gradient CSS string), so the preview keeps applying it via `background:`. */

const defaultGradient = (): GradientBackground => ({
  type: 'gradient',
  gradientType: 'linear',
  angle: 90,
  stops: [
    { id: createStopId(), color: '#4F46E5', position: 0, opacity: 1 },
    { id: createStopId(), color: '#EC4899', position: 100, opacity: 1 },
  ],
});

export interface ColorPickerProps {
  /** CSS string: `#RRGGBB`, `rgba(...)`, or a `*-gradient(...)`. */
  value: string;
  onChange: (css: string) => void;
  /** Allow switching to the Gradient tab. Solid-only when false. */
  gradient?: boolean;
  className?: string;
}

export function ColorPicker({ value, onChange, gradient = true, className }: ColorPickerProps) {
  const [val, setVal] = React.useState<BackgroundValue>(() => cssToValue(value));
  const [saved, setSaved] = React.useState<string[]>([]);
  // Remember the last solid & gradient so toggling the tab restores each.
  const drafts = React.useRef<{ solid?: SolidBackground; gradient?: GradientBackground }>({});
  drafts.current[val.type] = val as never;

  // Resync when the external value changes to something we didn't just emit.
  React.useEffect(() => {
    if (valueToCss(val) !== value) setVal(cssToValue(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = (next: BackgroundValue) => { setVal(next); onChange(valueToCss(next)); };

  const setType = (type: 'solid' | 'gradient') => {
    if (type === val.type) return;
    emit(drafts.current[type] ?? (type === 'gradient'
      ? defaultGradient()
      : { type: 'solid', color: '#4F46E5', opacity: 1 }));
  };

  return (
    <TooltipProvider>
      {val.type === 'gradient' ? (
        <GradientEditor
          className={className}
          value={val}
          onChange={emit}
          type="gradient"
          onTypeChange={setType}
        />
      ) : (
        <SolidEditor
          className={className}
          color={val.color}
          opacity={val.opacity}
          onChange={({ color, opacity }) => emit({ type: 'solid', color, opacity })}
          type="solid"
          onTypeChange={gradient ? setType : () => {}}
          savedColors={saved}
          onSaveColor={() => setSaved((s) => (s.includes(val.color) ? s : [...s, val.color]))}
          onSelectSavedColor={(c) => emit({ type: 'solid', color: c, opacity: val.opacity })}
        />
      )}
    </TooltipProvider>
  );
}
