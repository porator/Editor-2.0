import type { CSSProperties } from 'react';
import Banner from '../StorePreview/sections/Banner';
import Promotion from '../StorePreview/sections/Promotion';
import Bundle from '../StorePreview/sections/Bundle';
import RollingOffer from '../StorePreview/sections/RollingOffer';
import ProgressBar from '../StorePreview/sections/ProgressBar';
import CollectWidget from '../StorePreview/sections/CollectWidget';
import { DEFAULT_PREVIEW_STATE } from '../StorePreview/state';
import { DEFAULT_A2HS_CONFIG } from '../../hooks/useA2HS';

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

/* A2HS shows the persistent Banner template as its preview (static). */
export function AddToHomeScreenPreview() {
  const { banner, ctaText } = DEFAULT_A2HS_CONFIG;
  return (
    <div style={frame}>
      <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', margin: '4px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: banner.bgColor, opacity: banner.opacity / 100 }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px' }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: 'rgba(255,255,255,0.18)' }}>
            {banner.productEmoji}
          </span>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {banner.title && (
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, lineHeight: 1.15 }}>
                {banner.title}
              </span>
            )}
            <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 10, fontWeight: 600, lineHeight: 1.2 }}>
              {banner.richText}
            </span>
          </span>
          <span style={{ padding: '5px 9px', borderRadius: 6, background: banner.ctaBgColor, color: banner.ctaTextColor, fontFamily: banner.ctaFont, fontSize: 9.5, fontWeight: 800, whiteSpace: 'nowrap' }}>
            {ctaText}
          </span>
        </div>
      </div>
    </div>
  );
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
