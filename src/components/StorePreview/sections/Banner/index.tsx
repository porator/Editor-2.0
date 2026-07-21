import type { PreviewSectionProps } from '../../types';
import type { BannerData } from './types';
import styles from './styles';

export default function Banner({ sectionId, data, isVisible }: PreviewSectionProps<BannerData>) {
  if (!isVisible) return null;
  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoText}>{data.logoLine1}</span>
          <span style={styles.logoText}>{data.logoLine2}</span>
        </div>
        <div style={styles.text}>
          <span style={styles.title}>{data.title}</span>
          <span style={styles.subtitle}>{data.subtitle}</span>
        </div>
      </div>
    </section>
  );
}
