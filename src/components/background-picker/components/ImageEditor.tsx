import * as React from "react";
import { RefreshCw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ImageBackground, ImageFit } from "../BackgroundPicker.types";
import { FIT_OPTIONS, POSITION_OPTIONS } from "../styles/constants";
import { useImage } from "../hooks/useImage";
import { CHECKERBOARD_STYLE } from "./LinearTrack";
import { UploadArea } from "./UploadArea";

export interface ImageEditorProps {
  value: ImageBackground;
  onChange: (next: ImageBackground) => void;
  enableEffects?: boolean;
  className?: string;
}

/** A labelled control row: fixed-width label + flexible control. */
function Row({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <Label htmlFor={htmlFor} className="w-16 shrink-0 text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-1 items-center gap-2">{children}</div>
    </div>
  );
}

/** Image fill editor: upload/replace/remove, fit, position, opacity, effects. */
export const ImageEditor = React.memo(function ImageEditor({
  value,
  onChange,
  enableEffects = true,
  className,
}: ImageEditorProps) {
  const { src, name, hasImage } = useImage(value.image);
  const patch = (p: Partial<ImageBackground>) => onChange({ ...value, ...p });

  if (!hasImage) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <UploadArea onSelect={(file) => patch({ image: file })} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative h-32 w-full overflow-hidden rounded-md border border-border">
        <span aria-hidden className="absolute inset-0" style={CHECKERBOARD_STYLE} />
        {src && (
          <img
            src={src}
            alt={name || "Background preview"}
            className="absolute inset-0 size-full"
            style={{
              objectFit: value.fit,
              objectPosition: value.position,
              opacity: value.opacity,
              filter: value.blur ? `blur(${value.blur}px)` : undefined,
              transform: value.scale ? `scale(${value.scale / 100})` : undefined,
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <p className="flex-1 truncate text-sm text-muted-foreground" title={name}>
          {name}
        </p>
        <UploadArea onSelect={(file) => patch({ image: file })}>
          <Button type="button" variant="outline" size="sm">
            <RefreshCw />
            Replace
          </Button>
        </UploadArea>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Remove image"
          onClick={() => patch({ image: null })}
        >
          <Trash2 />
          Remove
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <Row label="Fit">
          <Select
            value={value.fit}
            onValueChange={(v) => patch({ fit: v as ImageFit })}
          >
            <SelectTrigger aria-label="Image fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FIT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row label="Position">
          <Select
            value={value.position}
            onValueChange={(v) => patch({ position: v })}
          >
            <SelectTrigger aria-label="Image position">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSITION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row label="Opacity">
          <Slider
            aria-label="Image opacity"
            value={[value.opacity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([v]) => patch({ opacity: v })}
          />
          <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
            {Math.round(value.opacity * 100)}%
          </span>
        </Row>

        {enableEffects && (
          <>
            <Row label="Blur">
              <Slider
                aria-label="Image blur"
                value={[value.blur ?? 0]}
                min={0}
                max={20}
                step={1}
                onValueChange={([v]) => patch({ blur: v })}
              />
              <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {value.blur ?? 0}px
              </span>
            </Row>

            <Row label="Scale">
              <Slider
                aria-label="Image scale"
                value={[value.scale ?? 100]}
                min={50}
                max={200}
                step={1}
                onValueChange={([v]) => patch({ scale: v })}
              />
              <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {value.scale ?? 100}%
              </span>
            </Row>
          </>
        )}
      </div>
    </div>
  );
});
