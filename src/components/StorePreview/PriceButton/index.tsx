import styles from './PriceButton.module.css';

export interface PriceButtonProps {
  price: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Game-store price CTA. Renders the price centered on a layered green button
 * (dark base + gradient), with hover/pressed/disabled states. Pure CSS —
 * scales to its parent's width. See PriceButton.module.css for design tokens.
 */
export default function PriceButton({ price, onClick, disabled }: PriceButtonProps) {
  return (
    <button
      type="button"
      className={styles.priceButton}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.label}>{price}</span>
    </button>
  );
}
