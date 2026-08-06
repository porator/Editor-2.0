/* Types vendored from atom-components' BackgroundPicker, trimmed to the
 * solid + gradient models used by the color picker. */

export type BackgroundType = "solid" | "gradient" | "image";
export type GradientType = "linear" | "radial";

export interface SolidBackground {
  type: "solid";
  color: string; // #RRGGBB
  opacity: number; // 0–1
}

export interface GradientStop {
  id: string;
  color: string; // #RRGGBB
  position: number; // 0–100
  opacity: number; // 0–1
}

export interface GradientBackground {
  type: "gradient";
  gradientType: GradientType;
  angle: number; // 0–360
  stops: GradientStop[];
}

export type BackgroundValue = SolidBackground | GradientBackground;
