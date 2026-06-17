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
  'promo-availability': {
    label: 'Availability',
    parentLabel: 'Promotion',
    categories: [
      {
        id: 'typography',
        label: 'Typography',
        controls: [
          { id: 'avail-font-size',   label: 'Font size',   type: 'range',  defaultValue: 12, min: 10, max: 20 },
          { id: 'avail-font-weight', label: 'Font weight', type: 'select', options: ['400', '500', '600'], defaultValue: '500' },
          { id: 'avail-color',       label: 'Color',       type: 'color',  defaultValue: '#ffffff' },
        ],
      },
      {
        id: 'color-fill',
        label: 'Color & Fill',
        controls: [
          { id: 'avail-bg', label: 'Background color', type: 'color', defaultValue: '#22c55e' },
        ],
      },
      {
        id: 'visibility',
        label: 'Visibility',
        controls: [
          { id: 'show-availability', label: 'Show availability indicator', type: 'toggle', defaultValue: true },
        ],
      },
    ],
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
