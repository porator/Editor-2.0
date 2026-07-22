import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ac-editor-visited';

/**
 * Returns `true` only the first time the interface is opened in this browser,
 * then persists a flag so returning ("not first-time") users never see the
 * loading state again. Resolves to `false` after `delayMs`.
 *
 * The initial value is read synchronously so returning users render the real
 * UI immediately with no skeleton flash.
 */
export function useFirstOpen(delayMs = 1200): boolean {
  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) == null;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!loading) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* storage unavailable (private mode) — still reveal after the delay */
    }
    const t = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(t);
  }, [loading, delayMs]);

  return loading;
}
