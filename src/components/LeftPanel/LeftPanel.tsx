import { useState, useEffect, useRef, useMemo } from 'react';
import {
  MoreHorizontal, X, Palette, Wand2,
  ChevronRight, ChevronDown,
  MousePointer2,
  ShoppingBag, Timer, Star,
  CirclePlus, Plus, Eye, EyeOff, GripVertical, Trash2, Folder, Combine, Ungroup,
  PanelTop, PanelBottom, Rows2,
} from 'lucide-react';
import type { EditorState } from '../../types/editor';
import { Badge } from '../ds/atoms/Badge';
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from '../ds/composites/Dropdown';
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from '../ds/composites/Tooltip';
import { useFocusState } from '../../hooks/useSectionFocus';
import { useGrouping } from '../../hooks/useGrouping';
import { useFirstOpen } from '../../hooks/useFirstOpen';
import AddBlockModal from '../AddBlockModal/AddBlockModal';
import BlockTreeSkeleton from './BlockTreeSkeleton';
import styles from './LeftPanel.module.css';

export interface BottomOverride {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
  activeSectionId?: string;
  onSectionActivate?: (sectionId: string, label: string) => void;
  bottomOverride?: BottomOverride;
}

/* ─── Tree data types ─── */
interface Block {
  id: string;
  label: string;
  icon: React.ElementType;
  subtitle?: string;
}

interface Section {
  id: string;
  label: string;
  blocks: Block[];
}

interface SectionGroup {
  id: string;
  label: string;
  sections: Section[];
}

/* ─── Tree data ─── */
const TREE: SectionGroup[] = [
  {
    id: 'sections-group',
    label: 'Header',
    sections: [
      {
        id: 'header',
        label: 'Header',
        blocks: [],
      },
    ],
  },
  {
    id: 'template-group',
    label: 'Offers',
    sections: [
      {
        id: 'banner',
        label: 'Banner',
        blocks: [],
      },
      {
        id: 'bundle',
        label: 'Bundle',
        blocks: [
          { id: 'bundle-products', label: 'Products',  icon: ShoppingBag },
          { id: 'bundle-button',   label: 'Button',    icon: MousePointer2 },
          { id: 'bundle-badge',    label: 'Badge',     icon: Star },
        ],
      },
      {
        id: 'promotion',
        label: 'Promotion',
        blocks: [
          { id: 'promo-products',     label: 'Products',    icon: ShoppingBag },
          { id: 'promo-timer',        label: 'Timer',       icon: Timer },
          { id: 'promo-button',       label: 'Button',      icon: MousePointer2 },
          { id: 'promo-badge',        label: 'Badge',       icon: Star },
        ],
      },
      {
        id: 'rolling-offer',
        label: 'Rolling Offer',
        blocks: [],
      },
      {
        id: 'reward-calendar',
        label: 'Reward Calendar',
        blocks: [],
      },
      {
        id: 'daily-bonus',
        label: 'Daily Bonus',
        blocks: [],
      },
      {
        id: 'popup',
        label: 'Popup',
        blocks: [],
      },
    ],
  },
  {
    id: 'footer-group',
    label: 'Footer',
    sections: [
      {
        id: 'footer',
        label: 'Footer',
        blocks: [],
      },
    ],
  },
];

/* ─── Section groups — Reward Calendar / Daily Bonus / Popup only ───
 * A group is purely an editor organization container: children keep
 * their own id, config, visibility and editor state, and the Preview
 * render order is unaffected. */
const GROUPABLE_TYPES = ['reward-calendar', 'daily-bonus', 'popup'];
const MAX_GROUP_SIZE = 3;

/* Static/dynamic indicator (Cap 7.A.1) — "New" label on Bundle & Promotion only */
const NEW_BLOCKS = ['bundle', 'promotion'];

/* First-time default — only these Offers blocks appear in the tree; the rest
 * (Daily Bonus, Popup) stay available in the Add Block modal until added. */
