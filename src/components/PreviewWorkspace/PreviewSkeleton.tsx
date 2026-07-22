import { Skeleton } from '../ds/atoms/Skeleton';
import styles from './PreviewWorkspace.module.css';

/**
 * First-open loading placeholder for the store preview canvas.
 * Built entirely from the design-system Skeleton atom so it mirrors the
 * real store layout (header → hero offer → product grid → CTA → footer).
 */
export default function PreviewSkeleton() {
  return (
    <div className={styles.skeletonSheet} aria-busy="true" aria-label="Loading store preview">
      {/* Header */}
      <div className={styles.skelHeader}>
        <Skeleton variant="circular" width={34} height={34} />
        <div className={styles.skelCol} style={{ flex: 1 }}>
          <Skeleton variant="text" width="52%" height={9} />
          <Skeleton variant="text" width="34%" height={7} />
        </div>
        <Skeleton width={54} height={20} />
        <Skeleton width={42} height={20} />
      </div>

      {/* Hero offer */}
      <Skeleton width="100%" height={132} />

      {/* Title */}
      <div className={styles.skelCenter}>
        <Skeleton variant="text" width={140} height={12} />
      </div>

      {/* Product grid */}
      <div className={styles.skelGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skelCard}>
            <Skeleton width="100%" height={68} />
            <Skeleton variant="text" width="70%" height={8} />
            <Skeleton variant="text" width="45%" height={8} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <Skeleton width="100%" height={40} />

      {/* Footer */}
      <div className={styles.skelFooter}>
        {[56, 72, 44, 64].map((w, i) => (
          <Skeleton key={i} variant="text" width={w} height={8} />
        ))}
      </div>
    </div>
  );
}
