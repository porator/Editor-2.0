/** Pure helpers for building and mutating gradient values. */

import type { GradientBackground, GradientStop } from "./types";
import { clamp, hexToRgb, round, toRgbaString } from "./color";

let stopCounter = 0;
/** Generate a stable, collision-free stop id without relying on Date/Math.random. */
export const createStopId = (): string => `stop-${(stopCounter += 1)}`;

/** Return stops sorted by position (ascending), without mutating the input. */
export const sortStops = (stops: GradientStop[]): GradientStop[] =>
  [...stops].sort((a, b) => a.position - b.position);

/** CSS color-stop list, e.g. `rgba(0,0,0,1) 0%, rgba(255,255,255,1) 100%`. */
export function stopsToCss(stops: GradientStop[]): string {
  return sortStops(stops)
    .map((s) => `${toRgbaString(s.color, s.opacity)} ${round(s.position, 1)}%`)
    .join(", ");
}

/** Full CSS gradient function for a gradient background. */
export function toGradientCss(
  gradient: Pick<GradientBackground, "gradientType" | "angle" | "stops">,
): string {
  const stops = stopsToCss(gradient.stops);
  if (gradient.gradientType === "radial") {
    return `radial-gradient(circle at center, ${stops})`;
  }
  return `linear-gradient(${round(gradient.angle)}deg, ${stops})`;
}

/** A horizontal preview of the stops (used by the stop track), always left→right. */
export const toStopTrackCss = (stops: GradientStop[]): string =>
  `linear-gradient(90deg, ${stopsToCss(stops)})`;

/** Linearly interpolate the color/opacity between the two stops around `position`. */
export function sampleStopAt(
  stops: GradientStop[],
  position: number,
): { color: string; opacity: number } {
  const sorted = sortStops(stops);
  if (sorted.length === 0) return { color: "#FFFFFF", opacity: 1 };
  if (position <= sorted[0].position)
    return { color: sorted[0].color, opacity: sorted[0].opacity };
  const last = sorted[sorted.length - 1];
  if (position >= last.position)
    return { color: last.color, opacity: last.opacity };

  let left = sorted[0];
  let right = last;
  for (let i = 0; i < sorted.length - 1; i += 1) {
    if (sorted[i].position <= position && sorted[i + 1].position >= position) {
      left = sorted[i];
      right = sorted[i + 1];
      break;
    }
  }
  const span = right.position - left.position || 1;
  const t = (position - left.position) / span;
  const lc = hexToRgb(left.color) ?? { r: 0, g: 0, b: 0 };
  const rc = hexToRgb(right.color) ?? { r: 0, g: 0, b: 0 };
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return {
    color:
      `#${toHex(mix(lc.r, rc.r))}${toHex(mix(lc.g, rc.g))}${toHex(
        mix(lc.b, rc.b),
      )}`.toUpperCase(),
    opacity: round(left.opacity + (right.opacity - left.opacity) * t, 2),
  };
}

/** Insert a new stop at `position`, colored by sampling the current gradient. */
export function addStopAt(
  stops: GradientStop[],
  position: number,
  id: string = createStopId(),
): { stops: GradientStop[]; id: string } {
  const clamped = clamp(position, 0, 100);
  const sampled = sampleStopAt(stops, clamped);
  const next: GradientStop = { id, position: clamped, ...sampled };
  return { stops: sortStops([...stops, next]), id };
}

/** Remove a stop by id. A gradient must keep at least two stops. */
export function removeStop(
  stops: GradientStop[],
  id: string,
): GradientStop[] {
  if (stops.length <= 2) return stops;
  return stops.filter((s) => s.id !== id);
}

/** Immutably patch one stop by id. */
export function updateStop(
  stops: GradientStop[],
  id: string,
  patch: Partial<Omit<GradientStop, "id">>,
): GradientStop[] {
  return stops.map((s) => (s.id === id ? { ...s, ...patch } : s));
}

/** Reverse the gradient direction: mirror every stop position (p → 100 - p). */
export function reverseStops(stops: GradientStop[]): GradientStop[] {
  return sortStops(stops.map((s) => ({ ...s, position: 100 - s.position })));
}

/**
 * Swap the colors/opacities across stops while keeping their positions —
 * i.e. reflect the color ramp. For a two-stop gradient this swaps the two
 * colors; for N stops it reverses the color assignment order.
 */
export function swapStopColors(stops: GradientStop[]): GradientStop[] {
  const sorted = sortStops(stops);
  const swatches = sorted.map((s) => ({ color: s.color, opacity: s.opacity }));
  return sorted.map((s, i) => ({
    ...s,
    ...swatches[sorted.length - 1 - i],
  }));
}
