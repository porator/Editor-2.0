import type { PreviewSectionProps } from '../../types';
import type { FooterData } from './types';
import styles from './styles';

export default function Footer({ sectionId, data, isVisible }: PreviewSectionProps<FooterData>) {
  if (!isVisible) return null;
  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      <span style={styles.gameName}>{data.gameName}</span>
      <div style={styles.links}>
        {data.links.map((link) => (
          <span key={link} style={styles.link}>{link}</span>
        ))}
      </div>
      <span style={styles.legal}>{data.legal}</span>
    </section>
  );
}
