import * as React from "react";

import { STEP, STEP_LARGE } from "../styles/constants";
import { LinearTrack } from "./LinearTrack";

export interface HueSliderProps {
  /** Hue in degrees, 0–360. */
  hue: number;
  onChange: (hue: number) => void;
  className?: string;
}

const HUE_TRACK: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
};

/** Hue selection track (0–360°). Reuses the shared LinearTrack. */
export const HueSlider = React.memo(function HueSlider({
  hue,
  onChange,
  className,
}: HueSliderProps) {
  return (
    <LinearTrack
      className={className}
      value={hue / 360}
      onChange={(v) => onChange(Math.round(v * 360))}
      trackStyle={HUE_TRACK}
      ariaLabel="Hue"
      ariaValueText={`${Math.round(hue)}°`}
      step={STEP / 360}
      largeStep={STEP_LARGE / 360}
    />
  );
});
