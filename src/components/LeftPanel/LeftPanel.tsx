import { useState } from 'react';
import {
  MoreHorizontal, X, Palette, Wand2,
  ChevronRight, ChevronDown,
  LayoutTemplate, Image, Link2, MousePointer2,
  Gift, Calendar, Ticket,
  ShoppingBag, Timer, ShieldCheck, Star, X as XIcon, AlignLeft,
} from 'lucide-react';
import type { EditorState } from '../../types/editor';
import { Button } from '../ds/atoms/Button';
import { Plus } from 'lucide-react';
import styles from './LeftPanel.module.css';

export interface BottomOverride {
  title: string;
  content: React.ReactNode;
  onClose: () => void;
}

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
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
          { id: 'promo-availability', label: 'Availability', icon: ShieldCheck },
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
function BlocksPanel({ onSectionActivate, bottomOverride }: {
  onSectionActivate?: (id: string, label: string) => void;
  bottomOverride?: BottomOverride;
}) {
  const [activeId, setActiveId] = useState('header');
  // tracks which sections are expanded; default: expand 'header'
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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

          {group.sections.map((section) => {
            const isExpanded = expanded.has(section.id);
            const isActive   = activeId === section.id;
            const hasBlocks  = section.blocks.length > 0;

            return (
              <div key={section.id}>
                {/* Section row */}
                <div
                  className={`${styles.sectionRow} ${isActive ? styles.sectionRowActive : ''}`}
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
                  <LayoutTemplate size={14} strokeWidth={1.75} className={styles.sectionIcon} />
                  <span className={styles.sectionLabel}>{section.label}</span>
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
            <div style={{ margin: '8px 16px 4px' }}>
              <Button variant="outline" size="sm" className="w-full" leadingIcon={<Plus size={14} />}>
                Add block
              </Button>
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

export default function LeftPanel({ state, onSectionActivate, bottomOverride }: Props) {
  return (
    <aside className={styles.panel} aria-label="Editor panel">
      {state.activePanel === 'blocks'          && <BlocksPanel onSectionActivate={onSectionActivate} bottomOverride={bottomOverride} />}
      {state.activePanel === 'brandKit'        && <BrandKitPanel />}
      {state.activePanel === 'personalization' && <PersonalizationPanel />}
    </aside>
  );
}
