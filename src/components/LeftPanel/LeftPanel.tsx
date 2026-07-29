import { useState, useEffect, useRef, useMemo } from 'react';
import {
  MoreHorizontal, X, Palette, Wand2,
  ChevronRight, ChevronDown,
  MousePointer2,
  ShoppingBag, Timer, Star, Image, IdCard, User,
  CirclePlus, Plus, Eye, EyeOff, GripVertical, Trash2, Folder, Combine, Ungroup,
  PanelTop, PanelBottom, Rows2,
} from 'lucide-react';
import type { EditorState } from '../../types/editor';
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from '../ds/composites/Dropdown';
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from '../ds/composites/Tooltip';
import {
  Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose,
} from '../ds/composites/Dialog';
import { Button } from '../ds/atoms/Button';
import { useFocusState } from '../../hooks/useSectionFocus';
import { useGrouping } from '../../hooks/useGrouping';
import { useFirstOpen } from '../../hooks/useFirstOpen';
import { useResizableDrawer } from '../../hooks/useResizableDrawer';
import { useResizableStack } from '../../hooks/useResizableStack';
import AddBlockModal from '../AddBlockModal/AddBlockModal';
import BlockTreeSkeleton from './BlockTreeSkeleton';
import { useOfferTreeDrag, type DropTarget } from './useOfferTreeDrag';
import { NEW_BLOCKS, NewBadge } from './NewBadge';
import styles from './LeftPanel.module.css';

