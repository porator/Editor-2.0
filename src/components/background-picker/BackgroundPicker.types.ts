/**
 * Public data model for the BackgroundPicker.
 *
 * Everything the component renders is derived from a single `BackgroundValue`.
 * The component is fully controlled/uncontrolled around this model and never
 * depends on application state.
 */

export type BackgroundType = "solid" | "gradient" | "image";

/** A solid fill: a hex color plus a 0–1 opacity. */
export interface SolidBackground {
  type: "solid";
  /** Hex color, `#RRGGBB`. */
  color: string;
  /** 0–1. */
  opacity: number;
}

/** A single gradient color stop. */
export interface GradientStop {
  /** Stable id, used for React keys and selection. */
  id: string;
  /** Hex color, `#RRGGBB`. */
  color: string;
  /** Position along the gradient axis, 0–100 (%). */
  position: number;
  /** Per-stop opacity, 0–1. */
  opacity: number;
}

export type GradientType = "linear" | "radial";

/** A linear or radial gradient built from two or more stops. */
export interface GradientBackground {
  type: "gradient";
  gradientType: GradientType;
  /** Angle in degrees (0–360); only meaningful for `linear`. */
  angle: number;
  stops: GradientStop[];
}

export type ImageFit = "cover" | "contain";

/** An image fill. `image` is either a `File` (freshly uploaded) or a URL/data string. */
export interface ImageBackground {
  type: "image";
  image: File | string | null;
  fit: ImageFit;
  /** CSS `background-position` keyword, e.g. `"center"`, `"top left"`. */
  position: string;
  /** 0–1. */
  opacity: number;
  /** Optional blur in px. */
  blur?: number;
  /** Optional scale in %, 100 = natural. */
  scale?: number;
}

export type BackgroundValue =
  | SolidBackground
  | GradientBackground
  | ImageBackground;

export interface BackgroundPickerProps {
  /** Controlled value. */
  value?: BackgroundValue;
  /** Initial value when used uncontrolled. */
  defaultValue?: BackgroundValue;
  /** Fires on every live edit (there is no Apply step). */
  onChange?: (value: BackgroundValue) => void;
  /** Optional handler for the header close (✕) button. */
  onClose?: () => void;
  /** Extra classes for the outer container (e.g. width). */
  className?: string;
  /** Show the eyedropper button where the browser supports it. Defaults to true. */
  enableEyeDropper?: boolean;
  /** Enable the optional Blur + Scale controls in the image editor. Defaults to true. */
  enableImageEffects?: boolean;
}
