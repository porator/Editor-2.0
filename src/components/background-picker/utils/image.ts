/** Helpers for working with image fills (File or URL/data string). */

import type { ImageBackground } from "../BackgroundPicker.types";

export const isImageFile = (file: File): boolean =>
  file.type.startsWith("image/");

/** Read a File into a data URL. */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Resolve an image source to a string usable in CSS/`<img>`.
 * For a `File` this creates an object URL — the caller owns revocation
 * (see `useImage`, which manages the lifecycle).
 */
export function resolveImageSrc(image: ImageBackground["image"]): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  return URL.createObjectURL(image);
}

/** Display name for the current image source. */
export function imageDisplayName(image: ImageBackground["image"]): string {
  if (!image) return "";
  if (typeof image !== "string") return image.name;
  if (image.startsWith("data:")) return "Uploaded image";
  try {
    const url = new URL(image, "http://x");
    return url.pathname.split("/").pop() || image;
  } catch {
    return image;
  }
}

export const CSS_POSITIONS = [
  "top left",
  "top",
  "top right",
  "left",
  "center",
  "right",
  "bottom left",
  "bottom",
  "bottom right",
] as const;

export type CssPosition = (typeof CSS_POSITIONS)[number];
