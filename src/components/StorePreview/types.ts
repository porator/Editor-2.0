import type { ComponentType } from 'react';

/* ── Section contract ──
 * Every preview section receives its id, its data slice, and visibility.
 * Sections never fetch data themselves — everything comes from PreviewState. */
export interface PreviewSectionProps<T = unknown> {
  sectionId: string;
  data: T;
  isVisible: boolean;
  /* Rendered inside a group container — omit the section's own wrapper/padding
   * so the group provides the single shared section boundary. */
  bare?: boolean;
}

/* One entry in the preview's section list. Order in the array is render order. */
export interface PreviewSection<T = unknown> {
  id: string;
  label: string;
  component: ComponentType<PreviewSectionProps<T>>;
  data: T;
  isVisible: boolean;
}

/* The Preview owns section ordering + visibility; sections own their content. */
export interface PreviewState {
  sections: PreviewSection<any>[];
}

/* Measured DOM geometry for one section, relative to the preview content box.
 * Used by the overlay layer to draw focus/selection frames. */
export interface SectionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
