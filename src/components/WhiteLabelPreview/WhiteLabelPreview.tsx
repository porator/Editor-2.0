import { PanelTop } from 'lucide-react';
import styles from './WhiteLabelPreview.module.css';

type SectionClickHandler = (id: string, label: string) => void;

function Skel({ w, h = 10, r = 5 }: { w?: number | string; h?: number; r?: number }) {
  return (
    <div className={styles.skel} style={{ width: w ?? '100%', height: h, borderRadius: r }} />
  );
}

/* Crown SVG — wireframe / grayscale style matching Figma skeleton */
function CrownIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* base band */}
      <rect x="3" y="24" width="34" height="9" rx="3" fill="#D0D0D8" />
      {/* crown body */}
      <path d="M3 24 L9 10 L18 19 L20 7 L22 19 L31 10 L37 24 Z" fill="#DCDCE4" />
      {/* gems at peaks */}
      <circle cx="9"  cy="10" r="3" fill="#C4C4CE" />
      <circle cx="20" cy="7"  r="3" fill="#C4C4CE" />
      <circle cx="31" cy="10" r="3" fill="#C4C4CE" />
      {/* base dots */}
      <circle cx="12" cy="28.5" r="1.8" fill="#BCBCC8" />
      <circle cx="20" cy="28.5" r="1.8" fill="#BCBCC8" />
      <circle cx="28" cy="28.5" r="1.8" fill="#BCBCC8" />
    </svg>
  );
}

