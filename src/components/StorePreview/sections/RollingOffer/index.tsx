import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PreviewSectionProps } from '../../types';
import type { RollingOfferData } from './types';
import styles from './styles';

export default function RollingOffer({ sectionId, data, isVisible }: PreviewSectionProps<RollingOfferData>) {
  const [index, setIndex] = useState(0);
  if (!isVisible) return null;

  const count = data.offers.length;
  const offer = data.offers[index];
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      <div style={styles.timerBand}>Ends in {data.endsIn}</div>
      <div style={styles.carousel}>
        <button style={{ ...styles.arrow, left: 4 }} onClick={prev} aria-label="Previous offer">
          <ChevronLeft size={15} strokeWidth={2.5} />
        </button>

        <div style={styles.card}>
          <div style={styles.itemsGrid}>
            {offer.items.map((item, i) => (
              <div key={i} style={styles.item}>
                <span style={styles.itemIcon}>{item.icon}</span>
                <span style={styles.itemAmount}>{item.amount}</span>
              </div>
            ))}
          </div>
          <div style={styles.buyBtn}>
            <span>{offer.price}</span>
            {offer.oldPrice && <span style={styles.oldPrice}>{offer.oldPrice}</span>}
          </div>
          <div style={styles.dots}>
            {data.offers.map((_, i) => (
              <button
                key={i}
                style={{ ...styles.dot, ...(i === index ? styles.dotActive : {}) }}
                onClick={() => setIndex(i)}
                aria-label={`Offer ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button style={{ ...styles.arrow, right: 4 }} onClick={next} aria-label="Next offer">
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}
