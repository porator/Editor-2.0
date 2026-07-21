import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown,
  Upload, Lock,
} from 'lucide-react';
import { Switch } from '../ds/atoms/Switch';
import { Input } from '../ds/atoms/Input';
import { Slider } from '../ds/atoms/Slider';
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from '../ds/composites/Dropdown';
import {
  Popover, PopoverTrigger, PopoverContent,
} from '../ds/composites/Popover';
import {
  getBlockConfig, isSection, isSubBlock,
  getSubElementRows, getSubElementLabel,
} from './config-data';
import type {
  Control, ConfigRow, SubNode, CssTag, Availability,
} from './config-data';
import styles from './ConfigDrawer.module.css';

/* ── Tag + status color tokens ── */

const TAG_COLORS: Record<CssTag, { bg: string; fg: string }> = {
  Fill:         { bg: '#dbeafe', fg: '#1e40af' },
  Border:       { bg: '#dcfce7', fg: '#166534' },
  Layout:       { bg: '#fef3c7', fg: '#92400e' },
  Typography:   { bg: '#ede9fe', fg: '#5b21b6' },
  Visibility:   { bg: '#f1f5f9', fg: '#475569' },
  Asset:        { bg: '#fce7f3', fg: '#9d174d' },
  'Shadow/FX':  { bg: '#fee2e2', fg: '#991b1b' },
  Behavior:     { bg: '#d1fae5', fg: '#065f46' },
};

const STATUS_COLORS: Record<Availability, { bg: string; fg: string; border: string }> = {
  'UI ready':  { bg: '#f0fdf4', fg: '#166534', border: '#bbf7d0' },
  Partial:     { bg: '#fefce8', fg: '#854d0e', border: '#fde68a' },
  'Not yet':   { bg: '#f8fafc', fg: '#64748b', border: '#e2e8f0' },
  'pAPI only': { bg: '#f5f3ff', fg: '#6d28d9', border: '#ddd6fe' },
  Blocked:     { bg: '#fff1f2', fg: '#be123c', border: '#fecdd3' },
};

function TagChip({ tag }: { tag: CssTag }) {
  const c = TAG_COLORS[tag];
  return (
    <span className={styles.tagChip} style={{ background: c.bg, color: c.fg }}>
      {tag}
    </span>
  );
}

function StatusBadge({ status }: { status: Availability }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className={styles.statusBadge}
      style={{ background: c.bg, color: c.fg, borderColor: c.border }}
    >
      {status}
    </span>
  );
}

/* ── Functional controls ── */

function ToggleControl({ control, disabled }: { control: Control; disabled?: boolean }) {
  const [on, setOn] = useState(Boolean(control.defaultValue));
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{control.label}</span>
      <Switch checked={on} onCheckedChange={setOn} disabled={disabled} />
    </div>
  );
}

const PICKER_COLORS = [
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#0ea5e9',
  '#6366f1',
  '#a855f7',
];

