/**
 * Shared constants and factory defaults for the BackgroundPicker.
 * Sizes follow the Design System's spacing/height scale.
 */

import type {
  BackgroundType,
  GradientBackground,
  ImageBackground,
  SolidBackground,
} from "../BackgroundPicker.types";
import { createStopId } from "../utils/gradient";
import type { CssPosition } from "../utils/image";

/** Height of the saturation/value canvas (px) — Figma "Colorspace". */
export const CANVAS_HEIGHT = 97;

/** Height of the hue / alpha / gradient tracks (px) — Figma track height. */
export const TRACK_HEIGHT = 16;

/** Diameter of the custom slider thumbs / stop handles (px) — Figma ellipse. */
export const THUMB_SIZE = 15;

/** Diameter of a saved-color / swatch circle (px). */
export const SWATCH_SIZE = 24;

/** Default keyboard step for sliders and numeric inputs. */
export const STEP = 1;
export const STEP_LARGE = 10;

export const GRADIENT_TYPE_OPTIONS: {
  value: GradientBackground["gradientType"];
  label: string;
}[] = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
];

export const FIT_OPTIONS: { value: ImageBackground["fit"]; label: string }[] = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
];

export const POSITION_OPTIONS: { value: CssPosition; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "top left", label: "Top left" },
  { value: "top right", label: "Top right" },
  { value: "bottom left", label: "Bottom left" },
  { value: "bottom right", label: "Bottom right" },
];

export const createDefaultSolid = (): SolidBackground => ({
  type: "solid",
  color: "#4F46E5",
  opacity: 1,
});

export const createDefaultGradient = (): GradientBackground => ({
  type: "gradient",
  gradientType: "linear",
  angle: 90,
  stops: [
    { id: createStopId(), color: "#4F46E5", position: 0, opacity: 1 },
    { id: createStopId(), color: "#EC4899", position: 100, opacity: 1 },
  ],
});

export const createDefaultImage = (): ImageBackground => ({
  type: "image",
  image: null,
  fit: "cover",
  position: "center",
  opacity: 1,
  blur: 0,
  scale: 100,
});

export const createDefaultFor = (type: BackgroundType) => {
  switch (type) {
    case "solid":
      return createDefaultSolid();
    case "gradient":
      return createDefaultGradient();
    case "image":
      return createDefaultImage();
  }
};
