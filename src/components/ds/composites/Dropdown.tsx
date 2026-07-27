import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/cn";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        /* flex column + gap, rather than margins on the items: adjacent
         * vertical margins collapse, so `my-[1px]` would render 1px between
         * rows instead of 2px. A flex gap is exact. */
        "min-w-[8rem] rounded-[8px] border border-[#e5e5e5] bg-white shadow-md p-1",
        "flex flex-col gap-[2px]",
        "z-50 overflow-hidden",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      /* 14px text + 8px vertical padding; row separation comes from the
       * menu's flex gap, not margins. leading-[16px] rather than
       * leading-none: `truncate` clips overflow, and a 14px line box on
       * 14px text would slice the descenders off g/p/y. */
      "relative flex cursor-pointer select-none items-center gap-2",
      "rounded-[6px] px-2 py-2",
      /* Matches the block tree's .sectionLabel: 12px / 400 / 16px / gray-600.
       * The 16px line box also keeps `truncate`'s overflow:hidden from
       * clipping descenders. */
      "text-[12px] leading-[16px] font-normal text-[#4B5563] truncate",
      "outline-none transition-colors focus:bg-[#f5f5f5]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
);

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-[#e5e5e5]", className)}
    {...props}
  />
);

const DropdownMenuLabel = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) => (
  <DropdownMenuPrimitive.Label
    className={cn("px-2 py-1.5 text-xs font-semibold text-gray-500", className)}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
