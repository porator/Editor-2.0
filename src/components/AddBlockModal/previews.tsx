import type { CSSProperties } from 'react';
import Banner from '../StorePreview/sections/Banner';
import Promotion from '../StorePreview/sections/Promotion';
import Bundle from '../StorePreview/sections/Bundle';
import RollingOffer from '../StorePreview/sections/RollingOffer';
import ProgressBar from '../StorePreview/sections/ProgressBar';
import CollectWidget from '../StorePreview/sections/CollectWidget';
import { DEFAULT_PREVIEW_STATE } from '../StorePreview/state';

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

export function ProgressBarPreview() {
  return (
    <div style={frame}>
      <ProgressBar sectionId="preview-progress-bar" data={dataOf('progress-bar')} isVisible />
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

/* Collect-widget blocks reuse the CollectWidget section (Figma 157-2853/8/63). */
function CollectWidgetPreview({ id }: { id: string }) {
  return (
    <div style={{ ...frame, display: 'flex', justifyContent: 'center' }}>
      <CollectWidget sectionId={`preview-${id}`} data={dataOf(id)} isVisible />
    </div>
  );
}

export function RewardCalendarPreview() {
  return <CollectWidgetPreview id="reward-calendar" />;
}

export function DailyBonusPreview() {
  return <CollectWidgetPreview id="daily-bonus" />;
}

export function PopupPreview() {
  return <CollectWidgetPreview id="popup" />;
}

export function CustomBlock1Preview() {
  return <CollectWidgetPreview id="custom-block-1" />;
}

export function CustomBlock2Preview() {
  return <CollectWidgetPreview id="custom-block-2" />;
}

export function CustomBlock3Preview() {
  return <CollectWidgetPreview id="custom-block-3" />;
}

export function CustomBlock4Preview() {
  return <CollectWidgetPreview id="custom-block-4" />;
}

export function CustomBlock5Preview() {
  return <CollectWidgetPreview id="custom-block-5" />;
}
