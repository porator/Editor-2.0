import type { PreviewSectionProps } from '../../types';
import type { HeaderData } from './types';
import styles from './styles';

export default function Header({ sectionId, data, isVisible }: PreviewSectionProps<HeaderData>) {
  if (!isVisible) return null;
  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      <div style={styles.profile}>
        <div style={styles.avatar}>👸</div>
        <div style={styles.playerInfo}>
          <span style={styles.playerName}>{data.playerName}</span>
          <span style={styles.balancePill}>
            <span>🪙</span>
            <span>{data.balance}</span>
          </span>
        </div>
      </div>
      <div style={styles.gameLogo}>
        <span style={styles.gameLogoText}>{data.gameLogoLine1}</span>
        <span style={styles.gameLogoText}>{data.gameLogoLine2}</span>
      </div>
    </section>
  );
}
