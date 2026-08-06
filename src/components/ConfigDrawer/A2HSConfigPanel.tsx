import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Upload, ChevronDown, Check, X,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Link as LinkIcon, ListOrdered, Pilcrow, Baseline,
} from 'lucide-react';
import { Switch } from '../ds/atoms/Switch';
import { Input } from '../ds/atoms/Input';
import { Slider } from '../ds/atoms/Slider';
import { Popover, PopoverTrigger, PopoverContent } from '../ds/composites/Popover';
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from '../ds/composites/Dropdown';
import { ColorPicker } from '../ds/color-picker/ColorPicker';
import { useA2HS, DEFAULT_A2HS_CONFIG } from '../../hooks/useA2HS';
import type { A2HSConfig } from '../../hooks/useA2HS';
import styles from './ConfigDrawer.module.css';

/* Bespoke A2HS config surface bound to the useA2HS bridge, so edits are live in
 * the store preview. Reuses the ConfigDrawer.module.css look and DS atoms. */

const FONT_OPTIONS = [
  { label: 'System', value: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { label: 'Serif', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Rounded', value: "ui-rounded, 'SF Pro Rounded', 'Nunito', sans-serif" },
  { label: 'Monospace', value: "ui-monospace, 'SF Mono', Menlo, monospace" },
];

/* Framer-style field: filled muted background, borderless, no shadow. Applied
 * to every DS Input in the panel (overrides the atom's white/bordered base). */
const FIELD_INPUT_CLS = 'bg-[#f5f5f5] border-transparent shadow-none rounded-lg text-xs focus-visible:bg-white';

/* Matching fill for the inline-styled controls (textarea / select / number). */
const FIELD_FILL = '#f5f5f5';

/* Section, Framer-style: a plain dark sentence-case headline over its rows,
 * with a hairline separator between sections. */
function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={sectionWrap}>
      {title && <div style={sectionTitle}>{title}</div>}
      <div style={sectionBody}>{children}</div>
    </div>
  );
}

/* Framer-style row: label sits beside its control. `stack` keeps the label on
 * top for tall controls (textarea / rich-text editor). */
