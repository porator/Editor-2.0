import { useState } from 'react';
import {
  ChevronLeft, MoreHorizontal, ChevronDown, ChevronRight,
  Upload,
} from 'lucide-react';
import { Switch } from '../ds/atoms/Switch';
import { Input } from '../ds/atoms/Input';
import { Slider } from '../ds/atoms/Slider';
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from '../ds/composites/Dropdown';
import SECTION_CONFIGS, { SUB_BLOCK_CONFIGS } from './config-data';
import type { Control, Category } from './config-data';
import styles from './ConfigDrawer.module.css';

/* ── Controls ── */

function ToggleControl({ control }: { control: Control }) {
  const [on, setOn] = useState(Boolean(control.defaultValue));
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{control.label}</span>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function ColorControl({ control }: { control: Control }) {
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{control.label}</span>
      <div
        className={styles.colorSwatch}
        style={{ background: String(control.defaultValue ?? '#e5e5e5') }}
      />
    </div>
  );
}

function RangeControl({ control }: { control: Control }) {
  const [val, setVal] = useState(Number(control.defaultValue ?? 0));
  const min = control.min ?? 0;
  const max = control.max ?? 100;
  return (
    <div className={styles.rangeGroup}>
      <div className={styles.rangeLabelRow}>
        <span className={styles.controlLabel}>{control.label}</span>
        <span className={styles.rangeValue}>{val}</span>
      </div>
      <Slider
        value={[val]}
        min={min}
        max={max}
        step={1}
        onValueChange={([v]) => setVal(v)}
      />
    </div>
  );
}

function SelectControl({ control }: { control: Control }) {
  const [val, setVal] = useState(String(control.defaultValue ?? ''));
  const opts = control.options ?? [];
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.controlLabel}>{control.label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={styles.selectTrigger}>
            <span>{val}</span>
            <ChevronDown size={13} strokeWidth={1.75} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          {opts.map((o) => (
            <DropdownMenuItem key={o} onClick={() => setVal(o)}>
              {o}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TextControl({ control }: { control: Control }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.controlLabel}>{control.label}</label>
      <Input defaultValue={String(control.defaultValue ?? '')} />
    </div>
  );
}

function UploadControl({ control }: { control: Control }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.controlLabel}>{control.label}</label>
      <button className={styles.uploadBtn}>
        <Upload size={13} strokeWidth={1.75} />
        <span>Upload</span>
      </button>
    </div>
  );
}

function renderControl(control: Control) {
  switch (control.type) {
    case 'toggle': return <ToggleControl key={control.id} control={control} />;
    case 'color':  return <ColorControl  key={control.id} control={control} />;
    case 'range':  return <RangeControl  key={control.id} control={control} />;
    case 'select': return <SelectControl key={control.id} control={control} />;
    case 'text':   return <TextControl   key={control.id} control={control} />;
    case 'upload': return <UploadControl key={control.id} control={control} />;
  }
}

/* ── Category accordion row ── */

function CategoryGroup({ category, defaultOpen = false }: { category: Category; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.group}>
      <button className={styles.groupHeader} onClick={() => setOpen((v) => !v)}>
        <span className={styles.groupLabel}>{category.label}</span>
        {open
          ? <ChevronDown size={14} strokeWidth={2} className={styles.groupChevron} />
          : <ChevronRight size={14} strokeWidth={2} className={styles.groupChevron} />
        }
      </button>
      {open && (
        <div className={styles.groupBody}>
          {category.controls.map(renderControl)}
        </div>
      )}
    </div>
  );
}

/* ── Body-only export for narrow-mode bottomOverride ── */

export function ConfigDrawerBody({ sectionId }: { sectionId: string }) {
  const config = SECTION_CONFIGS[sectionId] ?? SUB_BLOCK_CONFIGS[sectionId];
  if (!config) return null;
  return (
    <>
      {config.categories.map((cat) => (
        <CategoryGroup key={cat.id} category={cat} />
      ))}
    </>
  );
}

/* ── ConfigDrawer shell ── */

interface Props {
  sectionId: string;
  onBack: () => void;
}

export default function ConfigDrawer({ sectionId, onBack }: Props) {
  const config = SECTION_CONFIGS[sectionId] ?? SUB_BLOCK_CONFIGS[sectionId];
  if (!config) return null;

  return (
    <div className={styles.drawer}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <span className={styles.title}>
          {config.parentLabel
            ? <><span className={styles.titleParent}>{config.parentLabel}</span> → {config.label}</>
            : config.label}
        </span>
        <button className={styles.menuBtn} aria-label="More options">
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {config.categories.map((cat) => (
          <CategoryGroup key={cat.id} category={cat} defaultOpen={true} />
        ))}
      </div>
    </div>
  );
}
