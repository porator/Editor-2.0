import type { CSSProperties } from 'react';
import Banner from '../StorePreview/sections/Banner';
import Promotion from '../StorePreview/sections/Promotion';
import Bundle from '../StorePreview/sections/Bundle';
import RollingOffer from '../StorePreview/sections/RollingOffer';
import { Widget } from '../StorePreview/Widgets';
import { DEFAULT_PREVIEW_STATE, WIDGETS } from '../StorePreview/state';

/* ── Block previews ──
 * Each block owns its preview. Blocks that exist in the Store Preview
 * reuse the exact same section components (no duplicate UI); the rest
 * compose from the shared section styles. Previews are non-interactive. */

/* Figma (153-3457): previews float directly on the light canvas —
 * no storefront background behind them. */
const frame: CSSProperties = {
  width: '100%',
  pointerEvents: 'none',
};

const dataOf = (id: string) =>
  DEFAULT_PREVIEW_STATE.sections.find((s) => s.id === id)!.data;

export function BannerPreview() {
  return (
    <div style={frame}>
      <Banner sectionId="preview-banner" data={dataOf('banner')} isVisible />
    </div>
  );
}

export function PromotionPreview() {
  return (
    <div style={frame}>
      <Promotion sectionId="preview-promotion" data={dataOf('promotion')} isVisible />
    </div>
  );
}

export function RollingOfferPreview() {
  return (
    <div style={frame}>
      <RollingOffer sectionId="preview-rolling-offer" data={dataOf('rolling-offer')} isVisible />
    </div>
  );
}

export function BundlePreview() {
  return (
    <div style={frame}>
      <Bundle sectionId="preview-bundle" data={dataOf('bundle')} isVisible />
    </div>
  );
}

/* Widget-based blocks reuse the exact floating widget from the Store
 * Preview (Figma 157-2853/8/63), centered on the canvas. */
function WidgetPreview({ widgetId }: { widgetId: string }) {
  const def = WIDGETS.find((w) => w.id === widgetId)!;
  return (
    <div style={{ ...frame, display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
      <Widget def={def} />
    </div>
  );
}

export function RewardCalendarPreview() {
  return <WidgetPreview widgetId="reward-calendar" />;
}

export function DailyBonusPreview() {
  return <WidgetPreview widgetId="daily-bonus" />;
}

export function PopupPreview() {
  return <WidgetPreview widgetId="popup" />;
}
