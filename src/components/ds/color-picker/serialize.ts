/* Bridge the picker's BackgroundValue model with the CSS-string values stored
 * in the A2HS config (fill fields are applied directly via `background: …`, so
 * a solid hex and a gradient CSS string are both valid stored values). */

import type { BackgroundValue, GradientBackground, GradientStop } from './types';
import { clamp, hexToRgb, normalizeHex, rgbToHex, round } from './color';
import { createStopId, toGradientCss } from './gradient';

/** BackgroundValue → the CSS string stored in config / applied in the preview. */
export function valueToCss(v: BackgroundValue): string {
  if (v.type === 'gradient') return toGradientCss(v);
  const hex = normalizeHex(v.color) ?? '#000000';
  if (v.opacity >= 1) return hex;
  const { r, g, b } = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  return `rgba(${r}, ${g}, ${b}, ${round(clamp(v.opacity, 0, 1), 2)})`;
}

/** Stored CSS string → BackgroundValue for the picker to edit. */
export function cssToValue(css: string): BackgroundValue {
  const s = (css || '').trim();
  if (/^(linear|radial)-gradient\(/i.test(s)) {
    const parsed = parseGradient(s);
    if (parsed) return parsed;
  }
  return { type: 'solid', ...parseSolid(s) };
}

function parseSolid(input: string): { color: string; opacity: number } {
  const s = input.trim();
  const hex = normalizeHex(s);
  if (hex) return { color: hex, opacity: 1 };
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const [r = 0, g = 0, b = 0, a = 1] = m[1].split(',').map((x) => parseFloat(x.trim()));
    return { color: rgbToHex({ r, g, b }), opacity: clamp(a, 0, 1) };
  }
  return { color: '#000000', opacity: 1 };
}

/** Split by top-level commas (ignoring commas inside `rgba(...)`). */
function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth += 1;
    else if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function parseGradient(s: string): GradientBackground | null {
  const radial = /^radial-gradient/i.test(s);
  const inner = s.slice(s.indexOf('(') + 1, s.lastIndexOf(')'));
  const parts = splitTopLevel(inner);
  let angle = 90;
  let start = 0;

  if (!radial) {
    const a = parts[0]?.match(/(-?\d+(\.\d+)?)deg/);
    if (a) { angle = parseFloat(a[1]); start = 1; }
  } else if (/circle|ellipse|\bat\b|center/i.test(parts[0] ?? '')) {
    start = 1;
  }

  const stopParts = parts.slice(start);
  const stops: GradientStop[] = stopParts.map((raw, i) => {
    const stop = raw.trim();
    const pos = stop.match(/(-?\d+(\.\d+)?)%\s*$/);
    const position = pos
      ? parseFloat(pos[1])
      : (i / Math.max(1, stopParts.length - 1)) * 100;
    const colorStr = pos ? stop.slice(0, pos.index).trim() : stop;
    return { id: createStopId(), position, ...parseSolid(colorStr) };
  });

  return stops.length >= 2
    ? { type: 'gradient', gradientType: radial ? 'radial' : 'linear', angle, stops }
    : null;
}
