export type ControlType =
  | 'toggle'
  | 'color'
  | 'range'
  | 'select'
  | 'upload'
  | 'text';

export interface Control {
  id: string;
  label: string;
  type: ControlType;
  defaultValue?: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface Category {
  id: string;
  label: string;
  controls: Control[];
}

export interface SectionConfig {
  label: string;
  parentLabel?: string; // set for sub-block configs → shows "Parent → Child" breadcrumb
  categories: Category[];
}

/* ─────────────────────────────────────────────────────────────────
   LEVEL 1 — Block configurations
   Shown when a top-level block (Bundle, Promotion…) is selected
───────────────────────────────────────────────────────────────── */
const SECTION_CONFIGS: Record<string, SectionConfig> = {
  header: {
    label: 'Header',
    categories: [
      {
        id: 'asset',
        label: 'Asset',
        controls: [
          { id: 'logo-upload',       label: 'Logo upload',       type: 'upload' },
          { id: 'player-name-label', label: 'Player name label', type: 'text',  defaultValue: 'Player' },
          { id: 'vip-level-label',   label: 'VIP / Level label', type: 'text',  defaultValue: 'VIP' },
          { id: 'level-icon',        label: 'Level icon image',  type: 'upload' },
        ],
      },
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'bg-opacity', label: 'Background opacity', type: 'range', defaultValue: 100, min: 0, max: 100 },
        ],
      },
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'text-color', label: 'Text color', type: 'color', defaultValue: '#18181b' },
        ],
      },
      {
        id: 'positioning',
        label: 'Positioning',
        controls: [
          { id: 'sticky', label: 'Sticky', type: 'toggle', defaultValue: true },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-logo',           label: 'Show logo',           type: 'toggle', defaultValue: true },
          { id: 'show-player-name',    label: 'Show player name',    type: 'toggle', defaultValue: true },
          { id: 'show-player-id',      label: 'Show player ID',      type: 'toggle', defaultValue: false },
          { id: 'show-player-balance', label: 'Show player balance', type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  /* Add to Home Screen — label/registration only; the drawer routes this id to
   * the bespoke A2HSConfigPanel (live-bound to useA2HS), not these rows. */
  'add-to-home-screen': {
    label: 'Add to Home Screen',
    categories: [
      {
        id: 'positioning',
        label: 'Entry point',
        controls: [
          { id: 'a2hs-template', label: 'Template', type: 'select', defaultValue: 'Banner', options: ['Existing (button)', 'Banner'] },
        ],
      },
    ],
  },

  footer: {
    label: 'Footer',
    categories: [
      {
        id: 'asset',
        label: 'Asset',
        controls: [
          { id: 'footer-img-mobile',  label: 'Footer image — mobile',  type: 'upload' },
          { id: 'footer-img-desktop', label: 'Footer image — desktop', type: 'upload' },
        ],
      },
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'bg-opacity', label: 'Background opacity', type: 'range', defaultValue: 100, min: 0, max: 100 },
        ],
      },
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'text-color', label: 'Text color', type: 'color', defaultValue: '#18181b' },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-branding', label: 'Show Appcharge branding logo', type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  bundle: {
    label: 'Bundle',
    categories: [
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'card-bg',       label: 'Background color', type: 'color',  defaultValue: '#ffffff' },
          { id: 'card-gradient', label: 'Gradient',         type: 'color',  defaultValue: '#f5f3ff' },
          { id: 'card-bg-img',   label: 'Background image', type: 'upload' },
        ],
      },
      {
        id: 'grid-layout',
        label: 'Grid & Layout',
        controls: [
          { id: 'cards-per-row',    label: 'Cards per row',           type: 'range',  defaultValue: 3, min: 1, max: 6 },
          { id: 'layout-preset',    label: 'Layout preset',           type: 'select', options: ['Equal Grid', 'Hero-Left', 'List', 'Single Featured'], defaultValue: 'Equal Grid' },
          { id: 'auto-layout-sku',  label: 'Auto layout by SKU count',type: 'select', options: ['Auto', 'Manual'], defaultValue: 'Auto' },
        ],
      },
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'border-radius', label: 'Card border radius', type: 'range', defaultValue: 12, min: 0, max: 32 },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing & Dimensions',
        controls: [
          { id: 'card-width',  label: 'Width',   type: 'range', defaultValue: 240, min: 160, max: 480 },
          { id: 'card-height', label: 'Height',  type: 'range', defaultValue: 320, min: 200, max: 600 },
          { id: 'padding',     label: 'Padding', type: 'range', defaultValue: 16,  min: 0,   max: 48 },
          { id: 'gap',         label: 'Gap',     type: 'range', defaultValue: 12,  min: 0,   max: 40 },
        ],
      },
      {
        id: 'shadow-effects',
        label: 'Shadow & Effects',
        controls: [
          { id: 'box-shadow', label: 'Box shadow', type: 'toggle', defaultValue: true },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-title',           label: 'Show title',              type: 'toggle', defaultValue: true },
          { id: 'vis-subtitle',        label: 'Show subtitle',           type: 'toggle', defaultValue: true },
          { id: 'vis-description',     label: 'Show description',        type: 'toggle', defaultValue: false },
          { id: 'vis-quantity',        label: 'Show quantity',           type: 'toggle', defaultValue: true },
          { id: 'vis-prefix',          label: 'Show prefix / suffix',    type: 'toggle', defaultValue: false },
          { id: 'vis-sale-label',      label: 'Show sale label',         type: 'toggle', defaultValue: true },
          { id: 'vis-original-price',  label: 'Show original price',     type: 'toggle', defaultValue: true },
          { id: 'vis-price-discount',  label: 'Show price discount',     type: 'toggle', defaultValue: true },
          { id: 'vis-progress-ribbon', label: 'Show progress ribbon',    type: 'toggle', defaultValue: false },
          { id: 'vis-badge',           label: 'Show badge',              type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  promotion: {
    label: 'Promotion',
    categories: [
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'card-bg', label: 'Background color', type: 'color', defaultValue: '#ffffff' },
        ],
      },
      {
        id: 'grid-layout',
        label: 'Grid & Layout',
        controls: [
          { id: 'cards-per-row',   label: 'Cards per row',    type: 'range',  defaultValue: 3, min: 1, max: 6 },
          { id: 'layout-preset',   label: 'Layout preset',    type: 'select', options: ['Equal Grid', 'Hero-Left', 'List', 'Single Featured'], defaultValue: 'Equal Grid' },
          { id: 'gallery-columns', label: 'Gallery columns',  type: 'range',  defaultValue: 3, min: 1, max: 5 },
        ],
      },
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'border-radius', label: 'Card border radius', type: 'range', defaultValue: 12, min: 0, max: 32 },
          { id: 'gallery-width', label: 'Gallery width',      type: 'range', defaultValue: 100, min: 40, max: 100 },
          { id: 'gallery-gap',   label: 'Gallery gap',        type: 'range', defaultValue: 12, min: 0, max: 40 },
        ],
      },
      {
        id: 'gallery',
        label: 'Gallery',
        controls: [
          { id: 'arrow-left-color',  label: 'Left arrow color',   type: 'color',  defaultValue: '#18181b' },
          { id: 'arrow-right-color', label: 'Right arrow color',  type: 'color',  defaultValue: '#18181b' },
          { id: 'show-arrows',       label: 'Show arrows',        type: 'toggle', defaultValue: true },
          { id: 'gallery-spacing',   label: 'Gallery spacing',    type: 'range',  defaultValue: 16, min: 0, max: 64 },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing & Dimensions',
        controls: [
          { id: 'card-width',  label: 'Width',   type: 'range', defaultValue: 240, min: 160, max: 480 },
          { id: 'card-height', label: 'Height',  type: 'range', defaultValue: 320, min: 200, max: 600 },
          { id: 'padding',     label: 'Padding', type: 'range', defaultValue: 16,  min: 0,   max: 48 },
          { id: 'gap',         label: 'Gap',     type: 'range', defaultValue: 12,  min: 0,   max: 40 },
        ],
      },
      {
        id: 'shadow-effects',
        label: 'Shadow & Effects',
        controls: [
          { id: 'box-shadow', label: 'Box shadow', type: 'toggle', defaultValue: true },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-title',           label: 'Show title',           type: 'toggle', defaultValue: true },
          { id: 'vis-subtitle',        label: 'Show subtitle',        type: 'toggle', defaultValue: true },
          { id: 'vis-description',     label: 'Show description',     type: 'toggle', defaultValue: false },
          { id: 'vis-quantity',        label: 'Show quantity',        type: 'toggle', defaultValue: true },
          { id: 'vis-prefix',          label: 'Show prefix / suffix', type: 'toggle', defaultValue: false },
          { id: 'vis-sale-label',      label: 'Show sale label',      type: 'toggle', defaultValue: true },
          { id: 'vis-original-price',  label: 'Show original price',  type: 'toggle', defaultValue: true },
          { id: 'vis-price-discount',  label: 'Show price discount',  type: 'toggle', defaultValue: true },
          { id: 'vis-progress-ribbon', label: 'Show progress ribbon', type: 'toggle', defaultValue: false },
          { id: 'vis-badge',           label: 'Show badge',           type: 'toggle', defaultValue: true },
          { id: 'vis-timer',           label: 'Show timer',           type: 'toggle', defaultValue: true },
          { id: 'vis-availability',    label: 'Show availability',    type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  popup: {
    label: 'Popup Modal',
    categories: [
      {
        id: 'trigger',
        label: 'Trigger',
        controls: [
          {
            id: 'trigger-type',
            label: 'Fires on',
            type: 'select',
            defaultValue: 'Post Purchase',
            options: ['Post Purchase', 'Store Refresh', 'Enter store with home screen icon'],
          },
        ],
      },
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'card-bg', label: 'Background color', type: 'color', defaultValue: '#ffffff' },
        ],
      },
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'border-radius', label: 'Card border radius', type: 'range', defaultValue: 16, min: 0, max: 40 },
          { id: 'card-width',    label: 'Width',              type: 'range', defaultValue: 400, min: 280, max: 600 },
          { id: 'card-height',   label: 'Height',             type: 'range', defaultValue: 520, min: 300, max: 800 },
        ],
      },
      {
        id: 'shadow-effects',
        label: 'Shadow & Effects',
        controls: [
          { id: 'box-shadow', label: 'Box shadow', type: 'toggle', defaultValue: true },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-title',           label: 'Show title',           type: 'toggle', defaultValue: true },
          { id: 'vis-subtitle',        label: 'Show subtitle',        type: 'toggle', defaultValue: true },
          { id: 'vis-description',     label: 'Show description',     type: 'toggle', defaultValue: false },
          { id: 'vis-quantity',        label: 'Show quantity',        type: 'toggle', defaultValue: true },
          { id: 'vis-sale-label',      label: 'Show sale label',      type: 'toggle', defaultValue: true },
          { id: 'vis-original-price',  label: 'Show original price',  type: 'toggle', defaultValue: true },
          { id: 'vis-price-discount',  label: 'Show price discount',  type: 'toggle', defaultValue: true },
          { id: 'vis-badge',           label: 'Show badge',           type: 'toggle', defaultValue: true },
          { id: 'vis-timer',           label: 'Show timer',           type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  store: {
    label: 'Store',
    categories: [
      {
        id: 'asset',
        label: 'Asset',
        controls: [
          { id: 'asset-logos',  label: 'Logos',  type: 'upload' },
          { id: 'asset-fonts',  label: 'Fonts',  type: 'upload' },
          { id: 'asset-badges', label: 'Badges', type: 'upload' },
          { id: 'asset-icons',  label: 'Icons',  type: 'upload' },
        ],
      },
      {
        id: 'background',
        label: 'Background',
        controls: [
          { id: 'bg-mobile',  label: 'Mobile background image',  type: 'upload' },
          { id: 'bg-desktop', label: 'Desktop background image', type: 'upload' },
        ],
      },
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'color-primary',   label: 'Primary',   type: 'color', defaultValue: '#4f46e5' },
          { id: 'color-secondary', label: 'Secondary', type: 'color', defaultValue: '#6366f1' },
          { id: 'color-surface',   label: 'Surface',   type: 'color', defaultValue: '#ffffff' },
          { id: 'color-text',      label: 'Text',      type: 'color', defaultValue: '#18181b' },
          { id: 'color-accent',    label: 'Accent',    type: 'color', defaultValue: '#f59e0b' },
        ],
      },
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'font-family', label: 'Font family', type: 'select', options: ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans'], defaultValue: 'Inter' },
        ],
      },
    ],
  },

  banner: {
    label: 'Banner',
    categories: [
      {
        id: 'asset',
        label: 'Asset',
        controls: [
          { id: 'banner-img-mobile',  label: 'Banner image — mobile',  type: 'upload' },
          { id: 'banner-img-desktop', label: 'Banner image — desktop', type: 'upload' },
          { id: 'banner-link',        label: 'Link URL',               type: 'text',   defaultValue: '' },
        ],
      },
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'banner-height',  label: 'Height',        type: 'range',  defaultValue: 200, min: 80,  max: 480 },
          { id: 'border-radius',  label: 'Border radius', type: 'range',  defaultValue: 12,  min: 0,   max: 32 },
          { id: 'object-fit',     label: 'Object fit',    type: 'select', options: ['Cover', 'Contain', 'Fill'], defaultValue: 'Cover' },
        ],
      },
      {
        id: 'shadow-effects',
        label: 'Shadow & Effects',
        controls: [
          { id: 'box-shadow', label: 'Box shadow', type: 'toggle', defaultValue: false },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-banner', label: 'Show banner', type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  'rolling-offer': {
    label: 'Rolling Offer',
    categories: [
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'card-bg',       label: 'Background color', type: 'color',  defaultValue: '#ffffff' },
          { id: 'card-gradient', label: 'Gradient',         type: 'color',  defaultValue: '#f5f3ff' },
          { id: 'card-bg-img',   label: 'Background image', type: 'upload' },
        ],
      },
      {
        id: 'grid-layout',
        label: 'Grid & Layout',
        controls: [
          { id: 'cards-per-row', label: 'Cards per row',  type: 'range',  defaultValue: 4, min: 2, max: 6 },
          { id: 'scroll-type',   label: 'Scroll type',    type: 'select', options: ['Horizontal scroll', 'Paginated', 'Static grid'], defaultValue: 'Horizontal scroll' },
        ],
      },
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'border-radius', label: 'Card border radius', type: 'range', defaultValue: 12, min: 0, max: 32 },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing & Dimensions',
        controls: [
          { id: 'card-width',  label: 'Width',   type: 'range', defaultValue: 180, min: 120, max: 360 },
          { id: 'card-height', label: 'Height',  type: 'range', defaultValue: 260, min: 160, max: 480 },
          { id: 'padding',     label: 'Padding', type: 'range', defaultValue: 12,  min: 0,   max: 40 },
          { id: 'gap',         label: 'Gap',     type: 'range', defaultValue: 8,   min: 0,   max: 32 },
        ],
      },
      {
        id: 'shadow-effects',
        label: 'Shadow & Effects',
        controls: [
          { id: 'box-shadow', label: 'Box shadow', type: 'toggle', defaultValue: true },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-title',          label: 'Show title',          type: 'toggle', defaultValue: true },
          { id: 'vis-quantity',       label: 'Show quantity',       type: 'toggle', defaultValue: true },
          { id: 'vis-sale-label',     label: 'Show sale label',     type: 'toggle', defaultValue: true },
          { id: 'vis-original-price', label: 'Show original price', type: 'toggle', defaultValue: true },
          { id: 'vis-badge',          label: 'Show badge',          type: 'toggle', defaultValue: true },
          { id: 'vis-timer',          label: 'Show timer',          type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  'reward-calendar': {
    label: 'Reward Calendar',
    categories: [
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'card-bg',    label: 'Background color',          type: 'color',  defaultValue: '#ffffff' },
          { id: 'day-bg',     label: 'Day cell background',       type: 'color',  defaultValue: '#f9fafb' },
          { id: 'claimed-bg', label: 'Claimed day background',    type: 'color',  defaultValue: '#22c55e' },
          { id: 'today-bg',   label: 'Today highlight',           type: 'color',  defaultValue: '#4f46e5' },
        ],
      },
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'calendar-columns', label: 'Columns',          type: 'range',  defaultValue: 7, min: 5, max: 7 },
          { id: 'border-radius',    label: 'Cell border radius',type: 'range',  defaultValue: 8, min: 0, max: 20 },
          { id: 'cell-size',        label: 'Cell size',         type: 'range',  defaultValue: 56, min: 40, max: 96 },
        ],
      },
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'day-font-size',    label: 'Day number size',   type: 'range',  defaultValue: 13, min: 10, max: 20 },
          { id: 'reward-font-size', label: 'Reward label size', type: 'range',  defaultValue: 11, min: 8,  max: 16 },
          { id: 'text-color',       label: 'Text color',        type: 'color',  defaultValue: '#18181b' },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing & Dimensions',
        controls: [
          { id: 'padding', label: 'Padding', type: 'range', defaultValue: 16, min: 0, max: 48 },
          { id: 'gap',     label: 'Gap',     type: 'range', defaultValue: 6,  min: 0, max: 20 },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-header',      label: 'Show header',        type: 'toggle', defaultValue: true },
          { id: 'vis-day-numbers', label: 'Show day numbers',   type: 'toggle', defaultValue: true },
          { id: 'vis-reward-icon', label: 'Show reward icon',   type: 'toggle', defaultValue: true },
          { id: 'vis-reward-qty',  label: 'Show reward qty',    type: 'toggle', defaultValue: true },
          { id: 'vis-claim-btn',   label: 'Show claim button',  type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  'daily-bonus': {
    label: 'Daily Bonus',
    categories: [
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'card-bg',       label: 'Background color', type: 'color',  defaultValue: '#ffffff' },
          { id: 'card-gradient', label: 'Gradient',         type: 'color',  defaultValue: '#fef3c7' },
          { id: 'card-bg-img',   label: 'Background image', type: 'upload' },
        ],
      },
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'border-radius', label: 'Border radius', type: 'range', defaultValue: 16, min: 0, max: 40 },
          { id: 'card-width',    label: 'Width',         type: 'range', defaultValue: 320, min: 240, max: 560 },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing & Dimensions',
        controls: [
          { id: 'padding', label: 'Padding', type: 'range', defaultValue: 24, min: 8, max: 48 },
          { id: 'gap',     label: 'Gap',     type: 'range', defaultValue: 16, min: 0, max: 32 },
        ],
      },
      {
        id: 'shadow-effects',
        label: 'Shadow & Effects',
        controls: [
          { id: 'box-shadow', label: 'Box shadow', type: 'toggle', defaultValue: true },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-title',       label: 'Show title',       type: 'toggle', defaultValue: true },
          { id: 'vis-subtitle',    label: 'Show subtitle',    type: 'toggle', defaultValue: true },
          { id: 'vis-reward-icon', label: 'Show reward icon', type: 'toggle', defaultValue: true },
          { id: 'vis-timer',       label: 'Show timer',       type: 'toggle', defaultValue: true },
          { id: 'vis-claim-btn',   label: 'Show claim button',type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  'player-level': {
    label: 'Player Level',
    categories: [
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'template', label: 'Design template', type: 'select', options: ['Classic', 'Modern', 'Minimal', 'Bold'], defaultValue: 'Classic' },
        ],
      },
    ],
  },
};

