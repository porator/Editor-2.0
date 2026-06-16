import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#4f46e5] text-white",
        secondary:
          "bg-[#f5f5f5] text-[#171717]",
        outline:
          "border border-[#e5e5e5] bg-white text-[#171717]",
        success:
          "bg-[#dcfce7] text-[#16a34a]",
        warning:
          "bg-[#fef9c3] text-[#a16207]",
        destructive:
          "bg-[#fee2e2] text-[#dc2626]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
