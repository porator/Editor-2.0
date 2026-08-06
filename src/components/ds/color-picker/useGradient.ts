import * as React from "react";

import type {
  GradientBackground,
  GradientStop,
  GradientType,
} from "./types";
import {
  addStopAt,
  removeStop as removeStopUtil,
  sortStops,
  toGradientCss,
  updateStop as updateStopUtil,
} from "./gradient";

export interface UseGradientResult {
  stops: GradientStop[];
  selectedStop: GradientStop | undefined;
  selectedId: string | null;
  css: string;
  selectStop: (id: string) => void;
  addStop: (position: number) => void;
  removeStop: (id: string) => void;
  updateStop: (id: string, patch: Partial<Omit<GradientStop, "id">>) => void;
  setGradientType: (gradientType: GradientType) => void;
  setAngle: (angle: number) => void;
}

/**
 * Owns gradient editing behaviour on top of a controlled gradient value:
 * stop selection, add/remove/update, and derived CSS. Selection is local UI
 * state; everything else is emitted through `onChange`.
 */
export function useGradient(
  value: GradientBackground,
  onChange: (next: GradientBackground) => void,
): UseGradientResult {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    value.stops[0]?.id ?? null,
  );

  // Ensure a valid selection whenever stops change externally.
  React.useEffect(() => {
    if (!value.stops.some((s) => s.id === selectedId)) {
      setSelectedId(value.stops[0]?.id ?? null);
    }
  }, [value.stops, selectedId]);

  const commit = React.useCallback(
    (stops: GradientStop[]) => onChange({ ...value, stops: sortStops(stops) }),
    [onChange, value],
  );

  const addStop = React.useCallback(
    (position: number) => {
      const { stops, id } = addStopAt(value.stops, position);
      setSelectedId(id);
      commit(stops);
    },
    [commit, value.stops],
  );

  const removeStop = React.useCallback(
    (id: string) => {
      const next = removeStopUtil(value.stops, id);
      if (next === value.stops) return; // guard: min two stops
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      commit(next);
    },
    [commit, selectedId, value.stops],
  );

  const updateStop = React.useCallback(
    (id: string, patch: Partial<Omit<GradientStop, "id">>) =>
      commit(updateStopUtil(value.stops, id, patch)),
    [commit, value.stops],
  );

  const setGradientType = React.useCallback(
    (gradientType: GradientType) => onChange({ ...value, gradientType }),
    [onChange, value],
  );

  const setAngle = React.useCallback(
    (angle: number) => onChange({ ...value, angle: ((angle % 360) + 360) % 360 }),
    [onChange, value],
  );

  const selectedStop = React.useMemo(
    () => value.stops.find((s) => s.id === selectedId),
    [value.stops, selectedId],
  );

  const css = React.useMemo(() => toGradientCss(value), [value]);

  return {
    stops: value.stops,
    selectedStop,
    selectedId,
    css,
    selectStop: setSelectedId,
    addStop,
    removeStop,
    updateStop,
    setGradientType,
    setAngle,
  };
}
