import * as React from "react";

import { toRgbaString } from "../utils/color";
import { LinearTrack } from "./LinearTrack";

export interface AlphaSliderProps {
  /** Base color the alpha applies to, `#RRGGBB`. */
  color: string;
  /** Opacity, 0–1. */
  opacity: number;
  onChange: (opacity: number) => void;
  className?: string;
}

/** Opacity track (0–1) over a checkerboard. Reuses the shared LinearTrack. */
export const AlphaSlider = React.memo(function AlphaSlider({
  color,
  opacity,
  onChange,
  className,
}: AlphaSliderProps) {
  const trackStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${toRgbaString(
      color,
      0,
    )}, ${toRgbaString(color, 1)})`,
  };

  return (
    <LinearTrack
      className={className}
      value={opacity}
      onChange={onChange}
      trackStyle={trackStyle}
      checkerboard
      ariaLabel="Opacity"
      ariaValueText={`${Math.round(opacity * 100)}%`}
    />
  );
});