function PreviewBlock({
  id, label, isSelected, onSelect, children,
}: {
  id: string; label: string; isSelected: boolean;
  onSelect: SectionClickHandler; children: React.ReactNode;
}) {
  return (
    <div
      className={`${styles.block} ${isSelected ? styles.blockSelected : ''}`}
      onClick={(e) => { e.stopPropagation(); onSelect(id, label); }}
    >
      {isSelected && (
        <span className={styles.selectionLabel}>
          <PanelTop size={11} strokeWidth={2} />
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

/* ── Header ── */
function WLHeader({ isSelected, onSelect }: { isSelected: boolean; onSelect: SectionClickHandler }) {
  return (
    <PreviewBlock id="header" label="Header" isSelected={isSelected} onSelect={onSelect}>
      <div className={styles.header}>
        <div className={styles.headerAvatar} />
        <div className={styles.headerInfo}>
          <Skel w="52%" h={9} />
          <Skel w="36%" h={7} />
        </div>
        <div className={styles.headerBalance}>
          <div className={styles.balancePill}>
            <div className={styles.balanceDot} />
            <Skel w={30} h={8} r={4} />
          </div>
          <div className={styles.balancePill}>
            <div className={styles.balanceDot} style={{ background: '#C8C8D2' }} />
            <Skel w={24} h={8} r={4} />
          </div>
        </div>
      </div>
    </PreviewBlock>
  );
}

/* ── Banner ── */
function WLBanner({ isSelected, onSelect }: { isSelected: boolean; onSelect: SectionClickHandler }) {
  return (
    <PreviewBlock id="banner" label="Banner" isSelected={isSelected} onSelect={onSelect}>
      <div className={styles.bannerSection}>
        <div className={styles.bannerCard}>
          <div className={styles.bannerLogo}>
            <div className={styles.bannerLogoInner} />
          </div>
          <div className={styles.bannerText}>
            <Skel w={110} h={13} r={5} />
            <Skel w={90} h={10} r={4} />
          </div>
        </div>
      </div>
    </PreviewBlock>
  );
}

/* Small product item used in promo grid and bundle rows */
function PromoItem() {
  return (
    <div className={styles.promoItem}>
      <div className={styles.promoItemImg} />
      <Skel w={20} h={7} r={3} />
    </div>
  );
}

/* ── Promotion — "Welcome Offer" ── */
function WLPromotion({ isSelected, onSelect }: { isSelected: boolean; onSelect: SectionClickHandler }) {
  return (
    <PreviewBlock id="promotion" label="Promotion" isSelected={isSelected} onSelect={onSelect}>
      <div className={styles.promotionSection}>
        <div className={styles.promotionCard}>
          {/* Title */}
          <div className={styles.promotionTitle}>
            <Skel w={100} h={12} r={6} style={{ margin: '0 auto' }} />
          </div>

          {/* Hero item */}
          <div className={styles.promoHero}>
            <div className={styles.promoHeroImageAlt} />
            <div className={styles.promoHeroPrice}>
              <Skel w={70} h={11} r={4} />
              <Skel w={50} h={8} r={4} />
            </div>
          </div>

          {/* Items grid row 1 */}
          <div className={styles.promoItemsGrid}>
            {[0, 1, 2, 3, 4].map((i) => <PromoItem key={i} />)}
          </div>
          {/* Items grid row 2 */}
          <div className={styles.promoItemsGrid} style={{ justifyContent: 'flex-start', paddingLeft: 4 }}>
            {[0, 1].map((i) => <PromoItem key={i} />)}
          </div>

          {/* Timer row */}
          <div className={styles.promoTimerRow}>
            <Skel w={90} h={8} r={4} />
            <Skel w={70} h={8} r={4} />
          </div>

          {/* Buy button */}
          <div className={styles.buyBtn}>
            <Skel w={40} h={10} r={4} />
          </div>
        </div>
      </div>
    </PreviewBlock>
  );
}

/* Reusable bundle card (hero item left + small grid right + buy button) */
function BundleCard() {
  return (
    <div className={styles.bundleCard}>
      <div className={styles.bundleRow}>
        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div className={styles.bundleHeroImg} />
          <Skel w={44} h={8} r={3} />
          <Skel w={32} h={7} r={3} />
        </div>
        {/* Small items 2×3 */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.bundleSmallItem}>
              <div className={styles.bundleSmallImg} />
              <Skel w={22} h={6} r={3} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buyBtn}>
        <Skel w={40} h={10} r={4} />
      </div>
    </div>
  );
}

/* ── Bundle ── */
function WLBundle({ isSelected, onSelect }: { isSelected: boolean; onSelect: SectionClickHandler }) {
  return (
    <PreviewBlock id="bundle" label="Bundle" isSelected={isSelected} onSelect={onSelect}>
      <div className={styles.bundleSection}>
        <BundleCard />
        <BundleCard />
        <BundleCard />
      </div>
    </PreviewBlock>
  );
}

/* ── Rolling Offer ── */
function WLRollingOffer({ isSelected, onSelect }: { isSelected: boolean; onSelect: SectionClickHandler }) {
  return (
    <PreviewBlock id="rolling-offer" label="Rolling Offer" isSelected={isSelected} onSelect={onSelect}>
      <div className={styles.rollingSection}>
        <BundleCard />
      </div>
    </PreviewBlock>
  );
}

/* ── Footer ── */
function WLFooter({ isSelected, onSelect }: { isSelected: boolean; onSelect: SectionClickHandler }) {
  return (
    <PreviewBlock id="footer" label="Footer" isSelected={isSelected} onSelect={onSelect}>
      <div className={styles.footerSection}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Skel w={80} h={9} />
            <Skel w={60} h={7} />
          </div>
        </div>
        <div className={styles.footerLinks}>
          {[44, 58, 36, 52].map((w, i) => <Skel key={i} w={w} h={8} r={4} />)}
        </div>
      </div>
    </PreviewBlock>
  );
}

/* ── Main renderer ── */
export default function WhiteLabelStoreRenderer({
  activeSection,
  onSectionClick,
}: {
  activeSection?: string;
  onSectionClick?: SectionClickHandler;
}) {
  const sel = (id: string) => activeSection === id;
  const click: SectionClickHandler = (id, label) => onSectionClick?.(id, label);

  return (
    <div className={styles.renderer}>
      <WLHeader       isSelected={sel('header')}       onSelect={click} />
      <WLBanner       isSelected={sel('banner')}       onSelect={click} />
      <WLPromotion    isSelected={sel('promotion')}    onSelect={click} />
      <WLBundle       isSelected={sel('bundle')}       onSelect={click} />
      <WLRollingOffer isSelected={sel('rolling-offer')} onSelect={click} />
      <WLFooter       isSelected={sel('footer')}       onSelect={click} />
    </div>
  );
}
