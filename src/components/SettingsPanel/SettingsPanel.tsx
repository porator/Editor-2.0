import { useState } from 'react';
import { MoreHorizontal, X } from 'lucide-react';
import { Switch } from '../ds/atoms/Switch';
import { Input } from '../ds/atoms/Input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ds/composites/Dropdown';
import { ChevronDown } from 'lucide-react';
import styles from './SettingsPanel.module.css';

/* ── Sub-controls ── */

function Toggle({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{label}</span>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function SelectField({ label, value: initial }: { label: string; value: string }) {
  const [value] = useState(initial);
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={styles.selectWrap}>
            <span className={styles.selectValue}>{value}</span>
            <ChevronDown size={14} strokeWidth={1.75} className={styles.selectChevron} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px]">
          <DropdownMenuItem>{value}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function RangeField({ label, value, min, max }: { label: string; value: number; min: number; max: number }) {
  const [current, setCurrent] = useState(value);
  const pct = ((current - min) / (max - min)) * 100;
  const trackStyle = {
    background: `linear-gradient(to right, var(--slider-fill) ${pct}%, var(--slider-track) ${pct}%)`,
  };
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldLabelRow}>
        <label className={styles.fieldLabel}>{label}</label>
        <span className={styles.fieldValueMuted}>{current}</span>
      </div>
      <input
        type="range"
        className={styles.range}
        value={current}
        min={min}
        max={max}
        style={trackStyle}
        onChange={(e) => setCurrent(Number(e.target.value))}
      />
    </div>
  );
}

function TextField({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <Input defaultValue={value} />
    </div>
  );
}

function ColorField({ label, color }: { label: string; color: string }) {
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{label}</span>
      <div className={styles.colorSwatch} style={{ background: color }} />
    </div>
  );
}

function Divider() { return <div className={styles.divider} />; }
function SectionHeading({ children }: { children: string }) {
  return <p className={styles.sectionHeading}>{children}</p>;
}

/* ─────────────────────────────────────────────────────
   SettingsPanelBody
   Exported separately so ResizablePanes can host it
   in the bottom pane without duplicating markup.
───────────────────────────────────────────────────── */
export function SettingsPanelBody() {
  return (
    <div className={styles.body}>
      <SectionHeading>Layout</SectionHeading>
      <div className={styles.rangeGroup}>
        <RangeField label="Products to show" value={8} min={2} max={24} />
        <RangeField label="Columns on desktop" value={4} min={1} max={6} />
        <RangeField label="Columns on mobile" value={2} min={1} max={3} />
      </div>
      <Divider />
      <SectionHeading>Content</SectionHeading>
      <TextField label="Heading" value="Featured collection" />
      <SelectField label="Collection" value="All products" />
      <SelectField label="Sort by" value="Best selling" />
      <Divider />
      <SectionHeading>Style</SectionHeading>
      <Toggle label="Show vendor" />
      <Toggle label="Show rating" />
      <Toggle label="Show view all button" defaultOn />
      <ColorField label="Background color" color="#f9fafb" />
      <ColorField label="Text color" color="#18181b" />
      <Divider />
      <SectionHeading>Spacing</SectionHeading>
      <div className={styles.rangeGroup}>
        <RangeField label="Padding top" value={36} min={0} max={100} />
        <RangeField label="Padding bottom" value={36} min={0} max={100} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SettingsPanel — right-dock card shell
   Uses the same card pattern as LeftPanel cards.
───────────────────────────────────────────────────── */
interface Props {
  title: string;
  onClose: () => void;
}

export default function SettingsPanel({ title, onClose }: Props) {
  return (
    <div className={styles.dockPanel}>
      <div className={styles.dockHeader}>
        <span className={styles.dockTitle}>{title}</span>
        <div className={styles.dockActions}>
          <button className={styles.dockBtn} title="More options">
            <MoreHorizontal size={16} strokeWidth={1.75} />
          </button>
          <button className={styles.dockBtn} title="Close" onClick={onClose}>
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div className={styles.dockBody}>
        <SettingsPanelBody />
      </div>
    </div>
  );
}