export default SECTION_CONFIGS;

/* ─────────────────────────────────────────────────────────────────
   LEVEL 2 — Element / sub-block configurations
   Shown when a child element (Products, Button, Badge…) is selected
   parentLabel is used to render the "Block → Element" breadcrumb
───────────────────────────────────────────────────────────────── */

/* ── Shared category builders ── */

const productsCats = (parentLabel: string): Category[] => [
  {
    id: 'grid-layout',
    label: 'Grid & Layout',
    controls: [
      { id: 'cards-per-row',    label: 'Cards per row',       type: 'range',  defaultValue: 3, min: 1, max: 4 },
      { id: 'layout-preset',    label: 'Layout preset',       type: 'select', options: ['Equal Grid', 'Hero-Left', 'List', 'Single Featured'], defaultValue: 'Equal Grid' },
      { id: 'sku-layout',       label: 'SKU layout behavior', type: 'select', options: ['Auto', 'Manual'], defaultValue: 'Auto' },
    ],
  },
  {
    id: 'product-image',
    label: 'Product Image',
    controls: [
      { id: 'img-upload',  label: 'Image upload',  type: 'upload' },
      { id: 'img-width',   label: 'Width',         type: 'range',  defaultValue: 80,  min: 40, max: 480 },
      { id: 'img-height',  label: 'Height',        type: 'range',  defaultValue: 80,  min: 40, max: 480 },
      { id: 'img-fit',     label: 'Object fit',    type: 'select', options: ['Cover', 'Contain', 'Fill'], defaultValue: 'Cover' },
      { id: 'img-radius',  label: 'Border radius', type: 'range',  defaultValue: 8,   min: 0,  max: 50 },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    controls: [
      { id: 'qty-size',       label: 'Quantity — font size',         type: 'range',  defaultValue: 13, min: 10, max: 24 },
      { id: 'qty-color',      label: 'Quantity — color',             type: 'color',  defaultValue: '#18181b' },
      { id: 'prefix-size',    label: 'Prefix / Suffix — font size',  type: 'range',  defaultValue: 11, min: 10, max: 20 },
      { id: 'prefix-color',   label: 'Prefix / Suffix — color',      type: 'color',  defaultValue: '#6b7280' },
      { id: 'sale-size',      label: 'Sale label — font size',       type: 'range',  defaultValue: 11, min: 10, max: 20 },
      { id: 'sale-color',     label: 'Sale label — color',           type: 'color',  defaultValue: '#ef4444' },
      { id: 'orig-size',      label: 'Original price — font size',   type: 'range',  defaultValue: 12, min: 10, max: 20 },
      { id: 'orig-color',     label: 'Original price — color',       type: 'color',  defaultValue: '#9ca3af' },
      { id: 'disc-size',      label: 'Discount label — font size',   type: 'range',  defaultValue: 12, min: 10, max: 20 },
      { id: 'disc-weight',    label: 'Discount label — weight',      type: 'select', options: ['400', '500', '600', '700'], defaultValue: '600' },
      { id: 'disc-color',     label: 'Discount label — color',       type: 'color',  defaultValue: '#16a34a' },
    ],
  },
  {
    id: 'visibility',
    label: 'Visibility',
    controls: [
      { id: `${parentLabel.toLowerCase()}-vis-qty`,    label: 'Quantity',        type: 'toggle', defaultValue: true },
      { id: `${parentLabel.toLowerCase()}-vis-prefix`, label: 'Prefix / Suffix', type: 'toggle', defaultValue: false },
      { id: `${parentLabel.toLowerCase()}-vis-sale`,   label: 'Sale label',      type: 'toggle', defaultValue: true },
      { id: `${parentLabel.toLowerCase()}-vis-orig`,   label: 'Original price',  type: 'toggle', defaultValue: true },
      { id: `${parentLabel.toLowerCase()}-vis-disc`,   label: 'Discount label',  type: 'toggle', defaultValue: true },
    ],
  },
];

const buttonCats: Category[] = [
  {
    id: 'typography',
    label: 'Typography',
    controls: [
      { id: 'btn-font-size',   label: 'Font size',   type: 'range',  defaultValue: 14, min: 10, max: 24 },
      { id: 'btn-font-weight', label: 'Font weight', type: 'select', options: ['400', '500', '600', '700'], defaultValue: '500' },
      { id: 'btn-text-color',  label: 'Text color',  type: 'color',  defaultValue: '#ffffff' },
    ],
  },
  {
    id: 'color-fill',
    label: 'Color & Fill',
    controls: [
      { id: 'btn-bg',       label: 'Background color', type: 'color', defaultValue: '#4f46e5' },
      { id: 'btn-gradient', label: 'Gradient',         type: 'color', defaultValue: '#6366f1' },
    ],
  },
  {
    id: 'border',
    label: 'Border',
    controls: [
      { id: 'btn-radius',       label: 'Border radius', type: 'range', defaultValue: 8, min: 0, max: 50 },
      { id: 'btn-border-width', label: 'Border width',  type: 'range', defaultValue: 0, min: 0, max: 4 },
      { id: 'btn-border-color', label: 'Border color',  type: 'color', defaultValue: '#e5e5e5' },
    ],
  },
  {
    id: 'spacing',
    label: 'Spacing',
    controls: [
      { id: 'btn-padding',     label: 'Padding',    type: 'range', defaultValue: 10, min: 0,  max: 40 },
      { id: 'btn-width',       label: 'Width',      type: 'range', defaultValue: 160, min: 80, max: 400 },
      { id: 'btn-min-height',  label: 'Min height', type: 'range', defaultValue: 40, min: 24, max: 80 },
    ],
  },
  {
    id: 'shadow-effects',
    label: 'Shadow & Effects',
    controls: [
      { id: 'btn-shadow', label: 'Box shadow',   type: 'toggle', defaultValue: false },
      { id: 'btn-glass',  label: 'Glass effect', type: 'toggle', defaultValue: false },
    ],
  },
];

const badgeCats: Category[] = [
  {
    id: 'badge-system',
    label: 'Badge System',
    controls: [
      { id: 'badge-type',        label: 'Badge type',             type: 'select', options: ['Emblem', 'Ribbon'], defaultValue: 'Emblem' },
      { id: 'badge-image',       label: 'Badge image',            type: 'upload' },
      { id: 'ribbon-text',       label: 'Ribbon text',            type: 'text',   defaultValue: 'Sale' },
      { id: 'ribbon-bg-color',   label: 'Ribbon background color',type: 'color',  defaultValue: '#ef4444' },
      { id: 'ribbon-font-size',  label: 'Ribbon font size',       type: 'range',  defaultValue: 11, min: 8, max: 20 },
      { id: 'ribbon-font-weight',label: 'Ribbon font weight',     type: 'select', options: ['400', '500', '600', '700'], defaultValue: '600' },
      { id: 'ribbon-text-color', label: 'Ribbon text color',      type: 'color',  defaultValue: '#ffffff' },
      { id: 'ribbon-transform',  label: 'Ribbon text transform',  type: 'select', options: ['None', 'Uppercase', 'Lowercase'], defaultValue: 'Uppercase' },
      { id: 'corner-pos',        label: 'Corner position',        type: 'select', options: ['Top left', 'Top right', 'Bottom left', 'Bottom right'], defaultValue: 'Top right' },
    ],
  },
  {
    id: 'positioning',
    label: 'Positioning',
    controls: [
      { id: 'badge-rotation', label: 'Rotation',type: 'range', defaultValue: 0, min: -180, max: 180 },
      { id: 'badge-z-index',  label: 'Z-index', type: 'range', defaultValue: 10, min: 0,   max: 100 },
    ],
  },
  {
    id: 'visibility',
    label: 'Visibility',
    controls: [
      { id: 'show-badge', label: 'Show badge', type: 'toggle', defaultValue: true },
    ],
  },
];

const timerCats: Category[] = [
  {
    id: 'typography',
    label: 'Typography',
    controls: [
      { id: 'timer-font-family', label: 'Font family', type: 'select', options: ['Inter', 'Roboto', 'Monospace'], defaultValue: 'Inter' },
      { id: 'timer-font-size',   label: 'Font size',   type: 'range',  defaultValue: 14, min: 10, max: 32 },
      { id: 'timer-font-weight', label: 'Font weight', type: 'select', options: ['400', '500', '600', '700'], defaultValue: '600' },
      { id: 'timer-color',       label: 'Color',       type: 'color',  defaultValue: '#ffffff' },
    ],
  },
  {
    id: 'color-fill',
    label: 'Color & Fill',
    controls: [
      { id: 'timer-bg', label: 'Timer background color', type: 'color', defaultValue: '#1e1b4b' },
    ],
  },
  {
    id: 'border',
    label: 'Border',
    controls: [
      { id: 'timer-radius', label: 'Border radius', type: 'range', defaultValue: 6, min: 0, max: 50 },
    ],
  },
  {
    id: 'positioning',
    label: 'Positioning',
    controls: [
      { id: 'timer-corner',  label: 'Corner preset', type: 'select', options: ['Top left', 'Top right', 'Bottom left', 'Bottom right'], defaultValue: 'Bottom left' },
      { id: 'timer-z-index', label: 'Z-index',       type: 'range',  defaultValue: 10, min: 0, max: 100 },
    ],
  },
  {
    id: 'timer-display',
    label: 'Timer Display',
    controls: [
      { id: 'timer-format', label: 'Format preset', type: 'select', options: ['HH:MM:SS', 'MM:SS', 'Show seconds near expiry'], defaultValue: 'HH:MM:SS' },
    ],
  },
  {
    id: 'visibility',
    label: 'Visibility',
    controls: [
      { id: 'show-timer', label: 'Show timer', type: 'toggle', defaultValue: true },
    ],
  },
];

export const SUB_BLOCK_CONFIGS: Record<string, SectionConfig> = {

  /* ── Bundle elements ── */
  'bundle-products': {
    label: 'Products',
    parentLabel: 'Bundle',
    categories: productsCats('bundle'),
  },
  'bundle-button': {
    label: 'Button',
    parentLabel: 'Bundle',
    categories: buttonCats,
  },
  'bundle-badge': {
    label: 'Badge',
    parentLabel: 'Bundle',
    categories: badgeCats,
  },

  /* ── Promotion elements ── */
  'promo-products': {
    label: 'Products',
    parentLabel: 'Promotion',
    categories: productsCats('promo'),
  },
  'promo-timer': {
    label: 'Timer',
    parentLabel: 'Promotion',
    categories: timerCats,
  },
  'promo-button': {
    label: 'Button',
    parentLabel: 'Promotion',
    categories: buttonCats,
  },
  'promo-badge': {
    label: 'Badge',
    parentLabel: 'Promotion',
    categories: badgeCats,
  },

  /* ── Popup elements ── */
  'popup-content': {
    label: 'Content',
    parentLabel: 'Popup',
    categories: [
      {
        id: 'typography-title',
        label: 'Offer Title',
        controls: [
          { id: 'title-font-family', label: 'Font family', type: 'select', options: ['Inter', 'Roboto', 'Poppins'], defaultValue: 'Inter' },
          { id: 'title-font-size',   label: 'Font size',   type: 'range',  defaultValue: 20, min: 12, max: 40 },
          { id: 'title-font-weight', label: 'Font weight', type: 'select', options: ['400', '500', '600', '700'], defaultValue: '700' },
          { id: 'title-color',       label: 'Color',       type: 'color',  defaultValue: '#18181b' },
          { id: 'title-align',       label: 'Text align',  type: 'select', options: ['Left', 'Center', 'Right'], defaultValue: 'Center' },
        ],
      },
      {
        id: 'typography-subtitle',
        label: 'Subtitle',
        controls: [
          { id: 'sub-font-size',   label: 'Font size',   type: 'range',  defaultValue: 14, min: 10, max: 24 },
          { id: 'sub-font-weight', label: 'Font weight', type: 'select', options: ['400', '500', '600'], defaultValue: '400' },
          { id: 'sub-color',       label: 'Color',       type: 'color',  defaultValue: '#6b7280' },
        ],
      },
      {
        id: 'typography-description',
        label: 'Description',
        controls: [
          { id: 'desc-font-size',   label: 'Font size',   type: 'range',  defaultValue: 13, min: 10, max: 20 },
          { id: 'desc-font-weight', label: 'Font weight', type: 'select', options: ['400', '500'], defaultValue: '400' },
          { id: 'desc-color',       label: 'Color',       type: 'color',  defaultValue: '#9ca3af' },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-title',       label: 'Show offer title', type: 'toggle', defaultValue: true },
          { id: 'show-subtitle',    label: 'Show subtitle',    type: 'toggle', defaultValue: true },
          { id: 'show-description', label: 'Show description', type: 'toggle', defaultValue: false },
        ],
      },
    ],
  },
  'popup-products': {
    label: 'Products',
    parentLabel: 'Popup',
    categories: productsCats('popup'),
  },
  'popup-timer': {
    label: 'Timer',
    parentLabel: 'Popup',
    categories: timerCats,
  },
  'popup-button': {
    label: 'Button',
    parentLabel: 'Popup',
    categories: buttonCats,
  },
  /* ── Rolling Offer elements ── */
  'rolling-offers': {
    label: 'Offers',
    parentLabel: 'Rolling Offer',
    categories: productsCats('rolling'),
  },
  'rolling-timer': {
    label: 'Timer',
    parentLabel: 'Rolling Offer',
    categories: timerCats,
  },
  'rolling-button': {
    label: 'Button',
    parentLabel: 'Rolling Offer',
    categories: buttonCats,
  },

  /* ── Reward Calendar elements ── */
  'reward-rewards': {
    label: 'Rewards',
    parentLabel: 'Reward Calendar',
    categories: [
      {
        id: 'product-image',
        label: 'Reward Image',
        controls: [
          { id: 'img-width',  label: 'Width',         type: 'range',  defaultValue: 48, min: 24, max: 96 },
          { id: 'img-height', label: 'Height',        type: 'range',  defaultValue: 48, min: 24, max: 96 },
          { id: 'img-fit',    label: 'Object fit',    type: 'select', options: ['Cover', 'Contain', 'Fill'], defaultValue: 'Contain' },
        ],
      },
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'qty-size',  label: 'Quantity — font size', type: 'range', defaultValue: 11, min: 8, max: 18 },
          { id: 'qty-color', label: 'Quantity — color',     type: 'color', defaultValue: '#18181b' },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-qty',  label: 'Show quantity',     type: 'toggle', defaultValue: true },
          { id: 'vis-icon', label: 'Show reward icon',  type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },
  'reward-settings': {
    label: 'Calendar Settings',
    parentLabel: 'Reward Calendar',
    categories: [
      {
        id: 'layout-structure',
        label: 'Layout & Structure',
        controls: [
          { id: 'start-day',  label: 'Start day of week',  type: 'select', options: ['Sunday', 'Monday'], defaultValue: 'Sunday' },
          { id: 'cycle-mode', label: 'Cycle mode',         type: 'select', options: ['Monthly', '30 days rolling', 'Weekly'], defaultValue: 'Monthly' },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-claimed-indicator', label: 'Show claimed indicator', type: 'toggle', defaultValue: true },
          { id: 'vis-locked-days',       label: 'Show locked days',       type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  /* ── Daily Bonus elements ── */
  'bonus-content': {
    label: 'Content',
    parentLabel: 'Daily Bonus',
    categories: [
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'title-size',    label: 'Title font size',    type: 'range',  defaultValue: 20, min: 14, max: 36 },
          { id: 'title-weight',  label: 'Title font weight',  type: 'select', options: ['400', '500', '600', '700'], defaultValue: '700' },
          { id: 'title-color',   label: 'Title color',        type: 'color',  defaultValue: '#18181b' },
          { id: 'sub-size',      label: 'Subtitle font size', type: 'range',  defaultValue: 14, min: 10, max: 24 },
          { id: 'sub-color',     label: 'Subtitle color',     type: 'color',  defaultValue: '#6b7280' },
        ],
      },
      {
        id: 'product-image',
        label: 'Reward Image',
        controls: [
          { id: 'img-width',  label: 'Width',      type: 'range',  defaultValue: 80, min: 40, max: 160 },
          { id: 'img-height', label: 'Height',     type: 'range',  defaultValue: 80, min: 40, max: 160 },
          { id: 'img-fit',    label: 'Object fit', type: 'select', options: ['Cover', 'Contain', 'Fill'], defaultValue: 'Contain' },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'vis-title',       label: 'Show title',        type: 'toggle', defaultValue: true },
          { id: 'vis-subtitle',    label: 'Show subtitle',     type: 'toggle', defaultValue: true },
          { id: 'vis-reward-icon', label: 'Show reward icon',  type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },
  'bonus-timer': {
    label: 'Timer',
    parentLabel: 'Daily Bonus',
    categories: timerCats,
  },
  'bonus-button': {
    label: 'Button',
    parentLabel: 'Daily Bonus',
    categories: buttonCats,
  },

  /* ── Footer elements ── */
  'footer-logo': {
    label: 'Logo',
    parentLabel: 'Footer',
    categories: [
      {
        id: 'asset',
        label: 'Asset',
        controls: [
          { id: 'logo-upload', label: 'Logo image', type: 'upload' },
          { id: 'logo-link',   label: 'Link URL',   type: 'text',   defaultValue: '' },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing',
        controls: [
          { id: 'logo-width',  label: 'Width',  type: 'range', defaultValue: 120, min: 40, max: 320 },
          { id: 'logo-height', label: 'Height', type: 'range', defaultValue: 40,  min: 20, max: 120 },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-logo', label: 'Show logo', type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },
  'footer-nav': {
    label: 'Nav links',
    parentLabel: 'Footer',
    categories: [
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'nav-font-size',   label: 'Font size',   type: 'range',  defaultValue: 13, min: 10, max: 20 },
          { id: 'nav-font-weight', label: 'Font weight', type: 'select', options: ['400', '500', '600'], defaultValue: '400' },
          { id: 'nav-color',       label: 'Link color',  type: 'color',  defaultValue: '#6b7280' },
          { id: 'nav-hover-color', label: 'Hover color', type: 'color',  defaultValue: '#18181b' },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing',
        controls: [
          { id: 'nav-gap', label: 'Gap between links', type: 'range', defaultValue: 16, min: 4, max: 48 },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-nav', label: 'Show nav links', type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  /* ── Header elements ── */
  'logo': {
    label: 'Logo',
    parentLabel: 'Header',
    categories: [
      {
        id: 'asset',
        label: 'Asset',
        controls: [
          { id: 'logo-upload',  label: 'Logo image',        type: 'upload' },
          { id: 'logo-alt',     label: 'Alt text',          type: 'text',   defaultValue: 'Store logo' },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing',
        controls: [
          { id: 'logo-width',  label: 'Width',  type: 'range', defaultValue: 100, min: 40, max: 280 },
          { id: 'logo-height', label: 'Height', type: 'range', defaultValue: 36,  min: 16, max: 96 },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-logo', label: 'Show logo', type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },
  'main-menu': {
    label: 'Menu',
    parentLabel: 'Header',
    categories: [
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'menu-font-size',   label: 'Font size',   type: 'range',  defaultValue: 14, min: 10, max: 20 },
          { id: 'menu-font-weight', label: 'Font weight', type: 'select', options: ['400', '500', '600'], defaultValue: '500' },
          { id: 'menu-color',       label: 'Link color',  type: 'color',  defaultValue: '#18181b' },
          { id: 'menu-active-color',label: 'Active color',type: 'color',  defaultValue: '#4f46e5' },
        ],
      },
      {
        id: 'spacing',
        label: 'Spacing',
        controls: [
          { id: 'menu-gap', label: 'Gap between items', type: 'range', defaultValue: 24, min: 8, max: 64 },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-menu', label: 'Show menu', type: 'toggle', defaultValue: true },
        ],
      },
    ],
  },

  'popup-close': {
    label: 'Close Button',
    parentLabel: 'Popup',
    categories: [
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'close-icon-color', label: 'Icon color', type: 'color', defaultValue: '#18181b' },
          { id: 'close-icon-size',  label: 'Icon size',  type: 'range', defaultValue: 20, min: 12, max: 36 },
        ],
      },
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'close-bg', label: 'Background color', type: 'color', defaultValue: '#ffffff' },
        ],
      },
      {
        id: 'border',
        label: 'Border',
        controls: [
          { id: 'close-radius', label: 'Border radius', type: 'range', defaultValue: 50, min: 0, max: 50 },
        ],
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────
   TWO-LEVEL DRAWER MODEL
   The drawer presents each block across two navigation levels:
     • Level 1 (layout)  — container-level config rows
     • Level 2 (sub)     — sub-element sections + config rows
   Each ConfigRow keeps its functional controls and additionally
   carries `tags` (CSS categories) + `avail` (readiness) metadata.
───────────────────────────────────────────────────────────────── */

export type CssTag =
  | 'Fill' | 'Border' | 'Layout' | 'Typography'
  | 'Visibility' | 'Asset' | 'Shadow/FX' | 'Behavior';

export type Availability =
  | 'UI ready' | 'Partial' | 'Not yet' | 'pAPI only' | 'Blocked';

export interface ConfigRow {
  id: string;
  el: string;          // property / element name, e.g. "Card container"
  detail: string;      // description text
  tags: CssTag[];      // CSS category tags
  avail: Availability; // readiness status
  controls: Control[]; // functional controls (merged from category)
}

export interface SectionNode {
  section: string;     // section heading, e.g. "CARD"
}

export type SubNode = ConfigRow | SectionNode;

export function isSection(node: SubNode): node is SectionNode {
  return 'section' in node;
}

export interface BlockConfig {
  id: string;
  label: string;
  parentLabel?: string;
  layout: ConfigRow[]; // Level 1 rows
  sub: SubNode[];      // Level 2 sections + rows
}

/* Map a category id → its CSS-category tags. Falls back to ['Layout']. */
const CATEGORY_TAGS: Record<string, CssTag[]> = {
  'asset':                 ['Asset'],
  'background':            ['Asset', 'Fill'],
  'color-fill':            ['Fill'],
  'typography':            ['Typography'],
  'typography-title':      ['Typography'],
  'typography-subtitle':   ['Typography'],
  'typography-description':['Typography'],
  'positioning':           ['Layout', 'Visibility'],
  'trigger':               ['Behavior'],
  'visibility':            ['Visibility'],
  'grid-layout':           ['Layout'],
  'layout-structure':      ['Layout', 'Border'],
  'spacing':               ['Layout'],
  'gallery':               ['Layout', 'Behavior'],
  'shadow-effects':        ['Shadow/FX'],
  'border':                ['Border'],
  'product-image':         ['Asset', 'Border', 'Layout'],
  'badge-system':          ['Asset', 'Fill', 'Typography'],
  'timer-display':         ['Behavior'],
};

function tagsForCategory(catId: string): CssTag[] {
  return CATEGORY_TAGS[catId] ?? ['Layout'];
}

/* Build a description string from a category's control labels. */
function detailForCategory(cat: Category): string {
  return cat.controls.map((c) => c.label).join(', ');
}

function rowFromCategory(cat: Category, idPrefix: string): ConfigRow {
  return {
    id: `${idPrefix}-${cat.id}`,
    el: cat.label,
    detail: detailForCategory(cat),
    tags: tagsForCategory(cat.id),
    avail: 'UI ready',
    controls: cat.controls,
  };
}

/* Resolve any selected id (top-level block OR sub-block) to its
   top-level block id, so the drawer always renders the full block. */
export function resolveBlockId(selectedId: string): string {
  if (SECTION_CONFIGS[selectedId]) return selectedId;
  const sub = SUB_BLOCK_CONFIGS[selectedId];
  if (sub?.parentLabel) {
    const parentId = Object.keys(SECTION_CONFIGS)
      .find((k) => SECTION_CONFIGS[k].label === sub.parentLabel);
    if (parentId) return parentId;
  }
  return selectedId;
}

/* True when the selected id refers to a sub-element (Level 2 entry). */
export function isSubBlock(selectedId: string): boolean {
  return Boolean(SUB_BLOCK_CONFIGS[selectedId]);
}

/* Level 2 nodes scoped to a single sub-element (section heading + its rows). */
export function getSubElementNodes(subId: string): SubNode[] {
  const cfg = SUB_BLOCK_CONFIGS[subId];
  if (!cfg) return [];
  const nodes: SubNode[] = [{ section: cfg.label.toUpperCase() }];
  for (const cat of cfg.categories) nodes.push(rowFromCategory(cat, subId));
  return nodes;
}

/* Display label for a sub-element id. */
export function getSubElementLabel(subId: string): string {
  return SUB_BLOCK_CONFIGS[subId]?.label ?? subId;
}

/* Flat config rows for a single sub-element (no section heading). */
export function getSubElementRows(subId: string): ConfigRow[] {
  const cfg = SUB_BLOCK_CONFIGS[subId];
  if (!cfg) return [];
  return cfg.categories.map((cat) => rowFromCategory(cat, subId));
}

/* Derive the two-level BlockConfig for a given selected id. */
export function getBlockConfig(selectedId: string): BlockConfig | null {
  const topId = resolveBlockId(selectedId);
  const block = SECTION_CONFIGS[topId];

  // Sub-block selected but with no top-level parent config — render it alone.
  if (!block) {
    const orphan = SUB_BLOCK_CONFIGS[topId];
    if (!orphan) return null;
    return {
      id: topId,
      label: orphan.label,
      parentLabel: orphan.parentLabel,
      layout: orphan.categories.map((c) => rowFromCategory(c, topId)),
      sub: [],
    };
  }

  const layout = block.categories.map((c) => rowFromCategory(c, topId));

  const sub: SubNode[] = [];
  for (const [sid, scfg] of Object.entries(SUB_BLOCK_CONFIGS)) {
    if (scfg.parentLabel !== block.label) continue;
    sub.push({ section: scfg.label.toUpperCase() });
    for (const cat of scfg.categories) {
      sub.push(rowFromCategory(cat, sid));
    }
  }

  return { id: topId, label: block.label, layout, sub };
}
