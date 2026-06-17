import {
  ArrowLeftToLine,
  PanelTop,
  SwatchBook,
  CodeXml,
  Undo2,
  Redo2,
  Laptop,
  Smartphone,
} from 'lucide-react';
import type { EditorState, ActivePanel, PreviewMode } from '../../types/editor';
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

  const togglePreview = () =>
    set({ previewMode: state.previewMode === 'desktop' ? 'mobile' : 'desktop' });

  const PreviewIcon = state.previewMode === 'mobile' ? Smartphone : Laptop;

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

        {/* Single preview toggle — Laptop (desktop) or Smartphone (mobile) */}
        <button
          className={styles.iconBtn}
          title={state.previewMode === 'desktop' ? 'Switch to mobile' : 'Switch to desktop'}
          aria-label={state.previewMode === 'desktop' ? 'Switch to mobile preview' : 'Switch to desktop preview'}
          onClick={togglePreview}
        >
          <PreviewIcon size={16} strokeWidth={1.75} />
        </button>

        {/* Save */}
        <button className={styles.saveBtn} aria-label="Save template">
          Save
        </button>
      </div>
    </header>
  );
}
