/**
 * Color math and parsing utilities.
 *
 * Conventions:
 *  - `RGB`  channels are 0–255
 *  - `HSV`  hue 0–360, saturation/value 0–100
 *  - `HSL`  hue 0–360, saturation/lightness 0–100
 *  - hex strings are `#RRGGBB` (uppercase, no alpha)
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}
export interface HSV {
  h: number;
  s: number;
  v: number;
}
export interface HSL {
  h: number;
  s: number;
  l: number;
}

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n));

export const round = (n: number, precision = 0): number => {
  const p = 10 ** precision;
  return Math.round(n * p) / p;
};

/** Normalize loose hex input (`fff`, `#FFF`, `ffffff`) to `#RRGGBB`, or null. */
export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const [r, g, b] = raw.split("");
    return `#${(r + r + g + g + b + b).toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toUpperCase()}`;
  return null;
}

export function hexToRgb(hex: string): RGB | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const int = parseInt(normalized.slice(1), 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h: round(h), s: round(s * 100), v: round(max * 100) };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const sn = s / 100;
  const vn = v / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

export const hexToHsv = (hex: string): HSV | null => {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsv(rgb) : null;
};

export const hsvToHex = (hsv: HSV): string => rgbToHex(hsvToRgb(hsv));

/** Convert 0–1 opacity to a two-digit hex alpha suffix. */
export const opacityToHexAlpha = (opacity: number): string =>
  clamp(Math.round(opacity * 255), 0, 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

/** `#RRGGBBAA` string for CSS use. */
export const toHex8 = (hex: string, opacity: number): string => {
  const base = normalizeHex(hex) ?? "#000000";
  return `${base}${opacityToHexAlpha(opacity)}`;
};

/** `rgba(r, g, b, a)` string for CSS use. */
export function toRgbaString(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${round(clamp(opacity, 0, 1), 2)})`;
}

export type ColorFormat = "hex" | "rgb" | "hsl";

/** Format a color for display in a given text format (excludes alpha). */
export function formatColor(hex: string, format: ColorFormat): string {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  switch (format) {
    case "rgb":
      return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    case "hsl": {
      const { h, s, l } = rgbToHsl(rgb);
      return `${h}, ${s}%, ${l}%`;
    }
    case "hex":
    default:
      return (normalizeHex(hex) ?? "#000000").replace(/^#/, "");
  }
}

/** Parse a display string in the given format back into a hex color, or null. */
export function parseColor(input: string, format: ColorFormat): string | null {
  const value = input.trim();
  if (format === "hex") return normalizeHex(value);

  const nums = value.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (format === "rgb") {
    if (nums.length < 3) return null;
    const [r, g, b] = nums;
    return rgbToHex({
      r: clamp(r, 0, 255),
      g: clamp(g, 0, 255),
      b: clamp(b, 0, 255),
    });
  }
  // hsl
  if (nums.length < 3) return null;
  const [h, s, l] = nums;
  return rgbToHex(
    hslToRgb({
      h: clamp(h, 0, 360),
      s: clamp(s, 0, 100),
      l: clamp(l, 0, 100),
    }),
  );
}

/** Relative luminance (0–1) for choosing readable overlays/handles. */
export function luminance(hex: string): number {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const chan = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(rgb.r) + 0.7152 * chan(rgb.g) + 0.0722 * chan(rgb.b);
}

/** True when a color is light enough to need a dark outline/foreground. */
export const isLight = (hex: string): boolean => luminance(hex) > 0.6;
