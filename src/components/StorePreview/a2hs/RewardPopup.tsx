import type { CSSProperties } from 'react';
import { X } from 'lucide-react';
import { useA2HS } from '../../../hooks/useA2HS';
import Badge from '../Badge';
import PriceButton from '../PriceButton';

/* Reward popup fired on the player's first home-screen entry. Reuses the Popup
 * Offer visual language (seal Badge + PriceButton). Per the PRD, dismissing with
 * X grants the reward the same as claiming it, so both paths just close. */

export default function RewardPopup() {
  const { config, runtime, closeReward } = useA2HS();
  if (!runtime.rewardOpen) return null;

  const emoji = config.banner.productEmoji || '🎁';

  return (
    <div style={styles.scrim} onClick={closeReward}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <button type="button" style={styles.close} aria-label="Close" onClick={closeReward}>
          <X size={16} strokeWidth={2.5} />
        </button>

        <div style={styles.badgeWrap}>
          <Badge size={76} style={{ '--badge-grad-start': '#a78bfa', '--badge-grad-end': '#6d28d9' } as CSSProperties}>
            <span style={styles.badgeEmoji}>{emoji}</span>
          </Badge>
        </div>

        <h3 style={styles.title}>Your reward is here!</h3>
        <p style={styles.subtitle}>Thanks for adding us to your home screen. Enjoy your gift.</p>

        <div style={styles.reward}>
          <span style={styles.rewardEmoji}>{emoji}</span>
          <span style={styles.rewardText}>Welcome Bonus ×1</span>
        </div>

        <div style={styles.cta}>
          <PriceButton price="Claim reward" onClick={closeReward} />
        </div>
        <p style={styles.note}>Closing this popup grants the reward too.</p>
      </div>
    </div>
  );
}

const styles = {
  scrim: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 300,
    borderRadius: 20,
    background: 'linear-gradient(180deg, #ffffff 0%, #f4f0ff 100%)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
    padding: '28px 20px 20px',
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: '#6b7280',
    background: 'rgba(0,0,0,0.05)',
    cursor: 'pointer',
  },
  badgeWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeEmoji: {
    fontSize: 30,
    lineHeight: 1,
  },
  title: {
    margin: '0 0 4px',
    fontSize: 18,
    fontWeight: 800,
    color: '#1f2937',
  },
  subtitle: {
    margin: '0 0 16px',
    fontSize: 12.5,
    lineHeight: 1.45,
    color: '#6b7280',
  },
  reward: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 14px',
    marginBottom: 16,
    borderRadius: 12,
    background: '#ffffff',
    boxShadow: 'inset 0 0 0 1px #ece7fb',
  },
  rewardEmoji: {
    fontSize: 22,
    lineHeight: 1,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: 700,
    color: '#4c1d95',
  },
  cta: {
    marginBottom: 8,
  },
  note: {
    margin: 0,
    fontSize: 10.5,
    color: '#9ca3af',
  },
} satisfies Record<string, CSSProperties>;
