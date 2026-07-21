import { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from '../ds/composites/Popover';
import { ScrollArea } from '../ds/composites/ScrollArea';
import { BLOCK_REGISTRY } from './registry';
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
  /* Block ids already in use — each block type can only be added once, so
   * these are hidden from the list rather than shown as re-selectable. */
  usedIds?: Set<string>;
}

export default function AddBlockModal({ open, onOpenChange, onInsert, children, anchorEl, usedIds }: Props) {
  const available = BLOCK_REGISTRY.filter((b) => !usedIds?.has(b.id));

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
  /* Preview follows the hovered row; falls back to the selection. */
  const previewed = available.find((b) => b.id === hoveredId) ?? selected;
  const Preview = previewed?.preview;

  const insert = (id?: string) => {
    const blockId = id ?? selected?.id;
    if (!blockId) return;
    onInsert(blockId);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
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
          <span className="text-sm font-semibold text-[#171717]">Add offer</span>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Block list rail */}
          <ScrollArea className="w-[254px] shrink-0 bg-white">
            <div className="space-y-0.5 p-4" role="listbox" aria-label="Available blocks">
              {available.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-[#a3a3a3]">
                  All blocks have been added.
                </p>
              )}
              {available.map((block) => {
                const isSelected = block.id === selectedId;
                return (
                  <div
                    key={block.id}
                    role="option"
                    aria-selected={isSelected}
                    data-block-id={block.id}
                    onClick={() => insert(block.id)}
                    onMouseEnter={() => setHoveredId(block.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`${treeStyles.sectionRow} ${isSelected ? treeStyles.sectionRowActive : ''}`}
                    style={{ paddingLeft: 20, paddingRight: 8, paddingTop: 8, paddingBottom: 8, height: 'auto', alignItems: 'flex-start', gap: 6 }}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className={treeStyles.sectionLabel}>{block.name}</span>
                      <span
                        className="truncate text-xs"
                        style={{ color: isSelected ? 'rgba(255,255,255,0.75)' : '#a3a3a3' }}
                      >
                        {block.description}
                      </span>
                    </span>
                  </div>
                );
              })}
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
