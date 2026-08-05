import { useEffect, useRef, useState } from 'react';
import { PanelTop } from 'lucide-react';
import type { EditorState } from '../../types/editor';
import WhiteLabelStoreRenderer from '../WhiteLabelPreview/WhiteLabelPreview';
import StorePreview from '../StorePreview/StorePreview';
import A2HSBanner from '../StorePreview/a2hs/A2HSBanner';
import A2HSLayer from '../StorePreview/a2hs/A2HSLayer';
import PreviewSkeleton from './PreviewSkeleton';
import { useFirstOpen } from '../../hooks/useFirstOpen';
import { useGrouping } from '../../hooks/useGrouping';
import styles from './PreviewWorkspace.module.css';

const A2HS_ID = 'add-to-home-screen';

const IMG_W = 1600;
const IMG_H = 1132;

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
  activeSection?: string;
  onSectionClick?: SectionClickHandler;
}

/* Clickable section overlay — transparent hit-target on top of the image */
function SectionOverlay({
  id, name, activeSection, onSectionClick,
  top, height,
}: {
  id: string;
  name: string;
  activeSection?: string;
  onSectionClick?: (id: string, label: string) => void;
  top: string;
  height: string;
}) {
  const isActive = activeSection === id;
  return (
    <div
      className={`${styles.sectionOverlay} ${isActive ? styles.sectionOverlayActive : ''}`}
      style={{ top, height }}
      onClick={() => onSectionClick?.(id, name)}
    >
      {isActive && (
        <span className={styles.sectionChip}>
          <PanelTop size={13} strokeWidth={2} />
          {name}
        </span>
      )}
    </div>
  );
}

type SectionClickHandler = (id: string, label: string) => void;

/* Desktop preview — scales to fill canvas width proportionally */
function GameStoreDesktop({ activeSection, onSectionClick, scale }: {
  activeSection?: string;
  onSectionClick?: SectionClickHandler;
  scale: number;
}) {
  return (
    <div style={{ height: IMG_H * scale, position: 'relative' }}>
      <div
        className={styles.gameImageRoot}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: IMG_W }}
      >
        <img src="/preview-desktop.png" alt="Store preview — desktop" className={styles.gameImage} draggable={false} />
        <SectionOverlay id="header"        name="Header"         top="0%"   height="5.5%"  activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay id="promotion"     name="Promotion"      top="15%"  height="30%"   activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay id="bundle"        name="Bundle"         top="45%"  height="18%"   activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay id="rolling-offer" name="Rolling Offer"  top="63%"  height="24%"   activeSection={activeSection} onSectionClick={onSectionClick} />
      </div>
    </div>
  );
}

/* Mobile preview — dynamic renderer in white label mode, modular StorePreview otherwise */
function GameStoreMobile({ activeSection, onSectionClick, whiteLabel }: {
  activeSection?: string;
  onSectionClick?: SectionClickHandler;
  whiteLabel?: boolean;
}) {
  if (whiteLabel) {
    return (
      <WhiteLabelStoreRenderer
        activeSection={activeSection}
        onSectionClick={onSectionClick}
      />
    );
  }
  return (
    <StorePreview
      activeSection={activeSection}
      onSectionClick={onSectionClick}
    />
  );
}

/* Tablet preview — desktop image scaled inside a 768px frame */
function GameStoreTablet({ activeSection, onSectionClick }: {
  activeSection?: string;
  onSectionClick?: SectionClickHandler;
}) {
  const scale = 768 / IMG_W;
  return (
    <div style={{ height: IMG_H * scale, position: 'relative' }}>
      <div
        className={styles.gameImageRoot}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: IMG_W }}
      >
        <img src="/preview-desktop.png" alt="Store preview — tablet" className={styles.gameImage} draggable={false} />
        <SectionOverlay id="header"        name="Header"        top="0%"  height="5.5%" activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay id="promotion"     name="Promotion"     top="15%" height="30%"  activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay id="bundle"        name="Bundle"        top="45%" height="18%"  activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay id="rolling-offer" name="Rolling Offer" top="63%" height="24%"  activeSection={activeSection} onSectionClick={onSectionClick} />
      </div>
    </div>
  );
}

/* PreviewWorkspace shell */
export default function PreviewWorkspace({ state, activeSection, onSectionClick }: Props) {
  const { previewMode, whiteLabel } = state;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // A2HS only renders in the preview once its block is added to the block tree.
  const { order } = useGrouping();
  const showA2HS = !whiteLabel && order.includes(A2HS_ID);

  // First-time users see the animated skeleton once, for 6s.
  const loading = useFirstOpen(6000);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / IMG_W);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (loading) {
    return (
      <div className={styles.workspace}>
        <div className={styles.skeletonWrap}>
          <PreviewSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.workspace}>
      {previewMode === 'mobile' ? (
        <div className={styles.mobileFrame}>
          <div className={styles.mobileViewport}>
            <div className={styles.mobileCanvas}>
              {showA2HS && <A2HSBanner onSelect={onSectionClick} />}
              <GameStoreMobile activeSection={activeSection} onSectionClick={onSectionClick} whiteLabel={whiteLabel} />
            </div>
            {showA2HS && <A2HSLayer onSelect={onSectionClick} />}
          </div>
        </div>
      ) : previewMode === 'tablet' ? (
        <div className={styles.tabletFrame}>
          <div className={styles.tabletCanvas}>
            <GameStoreTablet activeSection={activeSection} onSectionClick={onSectionClick} />
          </div>
        </div>
      ) : (
        <div className={styles.desktopFrame}>
          <div className={styles.desktopCanvas} ref={canvasRef}>
            <GameStoreDesktop activeSection={activeSection} onSectionClick={onSectionClick} scale={scale} />
          </div>
        </div>
      )}

      {previewMode !== 'mobile' && (
        <div className={styles.modeChip}>
          <span>{{ tablet: 'Tablet', desktop: 'Desktop' }[previewMode]}</span>
          {previewMode === 'desktop' && <span className={styles.modeChipScale}>{Math.round(scale * 100)}%</span>}
          {previewMode === 'tablet'  && <span className={styles.modeChipScale}>768px</span>}
        </div>
      )}
    </div>
  );
}
