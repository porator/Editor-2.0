import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/* ── Shared template layout (Sections drawer → Store Preview) ──
 * The Block Tree owns which Offers blocks exist, their order, and their
 * grouping. It publishes that here so the preview renders the same set,
 * in the same order, with grouped blocks as one side-by-side section.
 * One-way: tree writes, preview reads. */

export interface GroupInfo {
  id: string;
  title: string;
  childIds: string[];
}

/* Default first-time Offers order — seeds the preview before the tree's
 * first publish, so there's no empty flash on mount. */
export const DEFAULT_OFFER_ORDER = ['banner', 'bundle', 'promotion', 'rolling-offer', 'reward-calendar'];

export interface TemplateLayout {
  /* Flattened Offers block ids, in tree order (group children inline). */
  order: string[];
  groups: GroupInfo[];
}

interface GroupingContextValue extends TemplateLayout {
  publish: (layout: TemplateLayout) => void;
  /* The group a section belongs to, or null if it's standalone. */
  groupOf: (sectionId: string) => GroupInfo | null;
}

const GroupingContext = createContext<GroupingContextValue | null>(null);

export function GroupingProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<TemplateLayout>({ order: DEFAULT_OFFER_ORDER, groups: [] });

  /* Only re-publish when the structure actually changes, so the preview
   * doesn't re-render on every unrelated tree update. */
  const publish = useCallback((next: TemplateLayout) => {
    setLayout((prev) => {
      const key = (l: TemplateLayout) =>
        `${l.order.join(',')}||${l.groups.map((g) => `${g.id}:${g.title}:${g.childIds.join(',')}`).join('|')}`;
      return key(prev) === key(next) ? prev : next;
    });
  }, []);

  const groupOf = useCallback(
    (sectionId: string) => layout.groups.find((g) => g.childIds.includes(sectionId)) ?? null,
    [layout.groups],
  );

  const value = useMemo(
    () => ({ order: layout.order, groups: layout.groups, publish, groupOf }),
    [layout, publish, groupOf],
  );
  return <GroupingContext.Provider value={value}>{children}</GroupingContext.Provider>;
}

export function useGrouping(): GroupingContextValue {
  const ctx = useContext(GroupingContext);
  if (!ctx) throw new Error('useGrouping must be used inside a GroupingProvider');
  return ctx;
}
