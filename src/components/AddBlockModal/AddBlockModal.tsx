import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from '../ds/composites/Popover';
import { ScrollArea } from '../ds/composites/ScrollArea';
import { Input } from '../ds/atoms/Input';
import { BLOCK_REGISTRY, CATEGORY_ORDER } from './registry';
/* Rows reuse the Sections drawer's classes so UI + states stay identical */
import treeStyles from '../LeftPanel/LeftPanel.module.css';

/* ── Add Block panel — Figma "Add block" (node 153-3457) ──
 * A floating window (no backdrop) anchored to the "+ Add block" row,
 * opening beside the Sections panel. Two panels: block list rail on the
 * left, live preview on the right. Fully registry-driven: rows, previews,
 * and insertion all derive from BLOCK_REGISTRY. */

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (blockId: string) => void;
  /* The "+ Add block" row — rendered as the popover trigger/anchor. */
  children: React.ReactNode;
  /* Optional element to anchor to instead of the trigger (e.g. the group
   * label's "+" button), so the panel opens level with what was pressed. */
  anchorEl?: HTMLElement | null;
  /* Block ids already in the tree. Each type can only be added once, so these
   * render disabled rather than disappearing — the modal is a library of every
   * offer type, and a vanishing row reads as a bug or a stray filter. */
  usedIds?: Set<string>;
}

