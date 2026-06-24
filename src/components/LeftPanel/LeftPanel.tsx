import { useState, useEffect } from 'react';
import {
  MoreHorizontal, X, Palette, Wand2,
  ChevronRight, ChevronDown,
  LayoutTemplate, Image, Link2, MousePointer2,
  Gift, Calendar, Ticket,
  ShoppingBag, Timer, Star, X as XIcon, AlignLeft,
  CirclePlus, Eye, EyeOff, GripVertical, Trash2,
} from 'lucide-react';
import type { EditorState } from '../../types/editor';
import { Button } from '../ds/atoms/Button';
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
        blocks: [
          { id: 'logo',      label: 'Logo',   icon: Image },
          { id: 'main-menu', label: 'Menu',   icon: Link2, subtitle: 'Main menu' },
        ],
      },
    ],
  },
  {
    id: 'template-group',
    label: 'Blocks',
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
        blocks: [
          { id: 'rolling-offers', label: 'Offers',  icon: Ticket },
          { id: 'rolling-timer',  label: 'Timer',   icon: Timer },
          { id: 'rolling-button', label: 'Button',  icon: MousePointer2 },
        ],
      },
      {
        id: 'reward-calendar',
        label: 'Reward Calendar',
        blocks: [
          { id: 'reward-rewards',  label: 'Rewards',           icon: Gift },
          { id: 'reward-settings', label: 'Calendar Settings', icon: Calendar },
        ],
      },
      {
        id: 'daily-bonus',
        label: 'Daily Bonus',
        blocks: [
          { id: 'bonus-content', label: 'Content', icon: AlignLeft },
          { id: 'bonus-timer',   label: 'Timer',   icon: Timer },
          { id: 'bonus-button',  label: 'Button',  icon: MousePointer2 },
        ],
      },
      {
        id: 'popup',
        label: 'Popup',
        blocks: [
          { id: 'popup-content',  label: 'Content',      icon: AlignLeft },
          { id: 'popup-products', label: 'Products',     icon: ShoppingBag },
          { id: 'popup-timer',    label: 'Timer',        icon: Timer },
          { id: 'popup-button',   label: 'Button',       icon: MousePointer2 },
          { id: 'popup-close',    label: 'Close Button', icon: XIcon },
        ],
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
          { id: 'footer-logo', label: 'Logo',   icon: Image },
          { id: 'footer-nav',  label: 'Nav links', icon: Link2 },
        ],
      },
    ],
  },
];

/* ─── Sections tree panel ─── */
function BlocksPanel({ onSectionActivate, bottomOverride, activeSectionId }: {
  onSectionActivate?: (id: string, label: string) => void;
  bottomOverride?: BottomOverride;
  activeSectionId?: string;
}) {
  const [activeId, setActiveId] = useState(activeSectionId ?? 'header');

  useEffect(() => {
    if (activeSectionId) setActiveId(activeSectionId);
  }, [activeSectionId]);
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

  // deleted sections (template-group only)
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const deleteSection = (id: string) =>
    setDeleted((prev) => { const next = new Set(prev); next.add(id); return next; });

  // drag-reorder state for template-group
  const templateGroup = TREE.find((g) => g.id === 'template-group')!;
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    () => templateGroup.sections.map((s) => s.id)
  );
  const [dragId, setDragId]     = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragId(id);
  };
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragId) setDragOver(id);
  };
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOver(null); return; }
    setSectionOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragId);
      const to   = next.indexOf(targetId);
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
    setDragId(null);
    setDragOver(null);
  };
  const handleDragEnd = () => { setDragId(null); setDragOver(null); };

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const topContent = (
    <div className={styles.tree}>
      {TREE.map((group) => (
        <div key={group.id} className={styles.treeGroup}>
          <p className={styles.treeGroupLabel}>{group.label}</p>

          {(group.id === 'template-group'
            ? sectionOrder.filter((id) => !deleted.has(id)).map((id) => templateGroup.sections.find((s) => s.id === id)!)
            : group.sections
          ).map((section) => {
            const isExpanded = expanded.has(section.id);
            const isActive   = activeId === section.id;
            const hasBlocks  = section.blocks.length > 0;
            const isHidden   = hidden.has(section.id);
            const isBlocks   = group.id === 'template-group';
            const isDragging = dragId === section.id;
            const isDragOver = dragOver === section.id && !isDragging;

            return (
              <div
                key={section.id}
                onDragOver={isBlocks ? (e) => handleDragOver(e, section.id) : undefined}
                onDrop={isBlocks ? () => handleDrop(section.id) : undefined}
              >
                {/* Insertion line above this section while dragging */}
                {isDragOver && <div className={styles.dragDivider} />}

                {/* Section row */}
                <div
                  className={`${styles.sectionRow} ${isActive ? styles.sectionRowActive : ''} ${isBlocks ? styles.sectionRowHoverable : ''} ${isDragging ? styles.sectionRowDragging : ''}`}
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
                  {/* Icon: LayoutTemplate by default, GripVertical on hover (blocks only) */}
                  <span
                    className={`${styles.sectionIconWrap} ${isHidden ? styles.sectionIconHidden : ''}`}
                    draggable={isBlocks}
                    onDragStart={isBlocks ? (e) => handleDragStart(e, section.id) : undefined}
                    onDragEnd={isBlocks ? handleDragEnd : undefined}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LayoutTemplate size={14} strokeWidth={1.75} className={`${styles.sectionIconDefault} ${styles.sectionIcon}`} />
                    {isBlocks && <GripVertical size={14} strokeWidth={1.75} className={styles.sectionIconGrip} />}
                  </span>
                  <span className={`${styles.sectionLabel} ${isHidden ? styles.sectionLabelHidden : ''}`}>{section.label}</span>
                  {isBlocks && (
                    <>
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
          })}

          {group.id === 'template-group' && (
            <div
              className={styles.sectionRow}
              style={{ color: '#4f46e5' }}
              onClick={() => {}}
            >
              <span style={{ width: 18, height: 18, flexShrink: 0 }} />
              <CirclePlus size={14} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              <span className={styles.sectionLabel} style={{ color: '#4f46e5' }}>Add block</span>
            </div>
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
          <span className={styles.cardTitle}>Sections</span>
          <div className={styles.cardActions}>
            <button className={styles.cardMenuBtn} aria-label="Sections options">
              <MoreHorizontal size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <div className={styles.cardBody}>{topContent}</div>
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
