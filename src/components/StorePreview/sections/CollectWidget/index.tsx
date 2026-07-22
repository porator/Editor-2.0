import type { PreviewSectionProps } from '../../types';
import type { CollectWidgetData } from './types';
import styles from './styles';

/* Reusable "collect" badge as its own stacked section — used by Popup,
 * Reward Calendar, and Daily Bonus (Figma 157-2853/8/63). */
export default function CollectWidget({ sectionId, data, isVisible, bare }: PreviewSectionProps<CollectWidgetData>) {
  if (!isVisible) return null;

  /* Bare: just the widget (data-section-id kept for hover/selection sync),
   * used when a group container provides the shared section boundary. */
  const widget = (
    <div data-section-id={bare ? sectionId : undefined} style={styles.widget}>
      <span style={styles.badge}>{data.icon}</span>
      <span style={styles.cta}>{data.cta}</span>
    </div>
  );
  if (bare) return widget;

  return (
    <section id={sectionId} data-section-id={sectionId} style={styles.root}>
      {widget}
    </section>
  );
}
