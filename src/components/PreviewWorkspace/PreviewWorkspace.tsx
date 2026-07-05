import { useEffect, useRef, useState } from 'react';
import { PanelTop } from 'lucide-react';
import type { EditorState } from '../../types/editor';
import WhiteLabelStoreRenderer from '../WhiteLabelPreview/WhiteLabelPreview';
import styles from './PreviewWorkspace.module.css';

const IMG_W = 1600;
const IMG_H = 1132;

const MOBILE_IMG        = `${import.meta.env.BASE_URL}preview-mobile.jpg.jpg`;
const MOBILE_IMG_WL     = `${import.meta.env.BASE_URL}White label.jpg`;

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

/* Mobile preview — dynamic renderer in white label mode, static image otherwise */
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
    <div className={styles.gameImageRootMobile}>
      <img
        src={MOBILE_IMG}
        alt="Store preview — mobile"
        className={styles.gameImageMobile}
        draggable={false}
      />
      <SectionOverlay id="header"        name="Header"        top="0%"      height="8.5%"   activeSection={activeSection} onSectionClick={onSectionClick} />
      <SectionOverlay id="promotion"     name="Promotion"     top="12.47%"  height="18.90%" activeSection={activeSection} onSectionClick={onSectionClick} />
      <SectionOverlay id="bundle"        name="Bundle"        top="36%"     height="28%"    activeSection={activeSection} onSectionClick={onSectionClick} />
      <SectionOverlay id="rolling-offer" name="Rolling Offer" top="68%"     height="22%"    activeSection={activeSection} onSectionClick={onSectionClick} />
    </div>
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

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / IMG_W);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.workspace}>
      {previewMode === 'mobile' ? (
        <div className={styles.mobileFrame}>
          <div className={styles.mobileCanvas}>
            <GameStoreMobile activeSection={activeSection} onSectionClick={onSectionClick} whiteLabel={whiteLabel} />
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

      <div className={styles.modeChip}>
        <span>{{ mobile: 'Mobile', tablet: 'Tablet', desktop: 'Desktop' }[previewMode]}</span>
        {previewMode === 'desktop' && <span className={styles.modeChipScale}>{Math.round(scale * 100)}%</span>}
        {previewMode === 'tablet'  && <span className={styles.modeChipScale}>768px</span>}
      </div>
    </div>
  );
}