const DEFAULT_OFFER_BLOCKS = ['banner', 'bundle', 'promotion', 'rolling-offer', 'reward-calendar'];

/* Row icon by section type: Header/Footer are panels, offer blocks are Rows2 */
const SECTION_ICONS: Record<string, React.ElementType> = {
  header: PanelTop,
  footer: PanelBottom,
};
const sectionIconFor = (id: string): React.ElementType => SECTION_ICONS[id] ?? Rows2;

interface SectionGroupItem {
  id: string;
  type: 'group';
  title: string;
  children: Section[];
}

type TemplateItem = Section | SectionGroupItem;

const isGroupItem = (item: TemplateItem): item is SectionGroupItem =>
  (item as SectionGroupItem).type === 'group';

/* Central gate for every grouping drag decision. */
function canCreateGroup(draggedId: string, target: TemplateItem): boolean {
  if (!GROUPABLE_TYPES.includes(draggedId)) return false;
  if (isGroupItem(target)) {
    return target.children.length < MAX_GROUP_SIZE
      && !target.children.some((c) => c.id === draggedId);
  }
  return GROUPABLE_TYPES.includes(target.id) && target.id !== draggedId;
}

/* ─── Sections tree panel ─── */
function BlocksPanel({ onSectionActivate, bottomOverride, activeSectionId }: {
  onSectionActivate?: (id: string, label: string) => void;
  bottomOverride?: BottomOverride;
  activeSectionId?: string;
}) {
  // First-time users see the animated block-tree skeleton for 3s.
  const loading = useFirstOpen(3000);

  // First-time: nothing selected until the user picks a block
  const [activeId, setActiveId] = useState(activeSectionId ?? '');

  useEffect(() => {
    if (activeSectionId) setActiveId(activeSectionId);
  }, [activeSectionId]);

  /* Shared hover focus (Sections drawer ⇄ Store Preview) */
  const { hoveredSectionId, source: focusSource, setHoveredSection } = useFocusState();
  const treeRef = useRef<HTMLDivElement>(null);

  /* Preview-initiated hover → bring the matching row into view. */
  useEffect(() => {
    if (focusSource !== 'preview' || !hoveredSectionId) return;
    treeRef.current
      ?.querySelector(`[data-section-id="${hoveredSectionId}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focusSource, hoveredSectionId]);
  // tracks which sections are expanded; default: expand 'header'
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // tracks which sections are hidden (eye toggle)
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggleHidden = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // template-group items — flat sections plus section groups (drag to combine)
  const templateGroup = TREE.find((g) => g.id === 'template-group')!;
  const [items, setItems] = useState<TemplateItem[]>(
    () => templateGroup.sections.filter((s) => DEFAULT_OFFER_BLOCKS.includes(s.id)),
  );
  const groupSeq = useRef(1);

  // Publish the current Offers layout (order + groups) so the Store Preview
  // renders the same blocks, in the same order, with groups side by side.
  const { publish } = useGrouping();

  // deleted sections (template-group only)
  const [deleted, setDeleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Flatten items into offer order (group children inline), skipping deleted.
    const order: string[] = [];
    const groups: { id: string; title: string; childIds: string[] }[] = [];
    for (const item of items) {
      if (isGroupItem(item)) {
        const childIds = item.children.filter((c) => !deleted.has(c.id)).map((c) => c.id);
        if (childIds.length === 0) continue;
        groups.push({ id: item.id, title: item.title, childIds });
        order.push(...childIds);
      } else if (!deleted.has(item.id)) {
        order.push(item.id);
      }
    }
    publish({ order, groups });
  }, [items, deleted, publish]);
  const deleteSection = (id: string) => {
    setDeleted((prev) => { const next = new Set(prev); next.add(id); return next; });
    // prune deleted children out of groups; unwrap single-child groups, drop empty ones
    setItems((prev) => prev.flatMap((item): TemplateItem[] => {
      if (!isGroupItem(item)) return [item];
      const children = item.children.filter((c) => c.id !== id);
      if (children.length === 0) return [];
      if (children.length === 1) return [children[0]];
      return [{ ...item, children }];
    }));
  };

  // Add Block modal — anchorEl overrides the trigger anchor when the
  // panel is opened from the group label's "+" button
  const [addOpen, setAddOpen] = useState(false);
  const [addAnchor, setAddAnchor] = useState<HTMLElement | null>(null);
  const handleAddOpenChange = (open: boolean) => {
    setAddOpen(open);
    if (!open) setAddAnchor(null);
  };
  // Each block type can only be used once, so the Add Offer modal only ever
  // offers ids that aren't currently visible in the tree.
  const insertBlock = (blockId: string) => {
    const template = templateGroup.sections.find((s) => s.id === blockId);
    if (!template) return;
    if (deleted.has(blockId)) {
      // restore a previously deleted section in place
      setDeleted((prev) => { const next = new Set(prev); next.delete(blockId); return next; });
      return;
    }
    const alreadyPresent = items.some(
      (i) => i.id === blockId || (isGroupItem(i) && i.children.some((c) => c.id === blockId)),
    );
    if (alreadyPresent) return;
    setItems((prev) => [...prev, template]);
  };

  // Each block type can only be used once — hide any currently-visible
  // block (top-level or nested in a group) from the Add Offer modal.
  const usedBlockIds = useMemo(() => {
    const ids = new Set<string>();
    items.forEach((item) => {
      if (isGroupItem(item)) {
        item.children.forEach((c) => { if (!deleted.has(c.id)) ids.add(c.id); });
      } else if (!deleted.has(item.id)) {
        ids.add(item.id);
      }
    });
    return ids;
  }, [items, deleted]);

  // group accordion state
  const [groupOpen, setGroupOpen] = useState<Set<string>>(new Set());
  const toggleGroup = (id: string) =>
    setGroupOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // drag state — mode decides between reordering and grouping
  const [dragId, setDragId]     = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'reorder' | 'group'>('reorder');

  const resetDrag = () => { setDragId(null); setDragOver(null); setDragMode('reorder'); };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragId(id);
  };
  const handleDragOver = (e: React.DragEvent, target: TemplateItem) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragId || dragId === target.id) return;
    // group mode in the middle band of a compatible target; edges keep reordering
    let mode: 'reorder' | 'group' = 'reorder';
    if (canCreateGroup(dragId, target)) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (y > rect.height * 0.3 && y < rect.height * 0.7) mode = 'group';
    }
    setDragMode(mode);
    setDragOver(target.id);
  };
  /* Find a drag source anywhere — top level or nested inside a group. */
  const findItem = (id: string): TemplateItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (isGroupItem(item)) {
        const child = item.children.find((c) => c.id === id);
        if (child) return child;
      }
    }
    return undefined;
  };

  /* Remove an id from the top level and from group children.
   * Groups left with one child unwrap; empty groups are dropped. */
  const removeEverywhere = (list: TemplateItem[], id: string): TemplateItem[] =>
    list
      .filter((i) => i.id !== id)
      .flatMap((i): TemplateItem[] => {
        if (!isGroupItem(i)) return [i];
        const children = i.children.filter((c) => c.id !== id);
        if (children.length === i.children.length) return [i];
        if (children.length === 0) return [];
        if (children.length === 1) return [children[0]];
        return [{ ...i, children }];
      });

  /* Group that currently contains a section id, if any. */
  const findGroupOf = (id: string): SectionGroupItem | null => {
    for (const item of items) {
      if (isGroupItem(item) && item.children.some((c) => c.id === id)) return item;
    }
    return null;
  };

  /* Contextual Group action — visible on a row only while a compatible
   * section (or a group with room) is selected. All grouping decisions
   * live here, not in the tree. */
  const shouldShowGroupAction = (selectedId: string, candidate: TemplateItem): boolean => {
    if (candidate.id === selectedId) return false;             // never on the selected row

    // A group is selected → loose compatible sections can join it
    const selectedGroup = items.find((i) => i.id === selectedId && isGroupItem(i)) as SectionGroupItem | undefined;
    if (selectedGroup) {
      return !isGroupItem(candidate)
        && selectedGroup.children.length < MAX_GROUP_SIZE
        && GROUPABLE_TYPES.includes(candidate.id)
        && !findGroupOf(candidate.id);
    }

    if (!GROUPABLE_TYPES.includes(selectedId)) return false;   // selection must be groupable
    if (findGroupOf(selectedId)) return false;                 // selected already grouped
    if (isGroupItem(candidate)) {
      return candidate.children.length < MAX_GROUP_SIZE
        && !candidate.children.some((c) => c.id === selectedId);
    }
    if (!GROUPABLE_TYPES.includes(candidate.id)) return false;
    return !findGroupOf(candidate.id);                         // candidate not nested in a group
  };

  /* Compatible group targets for a section: loose groupable sections and
   * groups with room. Drives the row's "Group" dropdown (Figma 153-3958). */
  const groupTargetsFor = (sectionId: string): TemplateItem[] =>
    items.filter((i) => {
      if (i.id === sectionId) return false;
      if (isGroupItem(i)) {
        return i.children.length < MAX_GROUP_SIZE
          && !i.children.some((c) => c.id === sectionId);
      }
      return GROUPABLE_TYPES.includes(i.id) && !deleted.has(i.id);
    });

  /* Combine an explicit source section with a target (section or group). */
  const combine = (sourceId: string, target: TemplateItem) => {
    const source = findItem(sourceId);
    if (!source || isGroupItem(source)) return;

    if (isGroupItem(target)) {
      if (target.children.length >= MAX_GROUP_SIZE) return;
      setItems((prev) => removeEverywhere(prev, source.id).map((i) =>
        i.id === target.id && isGroupItem(i)
          ? { ...i, children: [...i.children, source] }
          : i));
      setGroupOpen((prev) => new Set(prev).add(target.id));
      return;
    }

    const groupId = `group-${groupSeq.current++}`;
    setItems((prev) => removeEverywhere(prev, source.id).map((i) =>
      i.id === target.id && !isGroupItem(i)
        ? { id: groupId, type: 'group' as const, title: 'Reward & Bonuses', children: [i, source] }
        : i));
    setGroupOpen((prev) => new Set(prev).add(groupId));
  };

  /* Dissolve a group: its children return to the top level, in order,
   * at the group's position. Purely organizational — children keep their
   * ids, config, and visibility. */
  const ungroup = (groupId: string) => {
    setItems((prev) => prev.flatMap((i) =>
      i.id === groupId && isGroupItem(i) ? i.children : [i]));
    setGroupOpen((prev) => { const next = new Set(prev); next.delete(groupId); return next; });
    if (activeId === groupId) setActiveId('header');
  };

  /* Combine a section with every other loose compatible section in one
   * step — e.g. "Group with all" when all three groupable types are
   * still standalone. Inserts the new group at the source's position. */
  const combineAll = (sourceId: string, targetIds: string[]) => {
    const source = findItem(sourceId);
    if (!source || isGroupItem(source)) return;
    const targets = targetIds.map((id) => findItem(id)).filter((t) => t && !isGroupItem(t)) as Section[];
    if (targets.length !== targetIds.length) return;

    const groupId = `group-${groupSeq.current++}`;
    setItems((prev) => {
      const insertAt = prev.findIndex((i) => i.id === sourceId);
      let next = prev;
      [sourceId, ...targetIds].forEach((id) => { next = removeEverywhere(next, id); });
      const at = Math.min(insertAt === -1 ? next.length : insertAt, next.length);
      const merged = [...next];
      merged.splice(at, 0, { id: groupId, type: 'group', title: 'Reward & Bonuses', children: [source, ...targets] });
      return merged;
    });
    setGroupOpen((prev) => new Set(prev).add(groupId));
  };

  /* Click on the Group action: combine the selection with the target —
   * whichever side is a group absorbs the loose section; two loose
   * sections form a new group. */
  const groupWith = (target: TemplateItem) => {
    const selected = findItem(activeId);
    if (!selected) return;

    const group   = isGroupItem(selected) ? selected : isGroupItem(target) ? target : null;
    const section = isGroupItem(selected) ? target : selected;
    if (isGroupItem(section)) return;

    if (group) {
      if (group.children.length >= MAX_GROUP_SIZE) return;
      setItems((prev) => removeEverywhere(prev, section.id).map((i) =>
        i.id === group.id && isGroupItem(i)
          ? { ...i, children: [...i.children, section] }
          : i));
      setGroupOpen((prev) => new Set(prev).add(group.id));
      return;
    }

    const groupId = `group-${groupSeq.current++}`;
    setItems((prev) => removeEverywhere(prev, section.id).map((i) =>
      i.id === target.id && !isGroupItem(i)
        ? { id: groupId, type: 'group' as const, title: 'Reward & Bonuses', children: [i, section] }
        : i));
    setGroupOpen((prev) => new Set(prev).add(groupId));
  };

  const handleDrop = (target: TemplateItem) => {
    if (!dragId || dragId === target.id) { resetDrag(); return; }
    const dragged = findItem(dragId);
    if (!dragged) { resetDrag(); return; }

    if (dragMode === 'group' && !isGroupItem(dragged) && canCreateGroup(dragId, target)) {
      const groupId = isGroupItem(target) ? target.id : `group-${groupSeq.current++}`;
      setItems((prev) => removeEverywhere(prev, dragId)
        .map((i) => {
          if (i.id !== target.id) return i;
          return isGroupItem(i)
            ? { ...i, children: [...i.children, dragged] }
            : { id: groupId, type: 'group' as const, title: 'Reward & Bonuses', children: [i, dragged] };
        }));
      setGroupOpen((prev) => new Set(prev).add(groupId));
    } else {
      // reorder — also extracts group children back to the top level, and is
      // the fallback for full groups and incompatible targets
      setItems((prev) => {
        const without = removeEverywhere(prev, dragId);
        let to = without.findIndex((i) => i.id === target.id);
        if (to === -1 && isGroupItem(target)) {
          // the target group unwrapped when the dragged child left it —
          // drop where the remaining child now sits
          const remaining = target.children.find((c) => c.id !== dragId);
          if (remaining) to = without.findIndex((i) => i.id === remaining.id);
        }
        if (to === -1) return prev;
        const next = [...without];
        next.splice(to, 0, dragged);
        return next;
      });
    }
    resetDrag();
  };
  const handleDragEnd = () => resetDrag();

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* — Section row, shared by top-level sections and group children — */
  const renderSectionRow = (
    section: Section,
    opts: { actions: boolean; draggable: boolean },
  ) => {
    const isExpanded = expanded.has(section.id);
    const isActive   = activeId === section.id;
    const hasBlocks  = section.blocks.length > 0;
    const isHidden   = hidden.has(section.id);
    const isDragging = dragId === section.id;
    const isFocused  = hoveredSectionId === section.id && !isActive;
    const isGroupTarget = dragOver === section.id && dragMode === 'group' && !isDragging;

    return (
      <div key={section.id}>
        <div
          data-section-id={section.id}
          className={`${styles.sectionRow} ${isActive ? styles.sectionRowActive : ''} ${isFocused ? styles.sectionRowFocused : ''} ${isGroupTarget ? styles.sectionRowGroupTarget : ''} ${opts.draggable ? styles.sectionRowHoverable : ''} ${isDragging ? styles.sectionRowDragging : ''}`}
          onMouseEnter={() => setHoveredSection(section.id, 'drawer')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => {
            setActiveId(section.id);
            onSectionActivate?.(section.id, section.label);
            if (hasBlocks || isExpanded) toggle(section.id);
          }}
        >
          <button
            className={styles.chevronBtn}
            onClick={(e) => { e.stopPropagation(); toggle(section.id); }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            style={{ visibility: hasBlocks ? 'visible' : 'hidden' }}
          >
            {isExpanded
              ? <ChevronDown size={13} strokeWidth={2.5} />
              : <ChevronRight size={13} strokeWidth={2.5} />}
          </button>
          {/* Icon: per section type (PanelTop / PanelBottom / Square), GripVertical on hover (draggable rows) */}
          <span
            className={`${styles.sectionIconWrap} ${isHidden ? styles.sectionIconHidden : ''}`}
            draggable={opts.draggable}
            onDragStart={opts.draggable ? (e) => handleDragStart(e, section.id) : undefined}
            onDragEnd={opts.draggable ? handleDragEnd : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const SectionIcon = sectionIconFor(section.id);
              return <SectionIcon size={14} strokeWidth={1.75} className={`${styles.sectionIconDefault} ${styles.sectionIcon}`} />;
            })()}
            {opts.draggable && <GripVertical size={14} strokeWidth={1.75} className={styles.sectionIconGrip} />}
          </span>
          <span className={`${styles.sectionLabel} ${isHidden ? styles.sectionLabelHidden : ''}`}>
            {section.label}
            {NEW_BLOCKS.includes(section.id) && !isActive && (
              <Badge variant="success" className="ml-1.5 px-1.5 py-1 text-[10px] align-middle bg-[#eef2ff] text-[#4f46e5]">New</Badge>
            )}
          </span>
          {opts.actions && (
            <>
              {GROUPABLE_TYPES.includes(section.id) && !findGroupOf(section.id) && groupTargetsFor(section.id).length > 0 && (
                <span className={styles.groupActionSlot}>
                  {/* Group dropdown (Figma 153-3958) — lists compatible targets */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`${styles.groupActionBtn} ${styles.groupActionBtnHoverOnly}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Group ${section.label}`}
                        title={`Group ${section.label}`}
                      >
                        <Combine size={13} strokeWidth={1.75} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {groupTargetsFor(section.id).map((target) => (
                        <DropdownMenuItem
                          key={target.id}
                          onClick={(e) => { e.stopPropagation(); combine(section.id, target); }}
                        >
                          {isGroupItem(target) ? `Add to ${target.title}` : `Group with ${target.label}`}
                        </DropdownMenuItem>
                      ))}
                      {(() => {
                        const looseTargets = groupTargetsFor(section.id).filter((t) => !isGroupItem(t));
                        if (looseTargets.length < 2) return null;
                        return (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              combineAll(section.id, looseTargets.map((t) => t.id));
                            }}
                          >
                            Group with all
                          </DropdownMenuItem>
                        );
                      })()}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              )}
              <button
                className={`${styles.eyeBtn} ${isHidden ? styles.eyeBtnVisible : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleHidden(section.id); }}
                aria-label={isHidden ? 'Show section' : 'Hide section'}
              >
                {isHidden ? <EyeOff size={13} strokeWidth={1.75} /> : <Eye size={13} strokeWidth={1.75} />}
              </button>
              <button
                className={styles.deleteBtn}
                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                aria-label="Delete section"
              >
                <Trash2 size={13} strokeWidth={1.75} />
              </button>
            </>
          )}
        </div>

        {/* Blocks */}
        {isExpanded && (
          <div className={styles.blockList}>
            {section.blocks.map((block) => (
              <div
                key={block.id}
                className={`${styles.blockRow} ${activeId === block.id ? styles.blockRowActive : ''}`}
                onClick={() => {
                  setActiveId(block.id);
                  onSectionActivate?.(block.id, block.label);
                }}
              >
                <block.icon size={14} strokeWidth={1.75} className={styles.blockIcon} />
                <span className={styles.blockLabel}>{block.label}</span>
                {block.subtitle && (
                  <span className={styles.blockSubtitle}>– {block.subtitle}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* — Group container: accordion header + nested children — */
  const renderGroup = (item: SectionGroupItem) => {
    const isOpen     = groupOpen.has(item.id);
    const isActive   = activeId === item.id;
    const isDragging = dragId === item.id;
    const isGroupTarget = dragOver === item.id && dragMode === 'group' && !isDragging;

    return (
      <div className={`${styles.groupContainer} ${isGroupTarget ? styles.groupContainerTarget : ''}`}>
        <div
          className={`${styles.sectionRow} ${styles.groupHeader} ${isActive ? styles.sectionRowActive : ''} ${styles.sectionRowHoverable} ${isDragging ? styles.sectionRowDragging : ''}`}
          onClick={() => { setActiveId(item.id); toggleGroup(item.id); }}
        >
          <button
            className={styles.chevronBtn}
            onClick={(e) => { e.stopPropagation(); toggleGroup(item.id); }}
            aria-label={isOpen ? 'Collapse group' : 'Expand group'}
          >
            {isOpen
              ? <ChevronDown size={13} strokeWidth={2.5} />
              : <ChevronRight size={13} strokeWidth={2.5} />}
          </button>
          <span
            className={styles.sectionIconWrap}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <Folder size={14} strokeWidth={1.75} className={`${styles.sectionIconDefault} ${styles.sectionIcon}`} />
            <GripVertical size={14} strokeWidth={1.75} className={styles.sectionIconGrip} />
          </span>
          <span className={styles.sectionLabel}>{item.title}</span>
          <span className={styles.groupActionSlot}>
            {shouldShowGroupAction(activeId, item) && (
              <button
                className={styles.groupActionBtn}
                onClick={(e) => { e.stopPropagation(); groupWith(item); }}
                aria-label={`Add to ${item.title}`}
                title={`Add to ${item.title}`}
              >
                <Combine size={13} strokeWidth={1.75} />
              </button>
            )}
          </span>
          <button
            className={`${styles.groupActionBtn} ${styles.groupActionBtnHoverOnly}`}
            onClick={(e) => { e.stopPropagation(); ungroup(item.id); }}
            aria-label={`Ungroup ${item.title}`}
            title="Ungroup"
          >
            <Ungroup size={13} strokeWidth={1.75} />
          </button>
        </div>
        {isOpen && (
          <div className={styles.groupChildren}>
            {item.children
              .filter((c) => !deleted.has(c.id))
              .map((c) => renderSectionRow(c, { actions: true, draggable: true }))}
          </div>
        )}
      </div>
    );
  };

  const topContent = (
    <div className={styles.tree} ref={treeRef}>
      {TREE.map((group) => (
        <div key={group.id} className={styles.treeGroup}>
          <p className={styles.treeGroupLabel}>
            {group.label}
            {group.id === 'template-group' && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={styles.treeGroupAddBtn}
                      aria-label="Add block"
                      onClick={(e) => { setAddAnchor(e.currentTarget); setAddOpen(true); }}
                    >
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>Add New Block</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>

          {group.id === 'template-group'
            ? (() => {
                const visibleItems = items.filter((item) => isGroupItem(item) || !deleted.has(item.id));
                if (visibleItems.length === 0) {
                  return (
                    <div className={styles.treeGroupEmptyCard}>
                      <p className={styles.treeGroupEmptyTitle}>No offers added</p>
                      <p className={styles.treeGroupEmptySubtitle}>
                        Add a block to start building your offer.
                      </p>
                    </div>
                  );
                }
                return visibleItems.map((item) => (
                  <div
                    key={item.id}
                    onDragOver={(e) => handleDragOver(e, item)}
                    onDrop={() => handleDrop(item)}
                  >
                    {/* Insertion line above this item while reordering */}
                    {dragOver === item.id && dragId !== item.id && dragMode === 'reorder' && (
                      <div className={styles.dragDivider} />
                    )}
                    {isGroupItem(item)
                      ? renderGroup(item)
                      : renderSectionRow(item, { actions: true, draggable: true })}
                  </div>
                ));
              })()
            : group.sections.map((section) =>
                renderSectionRow(section, { actions: false, draggable: false }))}

          {group.id === 'template-group' && (
            <AddBlockModal open={addOpen} onOpenChange={handleAddOpenChange} onInsert={insertBlock} anchorEl={addAnchor} usedIds={usedBlockIds}>
              <div
                className={`${styles.sectionRow} ${addOpen && !addAnchor ? styles.sectionRowForcedHover : ''}`}
                style={{ color: '#4f46e5' }}
                onClick={() => setAddAnchor(null)}
              >
                <span style={{ width: 18, height: 18, flexShrink: 0 }} />
                <CirclePlus size={14} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                <span className={styles.sectionLabel} style={{ color: '#4f46e5' }}>Add block</span>
              </div>
            </AddBlockModal>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.blocksPanelRoot}>
      {/* Sections card — fills all available space */}
      <div className={styles.card} style={{ flex: bottomOverride ? '0 0 55%' : '1 1 0' }}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Blocks</span>
        </div>
        <div className={styles.cardBody}>{loading ? <BlockTreeSkeleton /> : topContent}</div>
      </div>

      {/* Settings card — only visible in narrow mode when a section is active */}
      {bottomOverride && (
        <>
          <div className={styles.stackDivider} />
          <div className={styles.card} style={{ flex: '1 1 0' }}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>{bottomOverride.title}</span>
              <div className={styles.cardActions}>
                <button className={styles.cardMenuBtn} aria-label="More options">
                  <MoreHorizontal size={16} strokeWidth={1.75} />
                </button>
                <button className={styles.cardMenuBtn} aria-label="Close settings" onClick={bottomOverride.onClose}>
                  <X size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
            <div className={styles.cardBody}>{bottomOverride.content}</div>
          </div>
        </>
      )}
    </div>
  );
}



/* ─── Brand Kit panel ─── */
function BrandKitPanel() {
  const items = ['Logo', 'Background image', 'Button image', 'Badge / Emblem'];

  const topContent = (
    <ul className={styles.brandList}>
      {items.map((item) => (
        <li key={item} className={styles.brandItem}>
          <div className={styles.brandThumb}><Palette size={15} strokeWidth={1.5} /></div>
          <span className={styles.brandLabel}>{item}</span>
          <button className={styles.brandUploadBtn}>Upload</button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.blocksPanelRoot}>
      <div className={styles.card}>
        <div className={styles.cardHeader}><span className={styles.cardTitle}>Brand Assets</span></div>
        <div className={styles.cardBody}>{topContent}</div>
      </div>
    </div>
  );
}

/* ─── Personalization panel ─── */
function PersonalizationPanel() {
  const topContent = (
    <div className={styles.emptyState}>
      <Wand2 size={22} strokeWidth={1.5} className={styles.emptyIcon} />
      <p className={styles.emptyText}>No personalization rules</p>
      <button className={styles.emptyActionBtn}>Add rule</button>
    </div>
  );

  return (
    <div className={styles.blocksPanelRoot}>
      <div className={styles.card}>
        <div className={styles.cardHeader}><span className={styles.cardTitle}>Rules</span></div>
        <div className={styles.cardBody}>{topContent}</div>
      </div>
    </div>
  );
}

export default function LeftPanel({ state, activeSectionId, onSectionActivate, bottomOverride }: Props) {
  return (
    <aside className={styles.panel} aria-label="Editor panel">
      {state.activePanel === 'blocks'          && <BlocksPanel activeSectionId={activeSectionId} onSectionActivate={onSectionActivate} bottomOverride={bottomOverride} />}
      {state.activePanel === 'brandKit'        && <BrandKitPanel />}
      {state.activePanel === 'personalization' && <PersonalizationPanel />}
    </aside>
  );
}