export default function AddBlockModal({ open, onOpenChange, onInsert, children, anchorEl, usedIds }: Props) {
  const isUsed = (id: string) => !!usedIds?.has(id);

  /* Free-text filter over the catalog. Matches name + description so a search
   * for "daily" finds both the offer and offers described by it. */
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  /* Category chip filter — null means "All". Combines with the text search. */
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const matches = (b: (typeof BLOCK_REGISTRY)[number]) => {
    if (activeCategory && b.category !== activeCategory) return false;
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || (b.description?.toLowerCase().includes(q) ?? false);
  };

  /* Ordered, non-empty categories — drives the filter chips. */
  const categoryList = (() => {
    const seen = new Set<string>(CATEGORY_ORDER);
    const extra = BLOCK_REGISTRY.map((b) => b.category).filter((c) => !seen.has(c));
    const order = [...CATEGORY_ORDER, ...Array.from(new Set(extra))];
    return order.filter((cat) => BLOCK_REGISTRY.some((b) => b.category === cat));
  })();

  /* Still addable AND matching the filter — drives selection, keyboard nav and
   * the default preview. */
  const available = BLOCK_REGISTRY.filter((b) => !isUsed(b.id) && matches(b));

  /* Every category renders, in CATEGORY_ORDER; anything with an unlisted
   * category is appended rather than silently dropped. Filtered-out and empty
   * categories drop away. */
  const sections = (() => {
    const seen = new Set<string>(CATEGORY_ORDER);
    const extra = BLOCK_REGISTRY.map((b) => b.category).filter((c) => !seen.has(c));
    const order = [...CATEGORY_ORDER, ...Array.from(new Set(extra))];
    return order
      .map((category) => ({
        category,
        /* Within each section, available offers sit on top and already-added
         * ones sink to the bottom. Array.sort is stable, so registry order is
         * preserved inside each of the two groups. */
        blocks: BLOCK_REGISTRY
          .filter((b) => b.category === category && matches(b))
          .sort((a, b) => Number(isUsed(a.id)) - Number(isUsed(b.id))),
      }))
      .filter((s) => s.blocks.length > 0);
  })();

  const [selectedId, setSelectedId] = useState<string | null>(available[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Opening the panel clears any prior search + category filter and resets
   * selection. */
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveCategory(null);
      setSelectedId(available[0]?.id ?? null);
      setHoveredId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* As either filter changes, keep the current pick if it's still in the
   * results, otherwise fall to the first match so the preview never points at
   * a hidden row. */
  useEffect(() => {
    setSelectedId((prev) =>
      prev && available.some((b) => b.id === prev) ? prev : available[0]?.id ?? null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, activeCategory]);

  const selected = available.find((b) => b.id === selectedId) ?? null;
  /* Preview follows the hovered row — including disabled ones, so users can
   * still inspect what an already-added offer looks like. */
  const previewed = BLOCK_REGISTRY.find((b) => b.id === hoveredId) ?? selected;
  const Preview = previewed?.preview;

  const insert = (id?: string) => {
    const blockId = id ?? selected?.id;
    if (!blockId || isUsed(blockId)) return;
    onInsert(blockId);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Arrow keys walk only the addable rows, skipping disabled ones.
      if (!available.length) return;
      const idx = available.findIndex((b) => b.id === selectedId);
      const next = e.key === 'ArrowDown'
        ? Math.min(idx + 1, available.length - 1)
        : Math.max(idx - 1, 0);
      setSelectedId(available[next].id);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      insert();
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {anchorEl && <PopoverAnchor virtualRef={{ current: anchorEl }} />}
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        ref={contentRef}
        side="right"
        align="start"
        sideOffset={29}
        alignOffset={-10}
        className="flex h-[347px] w-[620px] flex-col gap-0 overflow-hidden rounded-[20px] p-0 shadow-lg"
        onKeyDown={handleKeyDown}
        /* Open with an offer already selected rather than the cursor parked in
         * the search field: cancel Radix's default (focus first tabbable =
         * search input) and focus the panel itself, so the highlighted row
         * reads as the starting point and arrow keys still work. */
        onOpenAutoFocus={(e) => { e.preventDefault(); contentRef.current?.focus(); }}
        aria-label="Add block"
      >
        <div className="flex min-h-0 flex-1">
          {/* Block list rail — pinned search bar above a scrolling list */}
          <div className="flex w-[350px] shrink-0 flex-col bg-white">
            {/* Search bar (DS Input + leading icon). Filters the catalog by
             * name + description; stays fixed while the list scrolls. Horizontal
             * padding matches the list (pl-4 / pr-5) so the field + chips align
             * to the offer rows. */}
            <div className="pt-3 pb-0 pl-4 pr-5">
              {/* Search bar temporarily hidden — flip `false` to `true` to
               * bring it back. Category chips still filter the list. */}
              {false && (
                <div className="relative">
                  <Search
                    size={15}
                    strokeWidth={2}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a3a3a3]"
                  />
                  <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search offers"
                    aria-label="Search offers"
                    /* Gray-filled pill, no drop shadow, no focus ring — the
                     * base Input's indigo focus ring is zeroed out explicitly. */
                    className="h-8 pl-8 text-xs !rounded-[99999px] !border-[#f5f5f5] !bg-[#f5f5f5] !shadow-none transition-colors duration-200 focus:!ring-0 focus-visible:!ring-0 focus:!outline-none focus-visible:!outline-none"
                  />
                </div>
              )}
              {/* Category filter chips — combine with the text search. "All"
               * clears the category filter; clicking the active chip also
               * clears it. */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[null, ...categoryList].map((cat) => {
                  const active = activeCategory === cat;
                  return (
                    <button
                      key={cat ?? 'all'}
                      type="button"
                      onClick={() => setActiveCategory((prev) => (prev === cat ? null : cat))}
                      aria-pressed={active}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        active
                          ? 'border-transparent bg-[#f5f3ff] text-[#4f46e5]'
                          : 'border-[#e5e5e5] text-[#737373] hover:bg-[#f5f5f5]'
                      }`}
                    >
                      {cat ?? 'All'}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Radix's Viewport wraps children in a `display:table` div for
             * accurate scroll-size measurement. Auto table layout ignores
             * max-width when a row's min-content (a long, nowrap label) is
             * wider than the rail — it grows the table instead of clipping.
             * Forcing `display:block` removes table sizing entirely so the
             * row is capped at the rail width and the label's ellipsis can engage.
             * Radix sets `display: table` via inline style, which beats a
             * plain class selector — needs `!important` to actually win. */}
            <ScrollArea className="min-h-0 flex-1 [&_[data-radix-scroll-area-viewport]>div]:!block">
            <div className="p-4 pr-5" role="listbox" aria-label="Available blocks">
              {sections.length === 0 && (
                <div className="px-5 py-10 text-center text-xs" style={{ color: 'var(--color-muted-fg)' }}>
                  {query ? <>No offers match “{query}”.</> : 'No offers to show.'}
                </div>
              )}
              {/* No in-list category titles — the filter chips are the
                * category navigation. Sections still group with a gap. */}
              {sections.map((section) => (
                <div key={section.category} className="mb-3 last:mb-0">
                  <div className="space-y-0.5">
                    {section.blocks.map((block) => {
                      const used = isUsed(block.id);
                      const isSelected = block.id === selectedId;
                      /* Unify hover + selected into one highlighted state: the
                       * row under the cursor takes the active treatment,
                       * falling back to the keyboard selection. A disabled row
                       * never takes it — that would read as addable. */
                      const isActive = !used && block.id === previewed?.id;
                      return (
                        <div
                          key={block.id}
                          role="option"
                          aria-selected={isSelected && !used}
                          aria-disabled={used}
                          data-block-id={block.id}
                          data-disabled={used ? '' : undefined}
                          onClick={used ? undefined : () => insert(block.id)}
                          onMouseEnter={() => setHoveredId(block.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          draggable={false}
                          className={`${treeStyles.sectionRow} ${isActive ? treeStyles.sectionRowActive : ''}`}
                          style={{
                            paddingLeft: 20, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
                            height: 'auto', alignItems: 'flex-start', gap: 6,
                            ...(used ? { opacity: 0.45, cursor: 'not-allowed' } : null),
                          }}
                        >
                          <span className="flex min-w-0 flex-1 flex-col" style={{ gap: 2 }}>
                            <span className={treeStyles.sectionLabel}>{block.name}</span>
                            <span
                              className="truncate text-xs"
                              style={{ color: 'var(--color-muted-fg)' }}
                            >
                              {block.description}
                            </span>
                          </span>
                          {used && (
                            <span
                              className="shrink-0 whitespace-nowrap text-[10px] font-medium"
                              style={{ color: 'var(--color-gray-400)', lineHeight: '16px' }}
                            >
                              Already added
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            </ScrollArea>
          </div>

          {/* Live preview canvas — a rounded card floating inside the modal
           * (inset by a margin so the white modal shows around it). */}
          <div className="m-3 flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-[#f5f5f5] p-6">
            {Preview && previewed && (
              <div
                key={previewed.id}
                className="pointer-events-none w-full max-w-[264px] animate-in fade-in-0 duration-200"
              >
                <Preview />
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
