import { Skeleton } from '../ds/atoms/Skeleton';
import styles from './LeftPanel.module.css';

/** One block-tree row: icon placeholder + label bar. */
function SkelRow({ labelWidth, child = false }: { labelWidth: number; child?: boolean }) {
  return (
    <div className={`${styles.skelRow} ${child ? styles.skelRowChild : ''}`}>
      <Skeleton width={18} height={18} className="rounded-[5px]" />
      <Skeleton variant="text" width={labelWidth} height={9} />
    </div>
  );
}

/**
 * First-open loading placeholder for the sidebar block tree.
 * Mirrors the real tree groups ("Header" + "Offers") using the
 * design-system Skeleton atom, so it animates in sync with the
 * preview skeleton for the first 3 seconds.
 */
export default function BlockTreeSkeleton() {
  return (
    <div className={styles.skelTree} aria-busy="true" aria-label="Loading blocks">
      {/* Header group */}
      <div className={styles.skelGroup}>
        <div className={styles.skelGroupLabel}>
          <Skeleton variant="text" width={54} height={9} />
        </div>
        <SkelRow labelWidth={64} />
      </div>

      {/* Offers group */}
      <div className={styles.skelGroup}>
        <div className={styles.skelGroupLabel}>
          <Skeleton variant="text" width={48} height={9} />
        </div>
        <SkelRow labelWidth={72} />
        <SkelRow labelWidth={88} />
        <SkelRow labelWidth={56} child />
        <SkelRow labelWidth={70} child />
        <SkelRow labelWidth={96} />
        <SkelRow labelWidth={62} />
      </div>
    </div>
  );
}
