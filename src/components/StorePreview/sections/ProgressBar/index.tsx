import type { PreviewSectionProps } from '../../types';
import type { ProgressBarData } from './types';
import styles from './styles';

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export default function ProgressBar({ sectionId, data, isVisible, bare }: PreviewSectionProps<ProgressBarData>) {
  if (!isVisible) return null;

  const card = (
    <div data-section-id={bare ? sectionId : undefined} style={styles.card}>
      <div style={styles.headerRow}>
        <span style={styles.title}>{data.title}</span>
        <span style={styles.progressLabel}>{data.progressLabel}</span>
      </div>
      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${clamp(data.progress)}%` }} />
      </div>
      <div style={styles.milestones}>
        {data.milestones.map((m, i) => {
          const at = clamp(m.at);
          return (
            <div
              key={i}
              style={{ ...styles.milestone, left: `${at}%`, transform: `translateX(-${at}%)` }}
            >
              <span style={styles.milestoneIcon}>{m.icon}</span>
              <span style={styles.milestoneLabel}>{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (bare) return card;

  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      {card}
    </section>
  );
}
