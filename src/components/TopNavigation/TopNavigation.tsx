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
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from '../ds/composites/Tooltip';
import styles from './TopNavigation.module.css';

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
}

const NAV_TABS: { id: ActivePanel; icon: React.ElementType; label: string; tooltip: string }[] = [
  { id: 'blocks',          icon: PanelTop,   label: 'Blocks',          tooltip: 'Blocks' },
  { id: 'brandKit',        icon: SwatchBook, label: 'Brand Kit',       tooltip: 'Brand Kit' },
  { id: 'personalization', icon: CodeXml,    label: 'Personalization', tooltip: 'Personalization' },
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
        <TooltipProvider delayDuration={150}>
          <div className={styles.exitGroup}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className={styles.iconBtn} aria-label="Exit editor">
                  <ArrowLeftToLine size={16} strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>Exit</TooltipContent>
            </Tooltip>
            <div className={styles.divider} aria-hidden />
          </div>

          <nav className={styles.tabGroup} role="tablist" aria-label="Editor panels">
            {NAV_TABS.map(({ id, icon: Icon, label, tooltip }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button
                    role="tab"
                    aria-selected={state.activePanel === id}
                    aria-label={label}
                    className={`${styles.tabBtn} ${state.activePanel === id ? styles.tabBtnActive : ''}`}
                    onClick={() => set({ activePanel: id })}
                  >
                    <Icon size={16} strokeWidth={1.75} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>{tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Undo / Redo — bare icon buttons matching the tab icons. */}
          <div className={styles.divider} aria-hidden />
          <div className={styles.undoRedoGroup}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={styles.iconBtn}
                  disabled={!state.canUndo}
                  aria-label="Undo"
                  onClick={() => set({ canUndo: false, canRedo: true })}
                >
                  <Undo2 size={16} strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={styles.iconBtn}
                  disabled={!state.canRedo}
                  aria-label="Redo"
                  onClick={() => set({ canRedo: false, canUndo: true })}
                >
                  <Redo2 size={16} strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>Redo</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* ── Center: Template name ── */}
      <div className={styles.center}>
        <span className={styles.templateName}>{state.templateName}</span>
      </div>

      {/* ── Right: Preview toggle + Save ── */}
      <div className={styles.rightGroup}>

        {/* Device preview selector — cycles Desktop → Tablet → Mobile.
          * Bare icon button, matching the nav tab icons. */}
        <button
          className={styles.iconBtn}
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
