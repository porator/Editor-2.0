import {
  ArrowLeftToLine,
  PanelTop,
  SwatchBook,
  CodeXml,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import type { PreviewMode } from '../../types/editor';
import type { EditorState, ActivePanel } from '../../types/editor';
import { Button } from '../ds/atoms/Button';
import styles from './TopNavigation.module.css';

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
}

const NAV_TABS: { id: ActivePanel; icon: React.ElementType; label: string }[] = [
  { id: 'blocks',          icon: PanelTop,   label: 'Blocks' },
  { id: 'brandKit',        icon: SwatchBook, label: 'Brand Kit' },
  { id: 'personalization', icon: CodeXml,    label: 'Personalization' },
];

export default function TopNavigation({ state, onStateChange }: Props) {
  const set = (patch: Partial<EditorState>) => onStateChange({ ...state, ...patch });

  const CYCLE: { mode: PreviewMode; icon: React.ElementType; label: string }[] = [
    { mode: 'desktop', icon: Monitor,    label: 'Desktop' },
    { mode: 'tablet',  icon: Tablet,     label: 'Tablet' },
    { mode: 'mobile',  icon: Smartphone, label: 'Mobile' },
  ];
  const currentIndex = CYCLE.findIndex((c) => c.mode === state.previewMode);
  const current = CYCLE[currentIndex];
  const next = CYCLE[(currentIndex + 1) % CYCLE.length];
  const CycleIcon = current.icon;

  return (
    <header className={styles.topBar}>

      {/* ── Left: Exit + nav tabs ── */}
      <div className={styles.leftGroup}>
        <div className={styles.exitGroup}>
          <button className={styles.iconBtn} title="Exit editor" aria-label="Exit editor">
            <ArrowLeftToLine size={16} strokeWidth={1.75} />
          </button>
          <div className={styles.divider} aria-hidden />
        </div>

        <nav className={styles.tabGroup} role="tablist" aria-label="Editor panels">
          {NAV_TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              role="tab"
              aria-selected={state.activePanel === id}
              aria-label={label}
              title={label}
              className={`${styles.tabBtn} ${state.activePanel === id ? styles.tabBtnActive : ''}`}
              onClick={() => set({ activePanel: id })}
            >
              <Icon size={16} strokeWidth={1.75} />
            </button>
          ))}
        </nav>
      </div>

      {/* ── Center: Template name ── */}
      <div className={styles.center}>
        <span className={styles.templateName}>{state.templateName}</span>
      </div>

      {/* ── Right: Undo/Redo + Preview toggle + Save ── */}
      <div className={styles.rightGroup}>

        {/* Undo / Redo — bg-muted pill, gap-2px inside */}
        <div className={styles.undoRedoGroup}>
          <button
            className={styles.iconBtn}
            disabled={!state.canUndo}
            title="Undo"
            aria-label="Undo"
            onClick={() => set({ canUndo: false, canRedo: true })}
          >
            <Undo2 size={16} strokeWidth={1.75} />
          </button>
          <button
            className={styles.iconBtn}
            disabled={!state.canRedo}
            title="Redo"
            aria-label="Redo"
            onClick={() => set({ canRedo: false, canUndo: true })}
          >
            <Redo2 size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Device preview selector — cycles Desktop → Tablet → Mobile */}
        <button
          className={`${styles.iconBtn} ${styles.iconBtnActive}`}
          title={`Switch to ${next.label}`}
          aria-label={`Current: ${current.label}. Click to switch to ${next.label}`}
          onClick={() => set({ previewMode: next.mode })}
        >
          <CycleIcon size={16} strokeWidth={1.75} />
        </button>

        {/* Save */}
        <Button size="sm" aria-label="Save template">Save</Button>
      </div>
    </header>
  );
}
