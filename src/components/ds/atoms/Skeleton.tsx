import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Skeleton — design-system loading placeholder.
 *
 * Sourced from the Figma design system skeleton style: a neutral #E0E0E5
 * block with an optional left-to-right shimmer. Use it to reserve layout
 * space while content is loading.
 */
const skeletonVariants = cva("ac-skeleton block", {
  variants: {
    variant: {
      /** Generic block / image placeholder. */
      default: "rounded-md",
      /** Single line of text. */
      text: "rounded h-3.5",
      /** Avatar / icon placeholder. */
      circular: "rounded-full",
    },
    shimmer: {
      true: "ac-skeleton--shimmer",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    shimmer: true,
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Convenience width — number (px) or any CSS length. */
  width?: number | string;
  /** Convenience height — number (px) or any CSS length. */
  height?: number | string;
}

const toLen = (v?: number | string) =>
  typeof v === "number" ? `${v}px` : v;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, shimmer, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ variant, shimmer }), className)}
        style={{ width: toLen(width), height: toLen(height), ...style }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
