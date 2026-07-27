import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  /** Any node: SVG icon, emoji, image, number, or text. */
  children?: ReactNode;
  /** Square size in px. Default 48. */
  size?: number;
  className?: string;
  /** Extra root styles — use to set --badge-grad-start/--badge-grad-end for
   * a themed seal color (e.g. the purple "100% MORE" variant). */
  style?: CSSProperties;
  /** When provided the badge renders as a focusable <button>. */
  onClick?: () => void;
}

/**
 * Decorative "seal" badge built from the provided Figma SVG (gradient +
 * drop/inner shadow preserved via the SVG's own filter). Per the Figma
 * source (node 24443:117): the seal itself is rotated 15° and sized to
 * ~81.65% of the slot (39.192px within a 48px box); the content sits on
 * top, upright, centered in the full slot. Gradient stops come from CSS
 * variables so the seal is themeable — see Badge.module.css.
 */
export default function Badge({ children, size = 48, className, style, onClick }: BadgeProps) {
  /* Unique ids so multiple badges don't collide on the shared filter/gradient. */
  const uid = useId().replace(/:/g, '');
  const filterId = `badge-fx-${uid}`;
  const gradId = `badge-grad-${uid}`;

  const rootClass = [styles.badge, onClick && styles.button, className].filter(Boolean).join(' ');
  const rootStyle = { '--badge-size': `${size}px`, ...style } as CSSProperties;

  const inner = (
    <>
      <span className={styles.sealWrap}>
        <svg
          className={styles.shape}
          viewBox="-0.41 -2.55 46 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
        <g filter={`url(#${filterId})`}>
          <path
            d="M41.5185 24.5169C41.1949 25.7246 39.2433 26.3158 38.7106 27.3933C38.1573 28.5077 38.8786 30.4092 38.1414 31.3788C37.3889 32.3656 35.3663 32.1525 34.4404 32.9549C33.5119 33.7671 33.4454 35.7971 32.3884 36.4158C31.3214 37.0318 29.5328 36.0644 28.3651 36.4625C27.21 36.8532 26.3733 38.7087 25.1497 38.8795C23.9414 39.0332 22.6625 37.4703 21.4135 37.3797C20.2041 37.2997 18.7263 38.6969 17.5185 38.3733C16.3108 38.0497 15.7196 36.0981 14.6421 35.5653C13.5277 35.0121 11.6262 35.7334 10.6566 34.9961C9.66984 34.2436 9.88286 32.2211 9.08052 31.2952C8.26828 30.3666 6.23827 30.3002 5.61961 29.2431C5.00361 28.1762 5.97095 26.3875 5.57294 25.2199C5.18216 24.0647 3.32671 23.228 3.15586 22.0045C3.00216 20.7961 4.56505 19.5172 4.65567 18.2683C4.73568 17.0589 3.3385 15.581 3.66212 14.3733C3.98574 13.1655 5.93731 12.5743 6.47006 11.4969C7.02331 10.3825 6.30201 8.48093 7.03929 7.51133C7.79177 6.52458 9.81434 6.73761 10.7402 5.93526C11.6688 5.12302 11.7352 3.09301 12.7923 2.47436C13.8592 1.85836 15.6478 2.8257 16.8155 2.42768C17.9707 2.03691 18.8074 0.181452 20.0309 0.0106068C21.2393 -0.143092 22.5182 1.41979 23.7671 1.51041C24.9765 1.59042 26.4544 0.193246 27.6621 0.516865C28.8699 0.840484 29.4611 2.79205 30.5385 3.3248C31.6529 3.87805 33.5545 3.15676 34.5241 3.89403C35.5108 4.64651 35.2978 6.66908 36.1001 7.59497C36.9124 8.52351 38.9424 8.58998 39.561 9.64702C40.177 10.714 39.2097 12.5026 39.6077 13.6703C39.9985 14.8254 41.8539 15.6621 42.0248 16.8857C42.1785 18.094 40.6156 19.3729 40.525 20.6219C40.445 21.8312 41.8421 23.3091 41.5185 24.5169Z"
            fill={`url(#${gradId})`}
          />
        </g>
        <defs>
          <filter
            id={filterId}
            x="6.4373e-06"
            y="0"
            width="45.1806"
            height="45.1806"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="3.14523" />
            <feGaussianBlur stdDeviation="1.57261" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="0.714824" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
          </filter>
          <linearGradient id={gradId} x1="13.9768" y1="1.96431" x2="27.6703" y2="38.0248" gradientUnits="userSpaceOnUse">
            <stop style={{ stopColor: 'var(--badge-grad-start, #3AB6FA)' }} />
            <stop offset="1" style={{ stopColor: 'var(--badge-grad-end, #006DAA)' }} />
          </linearGradient>
        </defs>
        </svg>
      </span>
      <span className={styles.content}>{children}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={rootClass} style={rootStyle} onClick={onClick}>
        {inner}
      </button>
    );
  }

  return (
    <span className={rootClass} style={rootStyle} aria-hidden="true">
      {inner}
    </span>
  );
}
