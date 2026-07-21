import type { PreviewSectionProps } from '../../types';
import type { BundleData } from './types';
import styles from './styles';

export default function Bundle({ sectionId, data, isVisible }: PreviewSectionProps<BundleData>) {
  if (!isVisible) return null;
  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      <div style={styles.card}>
        {data.badgeTopLeft && (
          <span style={{ ...styles.badge, ...styles.badgeTopLeft }}>{data.badgeTopLeft}</span>
        )}
        {data.badgeTopRight && (
          <span style={{ ...styles.badge, ...styles.badgeTopRight }}>{data.badgeTopRight}</span>
        )}

        <div style={styles.body}>
          <div style={styles.hero}>
            <span style={styles.heroIcon}>{data.hero.icon}</span>
            <span style={styles.heroAmount}>{data.hero.amount}</span>
            {data.hero.oldAmount && (
              <span style={styles.heroOldAmount}>{data.hero.oldAmount}</span>
            )}
          </div>
          <div style={styles.itemsGrid}>
            {data.items.map((item, i) => (
              <div key={i} style={styles.item}>
                <span style={styles.itemIcon}>{item.icon}</span>
                <span style={styles.itemAmount}>{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.buyBtn}>{data.price}</div>
      </div>
    </section>
  );
}
