import { useEffect, useRef, useState } from 'react';
import type { EditorState } from '../../types/editor';
import styles from './PreviewWorkspace.module.css';

const IMG_W = 1600;
const IMG_H = 1132;

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
  activeSection?: string;
  onSectionClick?: (name: string) => void;
}

/* Clickable section overlay — transparent hit-target on top of the image */
function SectionOverlay({
  name, activeSection, onSectionClick,
  top, height,
}: {
  name: string;
  activeSection?: string;
  onSectionClick?: (name: string) => void;
  top: string;
  height: string;
}) {
  const isActive = activeSection === name;
  return (
    <div
      className={`${styles.sectionOverlay} ${isActive ? styles.sectionOverlayActive : ''}`}
      style={{ top, height }}
      onClick={() => onSectionClick?.(name)}
    >
      {isActive && <span className={styles.sectionChip}>{name}</span>}
    </div>
  );
}

/* Desktop preview — scales to fill canvas width proportionally */
function GameStoreDesktop({ activeSection, onSectionClick, scale }: {
  activeSection?: string;
  onSectionClick?: (name: string) => void;
  scale: number;
}) {
  return (
    /* Spacer preserves the correct layout height after transform */
    <div style={{ height: IMG_H * scale, position: 'relative' }}>
      <div
        className={styles.gameImageRoot}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: IMG_W }}
      >
        <img
          src="/preview-desktop.png"
          alt="Store preview — desktop"
          className={styles.gameImage}
          draggable={false}
        />
        {/* Section overlays — percentages of natural image height */}
        <SectionOverlay name="Header"          top="0%"   height="5.5%"  activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay name="Promotion"       top="15%"  height="30%"   activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay name="Bundle"          top="45%"  height="18%"   activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay name="Rolling bundles" top="63%"  height="24%"   activeSection={activeSection} onSectionClick={onSectionClick} />
      </div>
    </div>
  );
}

/* Mobile preview — Figma screenshot with section overlays */
function GameStoreMobile({ activeSection, onSectionClick }: {
  activeSection?: string;
  onSectionClick?: (name: string) => void;
}) {
  return (
    <div className={styles.gameImageRootMobile}>
      <img
        src="/preview-mobile.png"
        alt="Store preview — mobile"
        className={styles.gameImage}
        draggable={false}
      />
      {/* Section overlays — percentages relative to image height (1200px) */}
      <SectionOverlay name="Header"          top="0%"   height="8.5%"  activeSection={activeSection} onSectionClick={onSectionClick} />
      <SectionOverlay name="Promotion"       top="15%"  height="32%"   activeSection={activeSection} onSectionClick={onSectionClick} />
      <SectionOverlay name="Bundle"          top="47%"  height="30%"   activeSection={activeSection} onSectionClick={onSectionClick} />
      <SectionOverlay name="Rolling bundles" top="77%"  height="20%"   activeSection={activeSection} onSectionClick={onSectionClick} />
    </div>
  );
}

/* Tablet preview — desktop image scaled inside a 768px frame */
function GameStoreTablet({ activeSection, onSectionClick }: {
  activeSection?: string;
  onSectionClick?: (name: string) => void;
}) {
  const scale = 768 / IMG_W;
  return (
    <div style={{ height: IMG_H * scale, position: 'relative' }}>
      <div
        className={styles.gameImageRoot}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: IMG_W }}
      >
        <img src="/preview-desktop.png" alt="Store preview — tablet" className={styles.gameImage} draggable={false} />
        <SectionOverlay name="Header"          top="0%"  height="5.5%" activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay name="Promotion"       top="15%" height="30%"  activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay name="Bundle"          top="45%" height="18%"  activeSection={activeSection} onSectionClick={onSectionClick} />
        <SectionOverlay name="Rolling bundles" top="63%" height="24%"  activeSection={activeSection} onSectionClick={onSectionClick} />
      </div>
    </div>
  );
}

/* PreviewWorkspace shell */
export default function PreviewWorkspace({ state, activeSection, onSectionClick }: Props) {
  const { previewMode } = state;
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
            <GameStoreMobile activeSection={activeSection} onSectionClick={onSectionClick} />
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
