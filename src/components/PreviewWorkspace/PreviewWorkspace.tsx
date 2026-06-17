import { PanelTop } from 'lucide-react';
import { Badge } from '../ds/atoms/Badge';
import type { EditorState } from '../../types/editor';
import styles from './PreviewWorkspace.module.css';

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
  activeSection?: string;
  onSectionClick?: (name: string) => void;
}

const MOBILE_CANVAS_WIDTH = 390;

/* Skeleton gallery card — used in the top carousel */
function SkeletonGalleryCard({ size }: { size: 'sm' | 'lg' }) {
  const count = 4;
  return (
    <div className={`${styles.skGalleryCard} ${size === 'lg' ? styles.skGalleryCardLg : styles.skGalleryCardSm}`}>
      <div className={styles.skGalleryBody}>
        <div className={styles.skProductsContainer}>
          <div className={styles.skProductRow}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={styles.skProductItem}>
                <div className={styles.skProductImg} />
                <div className={styles.skProductLabel} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.skCardBtn} />
    </div>
  );
}

/* Skeleton bundle card — single product with text lines, used in the rolling row */
function SkeletonBundleCard({ size }: { size: 'sm' | 'lg' }) {
  return (
    <div className={`${styles.skBundleCard} ${size === 'lg' ? styles.skBundleCardLg : styles.skBundleCardSm}`}>
      <div className={styles.skBundleBody}>
        <div className={styles.skBundleImg} />
        <div className={styles.skBundleLines}>
          <div className={styles.skLine} style={{ width: '100%' }} />
          <div className={styles.skLine} style={{ width: '65%' }} />
        </div>
      </div>
      <div className={styles.skCardBtn} />
    </div>
  );
}

/* Skeleton multi-product bundle card — 4 products in a row */
function SkeletonMultiCard({ size }: { size: 'sm' | 'lg' }) {
  const count = 4;
  return (
    <div className={`${styles.skBundleCard} ${size === 'lg' ? styles.skBundleCardLg : styles.skBundleCardSm}`}>
      <div className={styles.skBundleBody}>
        <div className={styles.skProductRow}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={styles.skProductItem}>
              <div className={styles.skBundleImg} />
              <div className={styles.skProductLabel} style={{ width: i === 0 ? '100%' : '60%' }} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.skCardBtn} />
    </div>
  );
}

/* Chevron SVG for the rolling row */
function ChevronRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.skChevron}>
      <path d="M3.5 2L6.5 5L3.5 8" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Clickable section wrapper with selection outline + label chip */
function SectionBlock({
  name,
  activeSection,
  onSectionClick,
  children,
  className,
}: {
  name: string;
  activeSection?: string;
  onSectionClick?: (name: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const isActive = activeSection === name;
  return (
    <div
      className={`${className ?? ''} ${styles.sectionBlock} ${isActive ? styles.sectionBlockActive : ''}`}
      onClick={() => onSectionClick?.(name)}
    >
      {isActive && <span className={styles.sectionChip}>{name}</span>}
      {children}
    </div>
  );
}

/* White-label skeleton store preview */
function StorePreview({
  mode: _,
  activeSection,
  onSectionClick,
}: {
  mode: 'mobile' | 'desktop';
  activeSection?: string;
  onSectionClick?: (name: string) => void;
}) {
  return (
    <div className={styles.skRoot}>
      {/* Header */}
      <SectionBlock name="Header" activeSection={activeSection} onSectionClick={onSectionClick} className={styles.skHeader}>
        <div className={styles.skHeaderInner}>
          <div className={styles.skHeaderLeft}>
            <div className={styles.skAvatar} />
            <div className={styles.skHeaderLines}>
              <div className={styles.skLine} style={{ width: '100%' }} />
              <div className={styles.skLine} style={{ width: '60%' }} />
            </div>
          </div>
          <div className={styles.skCartBtn} />
        </div>
      </SectionBlock>

      {/* Body */}
      <div className={styles.skBody}>
        {/* Gallery section — 3 cards, center one larger */}
        <SectionBlock name="Promotion" activeSection={activeSection} onSectionClick={onSectionClick} className={styles.skGalleryRow}>
          <SkeletonGalleryCard size="sm" />
          <SkeletonGalleryCard size="lg" />
          <SkeletonGalleryCard size="sm" />
        </SectionBlock>

        {/* Rolling bundles carousel */}
        <SectionBlock name="Rolling bundles" activeSection={activeSection} onSectionClick={onSectionClick} className={styles.skRollingSection}>
          <div className={styles.skRollingRow}>
            <SkeletonBundleCard size="lg" />
            <ChevronRight />
            <SkeletonBundleCard size="sm" />
            <ChevronRight />
            <SkeletonBundleCard size="sm" />
            <ChevronRight />
            <SkeletonBundleCard size="sm" />
            <ChevronRight />
            <SkeletonBundleCard size="sm" />
            <ChevronRight />
            <SkeletonBundleCard size="sm" />
          </div>
        </SectionBlock>

        {/* Multi-product bundles row */}
        <SectionBlock name="Bundles" activeSection={activeSection} onSectionClick={onSectionClick} className={styles.skBundlesRow}>
          <SkeletonMultiCard size="sm" />
          <SkeletonMultiCard size="lg" />
          <SkeletonMultiCard size="sm" />
        </SectionBlock>
      </div>
    </div>
  );
}

export default function PreviewWorkspace({ state, activeSection, onSectionClick }: Props) {
  const isMobile = state.previewMode === 'mobile';

  return (
    /* From Figma: pr-[10px] py-[10px] — no left padding, panel handles its own right edge */
    <div className={styles.workspace}>
      {isMobile ? (
        /* Mobile: centered narrow canvas inside the workspace */
        <div className={styles.mobileFrame}>
          <div
            className={styles.mobileCanvas}
            style={{ width: MOBILE_CANVAS_WIDTH }}
          >
            <Badge className={`${styles.templateBadge} gap-1.5`}>
              <PanelTop size={12} strokeWidth={2} />
              {activeSection ?? state.templateName}
            </Badge>
            <StorePreview mode="mobile" activeSection={activeSection} onSectionClick={onSectionClick} />
          </div>
        </div>
      ) : (
        /* Desktop: canvas fills the full workspace area */
        <div className={styles.desktopFrame}>
          <div className={styles.desktopCanvas}>
            <Badge className={`${styles.templateBadge} gap-1.5`}>
              <PanelTop size={12} strokeWidth={2} />
              {activeSection ?? state.templateName}
            </Badge>
            <div
              className={styles.desktopCanvasInner}
              style={{ transform: `scale(${(state.desktopScale ?? 100) / 100})` }}
            >
              <StorePreview mode="desktop" activeSection={activeSection} onSectionClick={onSectionClick} />
            </div>
          </div>
        </div>
      )}

      <div className={styles.modeChip}>
        <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
        {!isMobile && <span className={styles.modeChipScale}>{state.desktopScale}%</span>}
      </div>
    </div>
  );
}
