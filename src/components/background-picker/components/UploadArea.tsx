import * as React from "react";
import { ImageUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { isImageFile } from "../utils/image";

export interface UploadAreaProps {
  onSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  /**
   * When provided, these become the clickable/drop target (e.g. a Replace
   * button or a thumbnail) instead of the default empty-state dropzone.
   */
  children?: React.ReactNode;
}

/**
 * Drag-and-drop + click file selector. Reused for the empty state and for the
 * "Replace" affordance, so file-selection logic lives in one place. Styled with
 * DS tokens (dashed border, rounded-md, focus ring, muted foreground).
 */
export const UploadArea = React.memo(function UploadArea({
  onSelect,
  accept = "image/*",
  disabled = false,
  className,
  children,
}: UploadAreaProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = React.useState(false);

  const pick = (files: FileList | null) => {
    const file = files && Array.from(files).find(isImageFile);
    if (file) onSelect(file);
  };

  const open = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (!disabled) pick(e.dataTransfer.files);
  };

  const asDropzone = !children;

  return (
    <div
      onClick={open}
      onKeyDown={(e) => {
        if (asDropzone && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          open();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      role={asDropzone ? "button" : undefined}
      tabIndex={asDropzone && !disabled ? 0 : undefined}
      aria-label={asDropzone ? "Upload image" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        asDropzone &&
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input px-4 py-8 text-center outline-none transition-colors hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        asDropzone && isOver && "border-ring bg-accent/60",
        !asDropzone && "relative inline-flex",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
      {asDropzone ? (
        <>
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ImageUp className="size-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Drag &amp; drop an image
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse — PNG, JPG, SVG, GIF
            </p>
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
});