function ColorControl({ control }: { control: Control }) {
  const [color, setColor] = useState(String(control.defaultValue ?? '#e5e5e5'));
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{control.label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={styles.colorSwatch}
            style={{ background: color }}
            aria-label={`${control.label}: ${color}`}
          />
        </PopoverTrigger>
        <PopoverContent side="left" align="start" sideOffset={24} className="w-56">
          <div className="space-y-3">
            <p className="text-sm font-medium">Choose a color</p>
            <div className="grid grid-cols-3 gap-2">
              {PICKER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-full aspect-square rounded-md border-2 transition-colors ${
                    color === c ? 'border-zinc-900' : 'border-[#e5e5e5]'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">Selected: {color}</p>
          </div>
        </PopoverContent>
      </Popover>
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

function renderControl(control: Control, disabled: boolean) {
  switch (control.type) {
    case 'toggle': return <ToggleControl key={control.id} control={control} disabled={disabled} />;
    case 'color':  return <ColorControl  key={control.id} control={control} />;
    case 'range':  return <RangeControl  key={control.id} control={control} />;
    case 'select': return <SelectControl key={control.id} control={control} />;
    case 'text':   return <TextControl   key={control.id} control={control} />;
    case 'upload': return <UploadControl key={control.id} control={control} />;
  }
}

/* ── Config row — name + detail + tags/status + inline controls ── */

function ConfigRowView({ row }: { row: ConfigRow }) {
  const muted = row.avail === 'Not yet' || row.avail === 'pAPI only';
  const blocked = row.avail === 'Blocked';
  const interactive = !blocked && row.avail !== 'Not yet';

  return (
    <div className={`${styles.configRow} ${muted ? styles.rowMuted : ''} ${blocked ? styles.rowBlocked : ''}`}>
      <div className={styles.rowHead}>
        <span className={styles.rowName}>
          {blocked && <Lock size={12} strokeWidth={2} className={styles.lockIcon} />}
          {row.el}
        </span>
      </div>
      <p className={styles.rowDetail}>{row.detail}</p>
      <div className={styles.rowTags}>
        {row.tags.map((t) => <TagChip key={t} tag={t} />)}
        <StatusBadge status={row.avail} />
      </div>
      {interactive && row.controls.length > 0 && (
        <div className={styles.rowControls}>
          {row.controls.map((c) => renderControl(c, blocked))}
        </div>
      )}
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return <div className={styles.sectionHeading}>{label}</div>;
}

/* ── Level panels ── */

function Level1Panel({
  rows, hasSub, onNavigateToSub,
}: {
  rows: ConfigRow[];
  hasSub: boolean;
  onNavigateToSub: () => void;
}) {
  return (
    <>
      <SectionHeading label="BLOCK LAYOUT" />
      {rows.map((row) => <ConfigRowView key={row.id} row={row} />)}
      {hasSub && (
        <button className={styles.subNavEntry} onClick={onNavigateToSub}>
          <span>Sub-element configuration</span>
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      )}
    </>
  );
}

function Level2Panel({ nodes }: { nodes: SubNode[] }) {
  return (
    <>
      <SectionHeading label="SUB-ELEMENT CONFIGURATION" />
      {nodes.map((node, i) =>
        isSection(node)
          ? <SectionHeading key={`s-${i}`} label={node.section} />
          : <ConfigRowView key={node.id} row={node} />
      )}
    </>
  );
}

/* Flat, standalone view for a single selected sub-element. */
function ScopedSubElement({ subId }: { subId: string }) {
  return (
    <>
      {getSubElementRows(subId).map((row) => <ConfigRowView key={row.id} row={row} />)}
    </>
  );
}

/* ── Body-only export for narrow-mode bottomOverride ── */

export function ConfigDrawerBody({ sectionId }: { sectionId: string }) {
  const block = getBlockConfig(sectionId);
  const [level, setLevel] = useState<1 | 2>(1);
  if (!block) return null;

  // A specific sub-element tab → flat, standalone config (no navigation).
  if (isSubBlock(sectionId)) {
    return <ScopedSubElement subId={sectionId} />;
  }

  return level === 1
    ? (
      <Level1Panel
        rows={block.layout}
        hasSub={block.sub.length > 0}
        onNavigateToSub={() => setLevel(2)}
      />
    )
    : (
      <>
        <button className={styles.inlineBack} onClick={() => setLevel(1)}>
          <ChevronLeft size={14} strokeWidth={2} />
          <span>{block.label} layout</span>
        </button>
        <Level2Panel nodes={block.sub} />
      </>
    );
}

/* ── ConfigDrawer shell ── */

interface Props {
  sectionId: string;
  onBack: () => void;
}

export default function ConfigDrawer({ sectionId, onBack }: Props) {
  const block = getBlockConfig(sectionId);
  const scoped = isSubBlock(sectionId);
  const [level, setLevel] = useState<1 | 2>(1);
  if (!block) return null;

  // Title: scoped sub-element → just its name; block Level 2 → "Block → Sub-elements".
  const title = scoped
    ? getSubElementLabel(sectionId)
    : level === 2
      ? <><span className={styles.titleParent}>{block.label}</span> → Sub-elements</>
      : block.label;

  return (
    <div className={styles.drawer}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => (!scoped && level === 2 ? setLevel(1) : onBack())}
          aria-label={!scoped && level === 2 ? 'Back to block layout' : 'Close'}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <span className={styles.title}>{title}</span>
        <button className={styles.menuBtn} aria-label="More options">
          <MoreHorizontal size={16} strokeWidth={1.75} />
        </button>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {scoped
          ? <ScopedSubElement subId={sectionId} />
          : level === 1
            ? (
              <Level1Panel
                rows={block.layout}
                hasSub={block.sub.length > 0}
                onNavigateToSub={() => setLevel(2)}
              />
            )
            : <Level2Panel nodes={block.sub} />}
      </div>
    </div>
  );
}
