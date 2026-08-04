import type { CSSProperties, ReactNode } from 'react';
import { Upload, Gift, ChevronRight, AlertCircle } from 'lucide-react';
import { Switch } from '../ds/atoms/Switch';
import { Input } from '../ds/atoms/Input';
import { Slider } from '../ds/atoms/Slider';
import { Popover, PopoverTrigger, PopoverContent } from '../ds/composites/Popover';
import { useA2HS } from '../../hooks/useA2HS';
import type { A2HSConfig } from '../../hooks/useA2HS';
import styles from './ConfigDrawer.module.css';

/* Bespoke A2HS config surface bound to the useA2HS bridge, so edits are live in
 * the store preview. Reuses the ConfigDrawer.module.css look and DS atoms. */

const PICKER_COLORS = [
  '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#0ea5e9', '#6366f1', '#6d28d9', '#a855f7',
  '#111827', '#ffffff',
];

function Heading({ children }: { children: ReactNode }) {
  return <div className={styles.sectionHeading}>{children}</div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.controlLabel}>{label}</label>
      {children}
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div style={seg.wrap}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          style={{ ...seg.btn, ...(value === o.value ? seg.btnOn : null) }}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className={styles.colorSwatch} style={{ background: value }} aria-label={`${label}: ${value}`} />
        </PopoverTrigger>
        <PopoverContent side="left" align="start" sideOffset={24} className="w-56">
          <div className="space-y-3">
            <p className="text-sm font-medium">Choose a color</p>
            <div className="grid grid-cols-4 gap-2">
              {PICKER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange(c)}
                  className={`w-full aspect-square rounded-md border-2 transition-colors ${value === c ? 'border-zinc-900' : 'border-[#e5e5e5]'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">Selected: {value}</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function OpacityField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className={styles.rangeGroup}>
      <div className={styles.rangeLabelRow}>
        <span className={styles.controlLabel}>Background opacity</span>
        <span className={styles.rangeValue}>{value}</span>
      </div>
      <Slider value={[value]} min={0} max={100} step={1} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

function TextArea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <textarea
      style={ta}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
    />
  );
}

function UploadStub() {
  return (
    <button className={styles.uploadBtn} type="button">
      <Upload size={13} strokeWidth={1.75} />
      <span>Upload</span>
    </button>
  );
}

export default function A2HSConfigPanel() {
  const { config, setConfig } = useA2HS();
  const set = (patch: Partial<A2HSConfig>) => setConfig((c) => ({ ...c, ...patch }));
  const setBanner = (patch: Partial<A2HSConfig['banner']>) =>
    setConfig((c) => ({ ...c, banner: { ...c.banner, ...patch } }));
  const setInstruction = (patch: Partial<A2HSConfig['instruction']>) =>
    setConfig((c) => ({ ...c, instruction: { ...c.instruction, ...patch } }));
  const setCooldown = (patch: Partial<A2HSConfig['dismissalCooldown']>) =>
    setConfig((c) => ({ ...c, dismissalCooldown: { ...c.dismissalCooldown, ...patch } }));

  return (
    <>
      {/* ── Entry point ── */}
      <Heading>Entry point</Heading>
      <div style={block}>
        <div className={styles.controlRow}>
          <span className={styles.controlLabel}>Show entry point</span>
          <Switch checked={config.enabled} onCheckedChange={(v) => set({ enabled: v })} />
        </div>
        <Field label="Template">
          <Segmented
            value={config.template}
            options={[{ value: 'existing', label: 'Existing (button)' }, { value: 'banner', label: 'Banner' }]}
            onChange={(v) => set({ template: v })}
          />
        </Field>
        <Field label="CTA button text">
          <Input value={config.ctaText} onChange={(e) => set({ ctaText: e.target.value })} />
        </Field>
      </div>

      {/* ── Banner ── */}
      {config.template === 'banner' && (
        <>
          <Heading>Banner</Heading>
          <div style={block}>
            <Field label="Rich text (localized)">
              <TextArea value={config.banner.richText} onChange={(v) => setBanner({ richText: v })} placeholder="Add our store to your home screen…" />
            </Field>
            <Field label="Product image (product ID / emoji)">
              <Input value={config.banner.productEmoji ?? ''} onChange={(e) => setBanner({ productEmoji: e.target.value })} placeholder="🎁 or prod_12345" />
            </Field>
            <ColorField label="Background color" value={config.banner.bgColor} onChange={(v) => setBanner({ bgColor: v })} />
            <Field label="Background image (overrides color)"><UploadStub /></Field>
            <OpacityField value={config.banner.opacity} onChange={(v) => setBanner({ opacity: v })} />
          </div>
        </>
      )}

      {/* ── Instruction popup ── */}
      <Heading>Instruction popup</Heading>
      <div style={block}>
        <Field label="Presentation style">
          <Segmented
            value={config.instruction.presentation}
            options={[{ value: 'drawer', label: 'Drawer' }, { value: 'inline', label: 'Popup' }]}
            onChange={(v) => setInstruction({ presentation: v })}
          />
        </Field>
        <Field label="Rich text (localized)">
          <TextArea value={config.instruction.richText} onChange={(v) => setInstruction({ richText: v })} />
        </Field>
        <ColorField label="Background color" value={config.instruction.bgColor} onChange={(v) => setInstruction({ bgColor: v })} />
        <Field label="Background image (overrides color)"><UploadStub /></Field>
        <OpacityField value={config.instruction.opacity} onChange={(v) => setInstruction({ opacity: v })} />
        <Field label="CTA button text">
          <Input value={config.instruction.ctaText} onChange={(e) => setInstruction({ ctaText: e.target.value })} />
        </Field>
      </div>

      {/* ── Reward ── */}
      <Heading>Reward popup</Heading>
      <div style={block}>
        {config.reward.configured ? (
          <button type="button" style={link} onClick={() => { /* would open Popup Offer */ }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Gift size={14} strokeWidth={2} />
              Reward popup configured — edit in Popup Offer
            </span>
            <ChevronRight size={15} strokeWidth={2} />
          </button>
        ) : (
          <div style={callout}>
            <AlertCircle size={15} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1, color: '#b45309' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#92400e' }}>No reward popup configured</div>
              <p style={{ margin: '2px 0 8px', fontSize: 11.5, lineHeight: 1.4, color: '#a16207' }}>
                Players won't get an incentive on their first home-screen entry.
              </p>
              <button type="button" style={calloutBtn} onClick={() => setConfig((c) => ({ ...c, reward: { configured: true } }))}>
                Configure a reward
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Completion identity ── */}
      <Heading>Completion identity</Heading>
      <div style={block}>
        <Radio
          value={config.completionIdentityMode}
          options={[
            { value: 'playerId', label: 'Player ID' },
            { value: 'playerId+deviceId', label: 'Player ID + Device ID' },
          ]}
          onChange={(v) => set({ completionIdentityMode: v })}
        />
        <p style={helper}>
          {config.completionIdentityMode === 'playerId'
            ? 'Suppresses the banner across all of the player’s devices.'
            : 'Suppresses the banner only on the device where the player completed the flow.'}
        </p>
      </div>

      {/* ── Dismissal cooldown ── */}
      <Heading>Dismissal cooldown</Heading>
      <div style={block}>
        <div className={styles.controlRow}>
          <span className={styles.controlLabel}>Re-show banner after dismissal</span>
          <Switch checked={config.dismissalCooldown.enabled} onCheckedChange={(v) => setCooldown({ enabled: v })} />
        </div>
        <div className={styles.controlRow} style={{ opacity: config.dismissalCooldown.enabled ? 1 : 0.45, pointerEvents: config.dismissalCooldown.enabled ? 'auto' : 'none' }}>
          <span className={styles.controlLabel}>Duration</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="number"
              min={1}
              value={config.dismissalCooldown.value}
              onChange={(e) => setCooldown({ value: Math.max(1, Number(e.target.value) || 1) })}
              style={numInput}
            />
            <Segmented
              value={config.dismissalCooldown.unit}
              options={[{ value: 'hours', label: 'Hours' }, { value: 'days', label: 'Days' }]}
              onChange={(v) => setCooldown({ unit: v })}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Radio<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((o) => (
        <button key={o.value} type="button" style={radio.row} onClick={() => onChange(o.value)}>
          <span style={{ ...radio.dot, ...(value === o.value ? radio.dotOn : null) }}>
            {value === o.value && <span style={radio.inner} />}
          </span>
          <span style={radio.label}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Local inline styles (bespoke controls not covered by the module) ── */

const block: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: '14px 16px',
  borderBottom: '1px solid var(--color-border)',
};

const seg = {
  wrap: {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  btn: {
    flex: 1,
    padding: '6px 8px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnOn: {
    background: '#ffffff',
    color: '#111827',
    boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
  },
} satisfies Record<string, CSSProperties>;

const ta: CSSProperties = {
  width: '100%',
  resize: 'vertical',
  padding: '8px 10px',
  border: '1px solid #e5e5e5',
  borderRadius: 8,
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  lineHeight: 1.4,
  color: 'var(--color-foreground)',
};

const numInput: CSSProperties = {
  width: 56,
  height: 32,
  padding: '0 8px',
  border: '1px solid #e5e5e5',
  borderRadius: 6,
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  color: 'var(--color-foreground)',
};

const helper: CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  lineHeight: 1.45,
  color: 'var(--color-gray-500)',
};

const link: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  background: '#f5f3ff',
  color: '#5b21b6',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

const callout: CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: 12,
  borderRadius: 10,
  background: '#fffbeb',
  border: '1px solid #fde68a',
};

const calloutBtn: CSSProperties = {
  padding: '6px 12px',
  borderRadius: 7,
  background: '#f59e0b',
  color: '#fff',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
};

const radio = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    padding: '2px 0',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotOn: {
    borderColor: '#4f46e5',
  },
  inner: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4f46e5',
  },
  label: {
    fontSize: 13,
    color: 'var(--color-foreground)',
  },
} satisfies Record<string, CSSProperties>;
