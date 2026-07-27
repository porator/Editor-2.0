import type { CSSProperties } from 'react';
import type { PreviewSectionProps } from '../../types';
import type { BundleData } from './types';
import PriceButton from '../../PriceButton';
import Badge from '../../Badge';
import styles from './styles';

export default function Bundle({ sectionId, data, isVisible }: PreviewSectionProps<BundleData>) {
  if (!isVisible) return null;
  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      <div style={styles.card}>
        {data.badgeTopLeft && (
          <div style={styles.badgeSlotTopLeft}>
            <Badge size={52}>
              <span style={styles.badgeSealLabel}>
                {data.badgeTopLeft.split(' ').map((word, i) => (
                  <span key={i} style={styles.badgeSealLine}>{word}</span>
                ))}
              </span>
            </Badge>
          </div>
        )}
        {data.badgeTopRight && (
          <div style={styles.badgeSlotTopRight}>
            <Badge size={48} style={{ '--badge-grad-start': '#F28CFE', '--badge-grad-end': '#9539FB' } as CSSProperties}>
              <span style={{ ...styles.badgeSealLabel, ...styles.badgeSealLabelPurple }}>
                {data.badgeTopRight.split(' ').map((word, i) => (
                  <span key={i} style={styles.badgeSealLine}>{word}</span>
                ))}
              </span>
            </Badge>
          </div>
        )}

        <div style={styles.body}>
          <div style={styles.hero}>
            <span style={styles.heroIcon} />
            <span style={styles.heroAmount}>{data.hero.amount}</span>
            {data.hero.oldAmount && (
              <span style={styles.heroOldAmount}>{data.hero.oldAmount}</span>
            )}
          </div>
          <div style={styles.itemsGrid}>
            {data.items.map((item, i) => (
              <div key={i} style={styles.item}>
                <span style={styles.itemIcon} />
                <span style={styles.itemAmount}>{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <PriceButton price={data.price} />
      </div>
    </section>
  );
}
