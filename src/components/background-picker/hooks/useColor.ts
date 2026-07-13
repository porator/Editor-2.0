import * as React from "react";

import {
  type HSV,
  clamp,
  hexToHsv,
  hsvToHex,
  normalizeHex,
} from "../utils/color";

export interface UseColorArgs {
  /** Controlled hex color, `#RRGGBB`. */
  color: string;
  /** Controlled opacity, 0–1. */
  opacity: number;
  /** Emitted on every live edit. */
  onChange: (next: { color: string; opacity: number }) => void;
}

export interface UseColorResult {
  hsv: HSV;
  hex: string;
  opacity: number;
  setHue: (h: number) => void;
  setSaturationValue: (s: number, v: number) => void;
  setHex: (hex: string) => void;
  setOpacity: (opacity: number) => void;
}

const FALLBACK: HSV = { h: 0, s: 0, v: 0 };

/**
 * Bridges a controlled `{ color, opacity }` pair with an internal HSV working
 * state. Keeping HSV internally avoids hue/saturation "jumps" that a naive
 * hex→hsv→hex round-trip would cause at grayscale or black (where hue is
 * mathematically undefined). This same hook powers the SolidEditor whether it
 * edits the solid background or an individual gradient stop.
 */
export function useColor({
  color,
  opacity,
  onChange,
}: UseColorArgs): UseColorResult {
  const externalHex = normalizeHex(color) ?? "#000000";
  const [hsv, setHsv] = React.useState<HSV>(() => hexToHsv(externalHex) ?? FALLBACK);
  const hsvRef = React.useRef(hsv);
  hsvRef.current = hsv;

  // Resync internal HSV only when the external color no longer matches what our
  // working HSV represents (i.e. an outside change, not our own emission).
  React.useEffect(() => {
    if (hsvToHex(hsvRef.current) === externalHex) return;
    const next = hexToHsv(externalHex) ?? FALLBACK;
    // Preserve hue when the incoming color is achromatic to keep the UI steady.
    if (next.s === 0) next.h = hsvRef.current.h;
    setHsv(next);
  }, [externalHex]);

  const emit = React.useCallback(
    (nextHsv: HSV, nextOpacity: number) => {
      setHsv(nextHsv);
      onChange({ color: hsvToHex(nextHsv), opacity: clamp(nextOpacity, 0, 1) });
    },
    [onChange],
  );

  const setHue = React.useCallback(
    (h: number) => emit({ ...hsvRef.current, h: clamp(h, 0, 360) }, opacity),
    [emit, opacity],
  );

  const setSaturationValue = React.useCallback(
    (s: number, v: number) =>
      emit(
        { ...hsvRef.current, s: clamp(s, 0, 100), v: clamp(v, 0, 100) },
        opacity,
      ),
    [emit, opacity],
  );

  const setHex = React.useCallback(
    (hex: string) => {
      const normalized = normalizeHex(hex);
      if (!normalized) return;
      const next = hexToHsv(normalized) ?? FALLBACK;
      if (next.s === 0) next.h = hsvRef.current.h;
      emit(next, opacity);
    },
    [emit, opacity],
  );

  const setOpacity = React.useCallback(
    (nextOpacity: number) => emit(hsvRef.current, nextOpacity),
    [emit],
  );

  return {
    hsv,
    hex: externalHex,
    opacity,
    setHue,
    setSaturationValue,
    setHex,
    setOpacity,
  };
}
