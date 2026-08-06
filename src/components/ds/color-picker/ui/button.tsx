import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/**
 * Button variants following shadcn/ui patterns.
 * 8 visual variants × 4 sizes with full state support.
 */
export const buttonVariants = cva(
  [
    // Base — matches Figma: Inter Medium, 14px, 8px radius, flex row
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium',
    'rounded-[8px] select-none cursor-pointer',
    'transition-colors duration-150 ease-[var(--ease-out-quart)]',
    // Focus ring — matches Figma: 3px neutral outline, no offset (same as Checkbox/Switch/Radio)
    'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(163,163,163,0.5)]',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Default — indigo-600 bg, white text (from Figma)
        default:
          'bg-[#4f46e5] text-[#fafafa] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ' +
          'hover:bg-[#4338ca] active:bg-[#3730a3]',
        // Secondary — #f5f5f5 bg, near-black text (from Figma)
        secondary:
          'bg-[#f5f5f5] text-[#171717] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ' +
          'hover:bg-[#e5e5e5] active:bg-[#d4d4d4]',
        // Destructive — red, not in Figma scope, kept from design system
        destructive:
          'bg-danger text-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ' +
          'hover:bg-danger/90 active:bg-danger/80',
        // Outline — bordered, not in Figma scope, kept from design system
        outline:
          'border border-[#e5e5e5] bg-white text-[#171717] ' +
          'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ' +
          'hover:bg-[#f5f5f5] active:bg-[#e5e5e5]',
        // Ghost — transparent bg, hover shows #f5f5f5 (from Figma)
        ghost:
          'bg-transparent text-[#0a0a0a] ' +
          'hover:bg-[#f5f5f5] active:bg-[#e5e5e5]',
        // Link — transparent, near-black text (from Figma)
        link:
          'bg-transparent text-[#171717] underline-offset-4 hover:underline ' +
          'active:opacity-70',
      },
      size: {
        // sm: 32px h, 12px px (from Figma)
        sm:   'h-8 px-3 text-sm',
        // default: 36px h, 16px px (from Figma)
        md:   'h-9 px-4 text-sm',
        // lg: 40px h, 32px px (from Figma)
        lg:   'h-10 px-8 text-sm',
        // icon: 36×36px square (from Figma)
        icon: 'h-9 w-9 p-0',
        // icon-sm: compact square for the gradient toolbar triggers
        'icon-sm': 'h-7 w-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
    compoundVariants: [
      { variant: 'link', class: 'h-auto px-0 py-0' },
    ],
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Render as child element (e.g., <a> or router link).
   * Slot composition pattern from Radix.
   */
  asChild?: boolean;
  /** Optional icon before text */
  leadingIcon?: React.ReactNode;
  /** Optional icon after text */
  trailingIcon?: React.ReactNode;
  /** Show loading state with spinner */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      asChild = false,
      leadingIcon,
      trailingIcon,
      loading = false,
      disabled,
      children,
      type,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref as any}
        type={!asChild ? (type ?? 'button') : undefined}
        disabled={!asChild && isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner /> : leadingIcon}
        {children}
        {!loading && trailingIcon}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin size-4"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