export interface BottomOverride {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  /* Show the "New" badge beside the drawer title (Bundle / Promotion). */
  isNew?: boolean;
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
  /* Display-only leaf: hide/show via the eye icon, but not selectable —
   * no config drawer, no active state. Used for Header's Logo/Player
   * ID/Player Name, which have no dedicated config surface of their own. */
  toggleOnly?: boolean;
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
        blocks: [
          { id: 'header-logo',       label: 'Logo',        icon: Image,      toggleOnly: true },
          { id: 'header-player-id',  label: 'Player ID',   icon: IdCard,     toggleOnly: true },
          { id: 'header-player-name', label: 'Player Name', icon: User,      toggleOnly: true },
        ],
      },
    ],
  },
  {
    id: 'template-group',
    label: 'Offer Blocks',
    sections: [
      {
        id: 'progress-bar',
        label: 'Progress Bar',
        blocks: [],
      },
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
      {
        id: 'add-to-home-screen',
        label: 'Add to Home Screen',
        blocks: [],
      },
      {
        id: 'custom-block-1',
        label: 'Custom Block 1',
        blocks: [],
      },
      {
        id: 'custom-block-2',
        label: 'Custom Block 2',
        blocks: [],
      },
      {
        id: 'custom-block-3',
        label: 'Custom Block 3',
        blocks: [],
      },
      {
        id: 'custom-block-4',
        label: 'Custom Block 298357983275897429857423975',
        blocks: [],
      },
      {
        id: 'custom-block-5',
        label: 'Custom Block 5',
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
        blocks: [
          /* Branding asset with no config surface of its own — hide/show
           * only, same treatment as Header's Logo. */
          { id: 'footer-appcharge-logo', label: 'Appcharge Logo', icon: Image, toggleOnly: true },
        ],
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

/* Static/dynamic indicator (Cap 7.A.1) — "New" on Bundle & Promotion only.
 * NEW_BLOCKS now lives in ./NewBadge so the tree dot and the config-drawer
 * badge share one source of truth. */

/* First-time default — only these Offer blocks appear in the tree, in exactly
 * this order; everything else stays in the Add Block modal until added. */
const DEFAULT_OFFER_BLOCKS = [
  'progress-bar',
  'bundle',
  'promotion',
  'rolling-offer',
  'banner',
  'reward-calendar',
];

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
  // First-time users see the animated block-tree skeleton once, for 6s.
  const loading = useFirstOpen(6000);

  /* Vertical split between this card and the stacked config card below. */
  const stack = useResizableStack(!!bottomOverride);

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
  // Offer pending deletion — drives the confirmation dialog. Deleting is
  // gated behind a confirm rather than firing on the trash click.
  const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null);

  const toggleHidden = (id: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // template-group items — flat sections plus section groups (drag to combine)
  const templateGroup = TREE.find((g) => g.id === 'template-group')!;
  const [items, setItems] = useState<TemplateItem[]>(
    /* Map over DEFAULT_OFFER_BLOCKS rather than filtering TREE, so the tree
     * honours the specified default order instead of TREE's declaration order. */
    () => DEFAULT_OFFER_BLOCKS
      .map((id) => templateGroup.sections.find((s) => s.id === id))
      .filter((s): s is Section => !!s),
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

  /* Section ids to highlight while a "Group with …" / "Add to …" menu item
   * is hovered, so it's clear which block(s) the action targets. */
  const [groupPreviewIds, setGroupPreviewIds] = useState<string[]>([]);

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
    /* Grouping unmounts the source row's dropdown before its onOpenChange
     * cleanup runs, so clear the hover-preview highlight here to avoid a
     * phantom hover lingering on the target once it's nested. */
    setGroupPreviewIds([]);

    if (isGroupItem(target)) {
      if (target.children.length >= MAX_GROUP_SIZE) return;
      setItems((prev) => removeEverywhere(prev, source.id).map((i) =>
        i.id === target.id && isGroupItem(i)
          ? { ...i, children: [...i.children, source] }
          : i));
      setGroupOpen((prev) => new Set(prev).add(target.id));
      setActiveId(target.id);
      return;
    }

    const groupId = `group-${groupSeq.current++}`;
    setItems((prev) => removeEverywhere(prev, source.id).map((i) =>
      i.id === target.id && !isGroupItem(i)
        ? { id: groupId, type: 'group' as const, title: 'Reward & Bonuses', children: [i, source] }
        : i));
    setGroupOpen((prev) => new Set(prev).add(groupId));
    setActiveId(groupId);
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
    /* Clear the hover-preview highlight before the source row's dropdown
     * unmounts (see note in combine). */
    setGroupPreviewIds([]);

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
    setActiveId(groupId);
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
      setActiveId(group.id);
      return;
    }

    const groupId = `group-${groupSeq.current++}`;
    setItems((prev) => removeEverywhere(prev, section.id).map((i) =>
      i.id === target.id && !isGroupItem(i)
        ? { id: groupId, type: 'group' as const, title: 'Reward & Bonuses', children: [i, section] }
        : i));
    setGroupOpen((prev) => new Set(prev).add(groupId));
  };

  /* Apply a resolved drop — runs exactly once, on release. Nothing mutates
   * while dragging (the indicator carries the preview), so a cancelled drag
   * needs no rollback: there is nothing to roll back. */
  const commitDrop = (draggedId: string, target: DropTarget) => {
    if (target.kind === 'inside') {
      const dragged = findItem(draggedId);
      const targetItem = findItem(target.targetId);
      if (!dragged || isGroupItem(dragged) || !targetItem) return;
      const groupId = isGroupItem(targetItem) ? targetItem.id : `group-${groupSeq.current++}`;
      setItems((prev) => removeEverywhere(prev, draggedId).map((i) => {
        if (i.id !== target.targetId) return i;
        return isGroupItem(i)
          ? { ...i, children: [dragged, ...i.children] }
          : { id: groupId, type: 'group' as const, title: 'Reward & Bonuses', children: [i, dragged] };
      }));
      setGroupOpen((prev) => new Set(prev).add(groupId));
      setActiveId(groupId);
      return;
    }

    setItems((prev) => {
      const dragged = prev.reduce<TemplateItem | undefined>((found, item) => {
        if (found) return found;
        if (item.id === draggedId) return item;
        return isGroupItem(item) ? item.children.find((c) => c.id === draggedId) : undefined;
      }, undefined);
      if (!dragged) return prev;

      const currentGroup = prev.find(
        (i): i is SectionGroupItem => isGroupItem(i) && i.children.some((c) => c.id === draggedId),
      );

      /* Reordering within the SAME group splices that group's children in
       * place — routing through removeEverywhere would unwrap a 2-member
       * group the moment its size dipped to 1. */
      if (target.kind === 'group' && currentGroup?.id === target.groupId) {
        return prev.map((i) => {
          if (i.id !== target.groupId || !isGroupItem(i)) return i;
          const children = i.children.filter((c) => c.id !== draggedId);
          const idx = target.beforeId ? children.findIndex((c) => c.id === target.beforeId) : -1;
          const next = [...children];
          next.splice(idx === -1 ? next.length : idx, 0, dragged as Section);
          return { ...i, children: next };
        });
      }

      const without = removeEverywhere(prev, draggedId);

      if (target.kind === 'group') {
        return without.map((i) => {
          if (i.id !== target.groupId || !isGroupItem(i)) return i;
          if (i.children.length >= MAX_GROUP_SIZE) return i;
          const idx = target.beforeId ? i.children.findIndex((c) => c.id === target.beforeId) : -1;
          const next = [...i.children];
          next.splice(idx === -1 ? next.length : idx, 0, dragged as Section);
          return { ...i, children: next };
        });
      }

      const idx = target.beforeId ? without.findIndex((i) => i.id === target.beforeId) : -1;
      const next = [...without];
      next.splice(idx === -1 ? next.length : idx, 0, dragged);
      return next;
    });
  };

  const treeDrag = useOfferTreeDrag({
    scrollContainerRef: treeRef,
    getItems: () => items,
    isGroupId: (id) => { const i = items.find((x) => x.id === id); return !!i && isGroupItem(i); },
    getChildIds: (groupId) => {
      const g = items.find((i) => i.id === groupId);
      return g && isGroupItem(g) ? g.children.map((c) => c.id) : [];
    },
    isGroupOpen: (id) => groupOpen.has(id),
    isGroupableMember: (id) => GROUPABLE_TYPES.includes(id),
    canNestInto: (draggedId, targetId) => {
      const t = findItem(targetId);
      return !!t && canCreateGroup(draggedId, t);
    },
    onAutoExpand: (id) => setGroupOpen((prev) => new Set(prev).add(id)),
    onCommit: commitDrop,
    orderSignature: items
      .map((i) => (isGroupItem(i) ? `${i.id}(${i.children.map((c) => c.id).join(',')})` : i.id))
      .join('|'),
  });

  const beginDrag = (id: string) => (e: React.PointerEvent) => treeDrag.startDrag(id)(e);

  /* ── Live slot ──
   * `dropTarget` says where the list should open. Exactly one gap exists at
   * a time; it matches the dragged row's height, so the opening is literally
   * the space the block will occupy. */
  const dropTarget = treeDrag.target;

  const gapAt = (rowId: string, edge: 'before' | 'after', inGroup: boolean): boolean =>
    !!dropTarget
    && dropTarget.kind !== 'inside'
    && dropTarget.anchorId === rowId
    && dropTarget.edge === edge
    && (dropTarget.kind === 'group') === inGroup;

  const nestAt = (rowId: string): boolean =>
    dropTarget?.kind === 'inside' && dropTarget.targetId === rowId;

  /* One element, so hiding it during measurement removes its full layout
   * contribution (an indent wrapper would leave residual padding behind).
   * `data-drag-gap` is how the engine finds it to collapse it while
   * measuring — see measureRows. */
  const dragGap = (indent: boolean) => (
    <div
      data-drag-gap=""
      className={`${styles.dragGap} ${indent ? styles.dragGapIndent : ''}`}
      style={{ height: treeDrag.gapSize }}
    />
  );

  /* The dragged block, detached from the document and following the cursor.
   * Positioned by the engine writing `transform` directly each frame. */
  const dragLayer = () => {
    const dragged = treeDrag.dragId ? findItem(treeDrag.dragId) : null;
    if (!dragged) return null;
    const label = isGroupItem(dragged) ? dragged.title : dragged.label;
    const Icon = isGroupItem(dragged) ? Folder : sectionIconFor(dragged.id);
    return (
      <div
        ref={treeDrag.registerLayer}
        className={styles.dragLayer}
        style={{ width: treeDrag.dragWidth, height: treeDrag.gapSize }}
      >
        <GripVertical size={13} strokeWidth={1.75} className={styles.dragLayerGrip} />
        <Icon size={13} strokeWidth={1.75} className={styles.dragLayerIcon} />
        <span className={styles.dragLayerLabel}>{label}</span>
      </div>
    );
  };

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
    /* The dragged block rides the floating layer instead, so it must not
     * occupy the list layout — the gap stands in for it. */
    const isDragSource = treeDrag.isDragging && treeDrag.dragId === section.id;
    const isFocused  = hoveredSectionId === section.id && !isActive;
    const isGroupTarget = nestAt(section.id) && !isDragSource;
    const isGroupPreview = groupPreviewIds.includes(section.id);

    return (
      <div key={section.id} style={isDragSource ? { display: 'none' } : undefined}>
        <div
          data-section-id={section.id}
          ref={opts.draggable ? treeDrag.registerRow(section.id) : undefined}
          className={`${styles.sectionRow} ${isActive ? styles.sectionRowActive : ''} ${isFocused ? styles.sectionRowFocused : ''} ${isGroupTarget ? styles.sectionRowGroupTarget : ''} ${isGroupPreview ? styles.sectionRowGroupPreview : ''} ${opts.draggable ? styles.sectionRowHoverable : ''}`}
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
            onPointerDown={opts.draggable ? beginDrag(section.id) : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const SectionIcon = sectionIconFor(section.id);
              return <SectionIcon size={13} strokeWidth={1.75} className={`${styles.sectionIconDefault} ${styles.sectionIcon}`} />;
            })()}
            {opts.draggable && <GripVertical size={13} strokeWidth={1.75} className={styles.sectionIconGrip} />}
          </span>
          <span className={`${styles.sectionLabel} ${isHidden ? styles.sectionLabelHidden : ''}`}>
            {section.label}
            {NEW_BLOCKS.includes(section.id) && (
              /* "New" indicator reduced to a small indigo dot — lighter-weight
               * than the pill, and the aria-label keeps it announced. */
              <span
                className={styles.newDot}
                role="img"
                aria-label="New"
                title="New"
              />
            )}
          </span>
          {opts.actions && (
            <>
              {GROUPABLE_TYPES.includes(section.id) && !findGroupOf(section.id) && groupTargetsFor(section.id).length > 0 && (
                <span className={styles.groupActionSlot}>
                  {/* Group dropdown (Figma 153-3958) — lists compatible targets */}
                  <DropdownMenu onOpenChange={(open) => { if (!open) setGroupPreviewIds([]); }}>
                    {/* Tooltip wraps the dropdown trigger (Radix's documented
                      * composition) so both forward their props to the button. */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`${styles.groupActionBtn} ${styles.groupActionBtnHoverOnly}`}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Group ${section.label}`}
                          >
                            <Combine size={13} strokeWidth={1.75} />
                          </button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>Group blocks side by</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="start">
                      {groupTargetsFor(section.id).map((target) => (
                        <DropdownMenuItem
                          key={target.id}
                          onClick={(e) => { e.stopPropagation(); combine(section.id, target); }}
                          /* Highlight the target row/group so the user sees
                           * what this action will group with. */
                          onMouseEnter={() => setGroupPreviewIds([target.id])}
                          onFocus={() => setGroupPreviewIds([target.id])}
                          onMouseLeave={() => setGroupPreviewIds([])}
                        >
                          {isGroupItem(target) ? `Add to ${target.title}` : `Group with ${target.label}`}
                        </DropdownMenuItem>
                      ))}
                      {(() => {
                        const looseTargets = groupTargetsFor(section.id).filter((t) => !isGroupItem(t));
                        if (looseTargets.length < 2) return null;
                        const looseIds = looseTargets.map((t) => t.id);
                        return (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              combineAll(section.id, looseIds);
                            }}
                            /* "Group with all" → highlight every loose target. */
                            onMouseEnter={() => setGroupPreviewIds(looseIds)}
                            onFocus={() => setGroupPreviewIds(looseIds)}
                            onMouseLeave={() => setGroupPreviewIds([])}
                          >
                            Group with all
                          </DropdownMenuItem>
                        );
                      })()}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`${styles.eyeBtn} ${isHidden ? styles.eyeBtnVisible : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleHidden(section.id); }}
                    aria-label={isHidden ? 'Show section' : 'Hide section'}
                  >
                    {isHidden ? <EyeOff size={13} strokeWidth={1.75} /> : <Eye size={13} strokeWidth={1.75} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>{isHidden ? 'Show' : 'Hide'}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => { e.stopPropagation(); setPendingDelete({ id: section.id, label: section.label }); }}
                    aria-label="Delete section"
                  >
                    <Trash2 size={13} strokeWidth={1.75} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>Delete</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>

        {/* Blocks */}
        {isExpanded && (
          <div className={styles.blockList}>
            {section.blocks.map((block) => {
              if (block.toggleOnly) {
                const blockHidden = hidden.has(block.id);
                return (
                  <div
                    key={block.id}
                    className={`${styles.blockRow} ${styles.blockRowToggleOnly}`}
                  >
                    <block.icon size={13} strokeWidth={1.75} className={`${styles.blockIcon} ${blockHidden ? styles.blockIconHidden : ''}`} />
                    <span className={`${styles.blockLabel} ${blockHidden ? styles.blockLabelHidden : ''}`}>{block.label}</span>
                    <button
                      className={`${styles.eyeBtn} ${blockHidden ? styles.eyeBtnVisible : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleHidden(block.id); }}
                      aria-label={blockHidden ? `Show ${block.label}` : `Hide ${block.label}`}
                    >
                      {blockHidden ? <EyeOff size={13} strokeWidth={1.75} /> : <Eye size={13} strokeWidth={1.75} />}
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={block.id}
                  className={`${styles.blockRow} ${activeId === block.id ? styles.blockRowActive : ''}`}
                  onClick={() => {
                    setActiveId(block.id);
                    onSectionActivate?.(block.id, block.label);
                  }}
                >
                  <block.icon size={13} strokeWidth={1.75} className={`${styles.blockIcon} ${isHidden ? styles.blockIconHidden : ''}`} />
                  <span className={`${styles.blockLabel} ${isHidden ? styles.blockLabelHidden : ''}`}>{block.label}</span>
                  {block.subtitle && (
                    <span className={`${styles.blockSubtitle} ${isHidden ? styles.blockLabelHidden : ''}`}>– {block.subtitle}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  /* — Group container: accordion header + nested children — */
  const renderGroup = (item: SectionGroupItem) => {
    const isOpen     = groupOpen.has(item.id);
    const isActive   = activeId === item.id;
    const isDragSource = treeDrag.isDragging && treeDrag.dragId === item.id;
    const isGroupTarget = (nestAt(item.id) && !isDragSource)
      || groupPreviewIds.includes(item.id);

    return (
      <div
        className={`${styles.groupContainer} ${isGroupTarget ? styles.groupContainerTarget : ''}`}
        style={isDragSource ? { display: 'none' } : undefined}
      >
        <div
          ref={treeDrag.registerRow(item.id)}
          className={`${styles.sectionRow} ${styles.groupHeader} ${isActive ? styles.sectionRowActive : ''} ${styles.sectionRowHoverable}`}
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
            onPointerDown={beginDrag(item.id)}
            onClick={(e) => e.stopPropagation()}
          >
            <Folder size={13} strokeWidth={1.75} className={`${styles.sectionIconDefault} ${styles.sectionIcon}`} />
            <GripVertical size={13} strokeWidth={1.75} className={styles.sectionIconGrip} />
          </span>
          <span className={styles.sectionLabel}>{item.title}</span>
          <span className={styles.groupActionSlot}>
            {shouldShowGroupAction(activeId, item) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={styles.groupActionBtn}
                    onClick={(e) => { e.stopPropagation(); groupWith(item); }}
                    aria-label={`Add to ${item.title}`}
                  >
                    <Combine size={13} strokeWidth={1.75} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>{`Add to ${item.title}`}</TooltipContent>
              </Tooltip>
            )}
          </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`${styles.groupActionBtn} ${styles.groupActionBtnHoverOnly}`}
                  onClick={(e) => { e.stopPropagation(); ungroup(item.id); }}
                  aria-label={`Ungroup ${item.title}`}
                >
                  <Ungroup size={13} strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>Ungroup</TooltipContent>
            </Tooltip>
        </div>
        {/* Collapsed group being nested into: open an indented slot under the
          * header right away, and keep it once auto-expand fires. */}
        {!isOpen && nestAt(item.id) && dragGap(true)}
        {isOpen && (
          <div className={styles.groupChildren}>
            {/* Nested slot pushes only this parent's children apart. */}
            {nestAt(item.id) && dragGap(false)}
            {item.children
              .filter((c) => !deleted.has(c.id))
              .map((c) => (
                <div key={c.id}>
                  {gapAt(c.id, 'before', true) && dragGap(false)}
                  {renderSectionRow(c, { actions: true, draggable: true })}
                  {gapAt(c.id, 'after', true) && dragGap(false)}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  const topContent = (
    /* One provider for the whole tree — every row action below uses a bare
     * <Tooltip>, so they share this delay instead of each mounting its own. */
    <TooltipProvider delayDuration={150}>
    <div className={styles.tree} ref={treeRef}>
      {TREE.map((group) => {
        const isOfferListEmpty = group.id === 'template-group'
          && items.filter((item) => isGroupItem(item) || !deleted.has(item.id)).length === 0;
        return (
        /* Only Offer Blocks accepts drops. Marking the zone lets the drag
         * engine return "nowhere" outside it, instead of falling back to the
         * nearest row and implying Header/Footer are valid targets. */
        <div
          key={group.id}
          className={styles.treeGroup}
          data-drop-zone={group.id === 'template-group' ? '' : undefined}
        >
          <p className={styles.treeGroupLabel}>
            {group.label}
            {group.id === 'template-group' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={styles.treeGroupAddBtn}
                    aria-label="Add block"
                    onClick={(e) => { setAddAnchor(e.currentTarget); setAddOpen(true); }}
                  >
                    {/* Figma 191:2608 specifies a 12px glyph; nudged up to 14
                      * for legibility in the 24px button. strokeWidth stays
                      * 2.4 so the whole mark scales proportionally. */}
                    <Plus size={14} strokeWidth={2.4} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>Add New Block</TooltipContent>
              </Tooltip>
            )}
          </p>

          {group.id === 'template-group'
            ? (() => {
                const visibleItems = items.filter((item) => isGroupItem(item) || !deleted.has(item.id));
                if (visibleItems.length === 0) {
                  return (
                    <div className={styles.treeGroupEmptyCard}>
                      <p className={styles.treeGroupEmptyTitle}>No Offers Added</p>
                      <p className={styles.treeGroupEmptySubtitle}>
                        Add a block to start building your webstore.
                      </p>
                      <button
                        className={styles.treeGroupEmptyAddBtn}
                        onClick={(e) => { setAddAnchor(e.currentTarget); setAddOpen(true); }}
                      >
                        <CirclePlus size={13} strokeWidth={1.75} />
                        Add block
                      </button>
                    </div>
                  );
                }
                return visibleItems.map((item) => (
                  <div key={item.id}>
                    {gapAt(item.id, 'before', false) && dragGap(false)}
                    {isGroupItem(item)
                      ? renderGroup(item)
                      : renderSectionRow(item, { actions: true, draggable: true })}
                    {/* Loose section being nested into — the group doesn't
                      * exist yet, so the indented slot renders here rather
                      * than in renderGroup's children. */}
                    {!isGroupItem(item) && nestAt(item.id) && dragGap(true)}
                    {gapAt(item.id, 'after', false) && dragGap(false)}
                  </div>
                ));
              })()
            : group.sections.map((section) =>
                renderSectionRow(section, { actions: false, draggable: false }))}

          {group.id === 'template-group' && (
            <AddBlockModal open={addOpen} onOpenChange={handleAddOpenChange} onInsert={insertBlock} anchorEl={addAnchor} usedIds={usedBlockIds}>
              {/* The empty-state card already has its own "Add block" CTA —
               * this row would just be a redundant duplicate below it, so it
               * stays mounted (Radix's Slot needs a child) but hidden. */}
              <div
                className={`${styles.sectionRow} ${addOpen && !addAnchor ? styles.sectionRowForcedHover : ''}`}
                style={{ color: '#4f46e5', display: isOfferListEmpty ? 'none' : undefined }}
                onClick={() => setAddAnchor(null)}
              >
                <span style={{ width: 18, height: 18, flexShrink: 0 }} />
                <CirclePlus size={13} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                <span className={styles.sectionLabel} style={{ color: '#4f46e5' }}>Add block</span>
              </div>
            </AddBlockModal>
          )}
        </div>
        );
      })}
      {treeDrag.isDragging && dragLayer()}
    </div>
    </TooltipProvider>
  );

  return (
    <div className={styles.blocksPanelRoot} ref={stack.containerRef}>
      {/* Sections card. When a config card is stacked below, the split is
        * user-adjustable and owned imperatively by useResizableStack — hence
        * no flex in the style prop for that case. */}
      <div
        ref={stack.topRef}
        className={styles.card}
        style={bottomOverride ? undefined : { flex: '1 1 0' }}
      >
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Webstore Blocks</span>
        </div>
        <div className={styles.cardBody}>{loading ? <BlockTreeSkeleton /> : topContent}</div>
      </div>

      {/* Settings card — only visible in narrow mode when a section is active */}
      {bottomOverride && (
        <>
          <div
            className={`${styles.stackDivider} ${stack.isResizing ? styles.stackDividerActive : ''}`}
            onPointerDown={stack.onDividerPointerDown}
            onDoubleClick={stack.onDividerDoubleClick}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize sections"
            title="Drag to resize · double-click to reset"
          >
            <span className={styles.stackDividerRule} />
          </div>
          <div className={styles.card} style={{ flex: '1 1 0', minHeight: 0 }}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>
                {bottomOverride.title}
                {bottomOverride.isNew && <NewBadge />}
              </span>
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

      {/* Delete confirmation (Figma 200:4918). White blurred scrim per spec.
        * Deleting only marks the offer removed — it can be re-added from the
        * Add offer panel — so the confirm is a plain indigo button, not a
        * destructive red one. */}
      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => { if (!open) setPendingDelete(null); }}
      >
        <DialogContent
          overlayClassName="bg-white/60 backdrop-blur-[2px]"
          className="max-w-[360px] gap-4 rounded-[10px] p-6"
        >
          <DialogHeader className="gap-1.5 text-left sm:text-left">
            <DialogTitle>Delete “{pendingDelete?.label}”?</DialogTitle>
            <DialogDescription>
              This removes the block from your webstore. You can add it again from the Add offer panel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline" size="md">Cancel</Button>
            </DialogClose>
            <Button
              variant="default"
              size="md"
              onClick={() => {
                if (pendingDelete) deleteSection(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  const { isResizing, panelRef, onHandlePointerDown, onHandleDoubleClick } = useResizableDrawer();

  return (
    /* No `style={{ width }}` — the hook owns the width imperatively so a
     * re-render mid-drag can't snap the panel back to the last committed
     * value. See useResizableDrawer's applyWidth. */
    <aside
      ref={panelRef}
      className={`${styles.panel} ${isResizing ? styles.panelResizing : ''}`}
      aria-label="Editor panel"
    >
      {state.activePanel === 'blocks'          && <BlocksPanel activeSectionId={activeSectionId} onSectionActivate={onSectionActivate} bottomOverride={bottomOverride} />}
      {state.activePanel === 'brandKit'        && <BrandKitPanel />}
      {state.activePanel === 'personalization' && <PersonalizationPanel />}

      {/* Resize handle — a wide invisible hit area with a thin visible rule,
        * so it's easy to grab without drawing a chunky divider. */}
      <div
        className={styles.resizeHandle}
        onPointerDown={onHandlePointerDown}
        onDoubleClick={onHandleDoubleClick}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize editor panel"
        title="Drag to resize · double-click to reset"
      >
        <span className={styles.resizeHandleRule} />
      </div>
    </aside>
  );
}
