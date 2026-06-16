import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5]">
        {icon}
      </div>
      <p className="text-sm font-semibold text-[#171717]">{title}</p>
      <p className="text-sm text-[#737373] max-w-xs">{description}</p>
      {action}
    </div>
  );
}
