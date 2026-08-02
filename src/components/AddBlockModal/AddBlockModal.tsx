import { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from '../ds/composites/Popover';
import { ScrollArea } from '../ds/composites/ScrollArea';
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
  /* Still addable — drives selection, keyboard nav and the default preview. */
  const available = BLOCK_REGISTRY.filter((b) => !isUsed(b.id));

  /* Every category renders, in CATEGORY_ORDER; anything with an unlisted
   * category is appended rather than silently dropped. */
  const sections = (() => {
    const seen = new Set<string>(CATEGORY_ORDER);
    const extra = BLOCK_REGISTRY.map((b) => b.category).filter((c) => !seen.has(c));
    const order = [...CATEGORY_ORDER, ...Array.from(new Set(extra))];
    return order
      .map((category) => ({ category, blocks: BLOCK_REGISTRY.filter((b) => b.category === category) }))
      .filter((s) => s.blocks.length > 0);
  })();

  const [selectedId, setSelectedId] = useState<string | null>(available[0]?.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedId(available[0]?.id ?? null);
      setHoveredId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
        side="right"
        align="start"
        sideOffset={29}
        alignOffset={-10}
        className="flex h-[347px] w-[620px] flex-col gap-0 overflow-hidden rounded-[20px] p-0 shadow-lg"
        onKeyDown={handleKeyDown}
        aria-label="Add block"
      >
        <div className="border-b border-[#f0f0f0] px-4 py-3">
          <span className="text-xs font-semibold text-[#171717]">Add Offer</span>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Block list rail */}
          {/* Radix's Viewport wraps children in a `display:table` div for
           * accurate scroll-size measurement. Auto table layout ignores
           * max-width when a row's min-content (a long, nowrap label) is
           * wider than the rail — it grows the table instead of clipping.
           * Forcing `display:block` removes table sizing entirely so the
           * row is capped at the rail width and the label's ellipsis can engage.
           * Radix sets `display: table` via inline style, which beats a
           * plain class selector — needs `!important` to actually win. */}
          <ScrollArea className="w-[350px] shrink-0 bg-white [&_[data-radix-scroll-area-viewport]>div]:!block">
            <div className="p-4 pr-5" role="listbox" aria-label="Available blocks">
              {sections.map((section) => (
                <div key={section.category} className="mb-3 last:mb-0">
                  <div
                    role="presentation"
                    /* pl-5 (20px) aligns the heading with the offer rows'
                     * left padding, so "Retention" lines up with the names
                     * below it. */
                    className="pl-5 pr-2 pb-1 pt-2 text-xs font-semibold"
                    style={{ color: 'var(--color-muted-fg)' }}
                  >
                    {section.category}
                  </div>
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

          {/* Live preview canvas */}
          <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-[#fafafa] p-6">
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