function Field({ label, children, stack = false, style }: {
  label: string; children: ReactNode; stack?: boolean; style?: CSSProperties;
}) {
  if (stack) {
    return (
      <div className={styles.fieldGroup} style={style}>
        <label style={fieldLabel}>{label}</label>
        {children}
      </div>
    );
  }
  return (
    <div style={{ ...fieldRow, ...style }}>
      <label style={fieldLabel}>{label}</label>
      <div style={fieldControl}>{children}</div>
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

/* Framer-style color row: filled field with swatch + hex value + reset ×.
 * Clicking the field opens the picker; × restores the default. */
function ColorField({ label, value, defaultValue, onChange }: {
  label: string; value: string; defaultValue?: string; onChange: (v: string) => void;
}) {
  return (
    <div style={fieldRow}>
      <span style={fieldLabel}>{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" style={colorField.wrap} aria-label={`${label}: ${value}`}>
            <span style={{ ...colorField.swatch, background: value }} />
            <span style={colorField.hex}>{value.startsWith('#') ? value.replace('#', '').toUpperCase() : 'Gradient'}</span>
            {defaultValue && (
              <span
                role="button"
                aria-label={`Reset ${label}`}
                style={colorField.clear}
                onClick={(e) => { e.stopPropagation(); onChange(defaultValue); }}
              >
                <X size={12} strokeWidth={2} />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent side="left" align="start" sideOffset={24} className="w-64">
          <ColorPicker value={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function OpacityField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={fieldRow}>
      <span style={fieldLabel}>Opacity</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <Slider value={[value]} min={0} max={100} step={1} onValueChange={([v]) => onChange(v)} />
        <span className={styles.rangeValue} style={{ flexShrink: 0, width: 26, textAlign: 'right' }}>{value}</span>
      </div>
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

/* Custom font dropdown (replaces the native select, whose open-list highlight
 * is OS-rendered and unstylable) — highlighted/selected rows are indigo-500. */
function FontSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const current = FONT_OPTIONS.find((o) => o.value === value)?.label ?? FONT_OPTIONS[0].label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" style={selectStyle}>
          <span>{current}</span>
          <ChevronDown size={13} strokeWidth={2} style={{ color: '#9ca3af', flexShrink: 0 }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[176px]">
        {FONT_OPTIONS.map((o) => {
          const active = o.value === value;
          return (
            <DropdownMenuItem
              key={o.label}
              className={active
                ? 'bg-[#6366f1] text-white focus:bg-[#6366f1] focus:text-white'
                : 'focus:bg-[#6366f1] focus:text-white'}
              style={{ fontFamily: o.value }}
              onClick={() => onChange(o.value)}
            >
              <span style={{ flex: 1 }}>{o.label}</span>
              {active && <Check size={13} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* Single-image upload control: Upload button ↔ thumbnail with remove. */
function MediaUploadField({ label, value, onChange, helperText }: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
  helperText?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === 'string' ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.fieldGroup}>
      <div style={fieldRow}>
        <label style={fieldLabel}>{label}</label>
        <div style={pimg.row}>
          {value ? (
            <div style={pimg.thumbWrap}>
              <img src={value} alt="" style={pimg.thumb} />
              <button type="button" style={pimg.thumbX} aria-label="Remove image" onClick={() => onChange(undefined)}>
                <X size={11} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button className={styles.uploadBtn} type="button" style={pimg.uploadBtn} onClick={() => inputRef.current?.click()}>
              <Upload size={13} strokeWidth={1.75} />
              <span>Upload</span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
          />
        </div>
      </div>
      {helperText && <p style={helper}>{helperText}</p>}
    </div>
  );
}

function ProductImageField({ emoji, image, onEmoji, onImage }: {
  emoji: string;
  image?: string;
  onEmoji: (v: string) => void;
  onImage: (v: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Uploading media clears the emoji (mutually exclusive).
      onImage(typeof reader.result === 'string' ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.fieldGroup}>
      <div style={fieldRow}>
        <label style={fieldLabel}>Product image</label>
        <div style={pimg.row}>
        {image ? (
          <div style={pimg.thumbWrap}>
            <img src={image} alt="" style={pimg.thumb} />
            <button type="button" style={pimg.thumbX} aria-label="Remove image" onClick={() => onImage(undefined)}>
              <X size={11} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button className={styles.uploadBtn} type="button" style={pimg.uploadBtn} onClick={() => inputRef.current?.click()}>
            <Upload size={13} strokeWidth={1.75} />
            <span>Upload</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Input className={FIELD_INPUT_CLS} value={emoji} onChange={(e) => onEmoji(e.target.value)} placeholder="or emoji 🎁" />
        </div>
        </div>
      </div>
      <p style={helper}>Emoji and uploaded image are mutually exclusive — setting the emoji cancels the upload.</p>
    </div>
  );
}

/* Compact toolbar dropdown (replaces native selects, whose open-list highlight
 * is OS-blue and unstylable) — highlighted rows are indigo-500. */
function ToolbarSelect({ label, options, onOpen, onPick }: {
  label: string;
  options: { label: string; value: string; fontFamily?: string }[];
  onOpen: () => void;
  onPick: (v: string) => void;
}) {
  return (
    <DropdownMenu onOpenChange={(open) => { if (open) onOpen(); }}>
      <DropdownMenuTrigger asChild>
        <button type="button" style={rt.tbSelect} aria-label={label}>
          <span>{label}</span>
          <ChevronDown size={11} strokeWidth={2} style={{ flexShrink: 0, color: '#94a3b8' }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[140px]">
        {options.map((o) => (
          <DropdownMenuItem
            key={o.label}
            className="focus:bg-[#6366f1] focus:text-white"
            style={o.fontFamily ? { fontFamily: o.fontFamily } : undefined}
            onClick={() => onPick(o.value)}
          >
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* Lightweight WYSIWYG editor (contentEditable + execCommand) matching the
 * design-system "Body text" control: format toolbar + font type / font color,
 * with a Dev-mode toggle that swaps to a raw-HTML view. Stores an HTML string. */
function RichTextField({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [devMode, setDevMode] = useState(false);
  const [align, setAlign] = useState<'Left' | 'Center' | 'Right'>('Left');
  const editorRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  // Sync external value in without clobbering the caret while typing.
  useEffect(() => {
    const el = editorRef.current;
    if (el && !devMode && el.innerHTML !== value) el.innerHTML = value;
  }, [value, devMode]);

  const sync = () => onChange(editorRef.current?.innerHTML ?? '');
  const exec = (cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(cmd, false, arg);
    sync();
  };

  /* The toolbar dropdowns move focus into a Radix menu, which can drop the
   * editor's text selection — snapshot it on open, restore before exec. */
  const savedRange = useRef<Range | null>(null);
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };
  const execWithSavedSelection = (cmd: string) => (arg: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    exec(cmd, arg);
  };

  const cycleAlign = () => {
    const next = align === 'Left' ? 'Center' : align === 'Center' ? 'Right' : 'Left';
    setAlign(next);
    exec('justify' + next);
  };
  const insertLink = () => {
    const url = window.prompt('Link URL');
    if (url) exec('createLink', url);
  };
  const insertImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') exec('insertImage', reader.result); };
    reader.readAsDataURL(file);
  };
  const toggleDir = () => {
    const el = editorRef.current;
    if (!el) return;
    el.dir = el.dir === 'rtl' ? 'ltr' : 'rtl';
    sync();
  };

  const AlignIcon = align === 'Center' ? AlignCenter : align === 'Right' ? AlignRight : AlignLeft;

  return (
    <div style={rt.wrap}>
      <div style={rt.topbar}>
        <span style={rt.devLabel}>Dev mode</span>
        <button
          type="button"
          role="switch"
          aria-checked={devMode}
          aria-label="Dev mode"
          style={{ ...rt.toggle, ...(devMode ? rt.toggleOn : null) }}
          onClick={() => setDevMode((d) => !d)}
        >
          <span style={{ ...rt.knob, ...(devMode ? rt.knobOn : null) }} />
        </button>
      </div>

      {!devMode && (
        <div style={rt.toolbar}>
          <button type="button" style={rt.tbBtn} aria-label="Bold" onClick={() => exec('bold')}><Bold size={14} /></button>
          <button type="button" style={rt.tbBtn} aria-label="Italic" onClick={() => exec('italic')}><Italic size={14} /></button>
          <span style={rt.divider} />
          <button type="button" style={rt.tbBtn} aria-label="Align" onClick={cycleAlign}><AlignIcon size={14} /></button>
          <button type="button" style={rt.tbBtn} aria-label="Insert image" onClick={() => imgRef.current?.click()}><ImageIcon size={14} /></button>
          <button type="button" style={rt.tbBtn} aria-label="Insert link" onClick={insertLink}><LinkIcon size={14} /></button>
          <button type="button" style={rt.tbBtn} aria-label="Ordered list" onClick={() => exec('insertOrderedList')}><ListOrdered size={14} /></button>
          <button type="button" style={rt.tbBtn} aria-label="Text direction" onClick={toggleDir}><Pilcrow size={14} /></button>
          <span style={rt.divider} />
          <ToolbarSelect
            label="Font"
            options={FONT_OPTIONS.map((o) => ({ label: o.label, value: o.value, fontFamily: o.value }))}
            onOpen={saveSelection}
            onPick={execWithSavedSelection('fontName')}
          />
          <button type="button" style={rt.tbBtn} aria-label="Font color" onClick={() => colorRef.current?.click()}><Baseline size={14} /></button>
          <ToolbarSelect
            label="H1"
            options={[
              { label: 'Paragraph', value: '<p>' },
              { label: 'Heading 1', value: '<h1>' },
              { label: 'Heading 2', value: '<h2>' },
              { label: 'Heading 3', value: '<h3>' },
            ]}
            onOpen={saveSelection}
            onPick={execWithSavedSelection('formatBlock')}
          />
          <input ref={colorRef} type="color" style={rt.hidden} onChange={(e) => exec('foreColor', e.target.value)} />
          <input ref={imgRef} type="file" accept="image/*" style={rt.hidden} onChange={(e) => { insertImage(e.target.files?.[0]); e.target.value = ''; }} />
        </div>
      )}

      {devMode ? (
        <textarea
          style={{ ...ta, minHeight: 96, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12 }}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : (
        <div
          ref={editorRef}
          className={styles.richEditor}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          style={rt.editor}
          onInput={sync}
        />
      )}
    </div>
  );
}

function UploadStub() {
  return (
    <button className={styles.uploadBtn} type="button" style={{ fontSize: 12 }}>
      <Upload size={13} strokeWidth={1.75} />
      <span>Upload</span>
    </button>
  );
}

export default function A2HSConfigPanel({ scope = 'all' }: { scope?: 'all' | 'entry' | 'popup' }) {
  const { config, setConfig, openInstruction, closeInstruction } = useA2HS();
  const showEntry = scope === 'all' || scope === 'entry';
  // Popup-group sections live solely under the Popup sub-tab.
  const showPopup = scope === 'popup';

  /* Preview follows the selected sub-element: the Popup tab presents the
   * instruction popup in the store; leaving it (Entry point, another block, or
   * closing the drawer) hides it again. The Entry-point banner is unaffected —
   * it stays visible while A2HS is an active offer. */
  useEffect(() => {
    if (scope === 'popup') {
      openInstruction();
      return () => closeInstruction();
    }
    closeInstruction();
  }, [scope, openInstruction, closeInstruction]);
  const set = (patch: Partial<A2HSConfig>) => setConfig((c) => ({ ...c, ...patch }));
  const setBanner = (patch: Partial<A2HSConfig['banner']>) =>
    setConfig((c) => ({ ...c, banner: { ...c.banner, ...patch } }));
  const setInstruction = (patch: Partial<A2HSConfig['instruction']>) =>
    setConfig((c) => ({ ...c, instruction: { ...c.instruction, ...patch } }));
  const setStep = (i: number, patch: Partial<A2HSConfig['instruction']['steps'][number]>) =>
    setConfig((c) => ({
      ...c,
      instruction: {
        ...c.instruction,
        steps: c.instruction.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
      },
    }));
  const setCooldown = (patch: Partial<A2HSConfig['dismissalCooldown']>) =>
    setConfig((c) => ({ ...c, dismissalCooldown: { ...c.dismissalCooldown, ...patch } }));

  return (
    <>
      {/* ── Entry point ── */}
      {/* Entry point renders inline (no collapsible header) — it's the root of
       * the Entry-point sub-element. */}
      {showEntry && (
      <div style={block}>
        {/* Template picker — self-explanatory tabs, no label. */}
        <Segmented
          value={config.template}
          options={[{ value: 'existing', label: 'Button' }, { value: 'banner', label: 'Banner' }]}
          onChange={(v) => set({ template: v })}
        />
      </div>
      )}

      {/* ── Button (floating pill) ── */}
      {showEntry && config.template === 'existing' && (
        <Section title="Button">
          <ColorField
            label="Fill color"
            value={config.buttonBgColor}
            defaultValue={DEFAULT_A2HS_CONFIG.buttonBgColor}
            onChange={(v) => set({ buttonBgColor: v })}
          />
          <Field label="Button text">
            <Input className={FIELD_INPUT_CLS} value={config.ctaText} onChange={(e) => set({ ctaText: e.target.value })} />
          </Field>
        </Section>
      )}

      {/* ── Banner ── */}
      {showEntry && config.template === 'banner' && (
        <Section title="Banner">
            <Field label="Title">
              <Input className={FIELD_INPUT_CLS} value={config.banner.title} onChange={(e) => setBanner({ title: e.target.value })} placeholder="Add to Home Screen" />
            </Field>
            <Field label="Rich text (localized)" stack>
              <TextArea value={config.banner.richText} onChange={(v) => setBanner({ richText: v })} placeholder="Add our store to your home screen…" />
            </Field>
            <ProductImageField
              emoji={config.banner.productEmoji ?? ''}
              image={config.banner.productImage}
              onEmoji={(v) =>
                // A non-empty emoji auto-cancels the uploaded media (mutually exclusive).
                setBanner(v.trim() ? { productEmoji: v, productImage: undefined } : { productEmoji: v })
              }
              onImage={(img) => setBanner({ productImage: img, productEmoji: '' })}
            />
            <ColorField label="Background color" value={config.banner.bgColor} defaultValue={DEFAULT_A2HS_CONFIG.banner.bgColor} onChange={(v) => setBanner({ bgColor: v })} />
            <Field label="Background image"><UploadStub /></Field>
            <OpacityField value={config.banner.opacity} onChange={(v) => setBanner({ opacity: v })} />

            <div style={subHeading}>Add to Home Screen button</div>
            <Field label="Font type">
              <FontSelect value={config.banner.ctaFont} onChange={(v) => setBanner({ ctaFont: v })} />
            </Field>
            <ColorField label="Button color" value={config.banner.ctaBgColor} defaultValue={DEFAULT_A2HS_CONFIG.banner.ctaBgColor} onChange={(v) => setBanner({ ctaBgColor: v })} />
            <ColorField label="Font color" value={config.banner.ctaTextColor} defaultValue={DEFAULT_A2HS_CONFIG.banner.ctaTextColor} onChange={(v) => setBanner({ ctaTextColor: v })} />
            <Field label="CTA button text">
              <Input className={FIELD_INPUT_CLS} value={config.ctaText} onChange={(e) => set({ ctaText: e.target.value })} />
            </Field>
            <MediaUploadField
              label="Dismiss (✕) icon"
              value={config.banner.dismissIcon}
              onChange={(img) => setBanner({ dismissIcon: img })}
              helperText="Replaces the default ✕ close icon."
            />
        </Section>
      )}

      {showPopup && (<>
      {/* ── Instruction popup ── */}
      {/* Presentation picker — its own bordered block, same layout as the
       * Entry point template tabs. */}
      <div style={block}>
        <Segmented
          value={config.instruction.presentation}
          options={[{ value: 'drawer', label: 'Drawer' }, { value: 'inline', label: 'Popup' }]}
          /* Toggling also previews the selected style live in the store. */
          onChange={(v) => { setInstruction({ presentation: v }); openInstruction(); }}
        />
      </div>
      <Section>
        <Field label="Title">
          <Input className={FIELD_INPUT_CLS} value={config.instruction.title} onChange={(e) => setInstruction({ title: e.target.value })} placeholder="Install Store on your Apple Device" />
        </Field>
        <Field label="Description" stack>
          <RichTextField
            value={config.instruction.richText}
            onChange={(v) => setInstruction({ richText: v })}
            placeholder="Stay updated on events and bonuses…"
          />
        </Field>
        <ColorField label="Background color" value={config.instruction.bgColor} defaultValue={DEFAULT_A2HS_CONFIG.instruction.bgColor} onChange={(v) => setInstruction({ bgColor: v })} />
        <Field label="CTA button text">
          <Input className={FIELD_INPUT_CLS} value={config.instruction.ctaText} onChange={(e) => setInstruction({ ctaText: e.target.value })} />
        </Field>

        <div style={subHeading}>Steps</div>
        {config.instruction.steps.map((s, i) => (
          <div key={i} style={stepEditor}>
            <div style={stepEditorTitle}>Step {i + 1}</div>
            <Field label="Text">
              <Input className={FIELD_INPUT_CLS} value={s.text} onChange={(e) => setStep(i, { text: e.target.value })} />
            </Field>
            <MediaUploadField label="Image" value={s.image} onChange={(img) => setStep(i, { image: img })} />
          </div>
        ))}

        <MediaUploadField
          label="Dismiss (✕) icon"
          value={config.instruction.dismissIcon}
          onChange={(img) => setInstruction({ dismissIcon: img })}
          helperText="Replaces the default ✕ close icon."
        />
      </Section>

      {/* ── Completion identity ── */}
      <Section title="Completion identity">
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
      </Section>

      {/* ── Dismissal cooldown ── */}
      <Section title="Dismissal cooldown">
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
      </Section>
      </>)}
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
  borderBottom: '1px solid var(--color-gray-100, #f3f4f6)',
};

/* Framer-style tabs: transparent track, content-width tabs, a soft gray pill
 * on the active tab (no hard border/track). */
const seg = {
  wrap: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    background: 'transparent',
    borderRadius: 8,
    padding: 0,
    gap: 2,
  },
  btn: {
    height: 36,
    padding: '0 12px',
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    background: 'transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 120ms ease, color 120ms ease',
  },
  btnOn: {
    background: '#f3f4f6',
    color: '#4f46e5',
    fontWeight: 700,
  },
} satisfies Record<string, CSSProperties>;

const ta: CSSProperties = {
  width: '100%',
  resize: 'vertical',
  padding: '8px 10px',
  border: '1px solid transparent',
  background: FIELD_FILL,
  borderRadius: 8,
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  lineHeight: 1.4,
  color: 'var(--color-foreground)',
};

const pimg = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  uploadBtn: {
    width: 'auto',
    flexShrink: 0,
    fontSize: 12,
  },
  thumbWrap: {
    position: 'relative',
    flexShrink: 0,
    width: 36,
    height: 36,
  },
  thumb: {
    width: 36,
    height: 36,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid #e5e5e5',
    display: 'block',
  },
  thumbX: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#111827',
    color: '#fff',
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;

const rt = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    border: '1px solid #e5e5e5',
    borderRadius: 10,
    padding: 8,
    background: '#fff',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  devLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--color-gray-500)',
  },
  toggle: {
    position: 'relative',
    width: 34,
    height: 20,
    borderRadius: 999,
    background: '#e5e7eb',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'background 140ms ease',
  },
  toggleOn: {
    background: '#4f46e5',
  },
  knob: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
    transition: 'transform 140ms ease',
  },
  knobOn: {
    transform: 'translateX(14px)',
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 3,
    padding: 4,
    borderRadius: 8,
    background: '#f8fafc',
    border: '1px solid #eef2f7',
  },
  tbBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 26,
    borderRadius: 6,
    color: '#334155',
    cursor: 'pointer',
    background: 'transparent',
  },
  tbSelect: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    height: 26,
    borderRadius: 6,
    border: '1px solid #e2e8f0',
    background: '#fff',
    fontSize: 11,
    fontWeight: 600,
    color: '#334155',
    padding: '0 6px',
    cursor: 'pointer',
  },
  divider: {
    width: 1,
    height: 18,
    background: '#e2e8f0',
    margin: '0 2px',
  },
  editor: {
    minHeight: 80,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #e5e5e5',
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    lineHeight: 1.45,
    color: 'var(--color-foreground)',
    outline: 'none',
    overflowWrap: 'anywhere',
  },
  hidden: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
    pointerEvents: 'none',
  },
} satisfies Record<string, CSSProperties>;

const selectStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  width: '100%',
  height: 36,
  padding: '0 10px',
  border: '1px solid transparent',
  borderRadius: 8,
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  textAlign: 'left',
  color: 'var(--color-foreground)',
  background: FIELD_FILL,
  cursor: 'pointer',
};

/* ── Framer-panel hierarchy ──
 * Dark sentence-case headlines, one hairline between sections, and rows that
 * put the label beside its control. */
const sectionWrap: CSSProperties = {
  borderBottom: '1px solid var(--color-gray-100, #f3f4f6)',
};

const sectionTitle: CSSProperties = {
  padding: '14px 16px 6px',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-foreground)',
};

const sectionBody: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  margin: 10,
  padding: '8px 16px 14px',
};

const colorField = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    height: 36,
    padding: '0 10px 0 6px',
    borderRadius: 8,
    background: FIELD_FILL,
    cursor: 'pointer',
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
    flexShrink: 0,
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
  },
  hex: {
    flex: 1,
    minWidth: 0,
    textAlign: 'left',
    fontFamily: 'var(--font-sans)',
    fontSize: 12,
    color: 'var(--color-foreground)',
  },
  clear: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: '50%',
    color: '#9ca3af',
    flexShrink: 0,
    cursor: 'pointer',
  },
} satisfies Record<string, CSSProperties>;

const fieldRow: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '104px 1fr',
  alignItems: 'center',
  gap: 10,
};

const fieldLabel: CSSProperties = {
  fontSize: 12,
  color: 'var(--color-gray-500)',
  lineHeight: 1.3,
};

const fieldControl: CSSProperties = {
  minWidth: 0,
};

const stepEditor: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 10,
  borderRadius: 10,
  background: '#fafafa',
  border: '1px solid var(--color-gray-100, #f3f4f6)',
};

const stepEditorTitle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-foreground)',
};

const subHeading: CSSProperties = {
  marginTop: 6,
  paddingTop: 12,
  borderTop: '1px solid var(--color-gray-100, #f3f4f6)',
  fontSize: 12.5,
  fontWeight: 700,
  color: 'var(--color-foreground)',
};

const numInput: CSSProperties = {
  width: 56,
  height: 32,
  padding: '0 8px',
  border: '1px solid transparent',
  background: FIELD_FILL,
  borderRadius: 6,
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  color: 'var(--color-foreground)',
};

const helper: CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  lineHeight: 1.45,
  color: 'var(--color-gray-500)',
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
