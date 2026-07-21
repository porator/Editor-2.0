import type { PreviewSectionProps } from '../../types';
import type { PromotionData } from './types';
import styles from './styles';

export default function Promotion({ sectionId, data, isVisible }: PreviewSectionProps<PromotionData>) {
  if (!isVisible) return null;
  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      <div style={styles.card}>
        <div style={styles.title}>{data.title}</div>

        <div style={styles.itemsStrip}>
          {data.items.map((item, i) => (
            <div key={i} style={styles.item}>
              <span style={styles.itemIcon}>{item.icon}</span>
              <span style={styles.itemAmount}>{item.amount}</span>
              {item.oldAmount && <span style={styles.itemOldAmount}>{item.oldAmount}</span>}
            </div>
          ))}
        </div>

        <div style={styles.metaRow}>
          <span>Ends in {data.endsIn}</span>
          <span>Availability {data.availability}</span>
        </div>

        <div style={styles.buyBtn}>
          <span>{data.price}</span>
          {data.oldPrice && <span style={styles.oldPrice}>{data.oldPrice}</span>}
        </div>

        <div style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ ...styles.dot, ...(i === 0 ? styles.dotActive : {}) }} />
          ))}
        </div>
      </div>
    </section>
  );
}
