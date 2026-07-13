import * as React from "react";

import type { ImageBackground } from "../BackgroundPicker.types";
import { imageDisplayName } from "../utils/image";

export interface UseImageResult {
  /** A string src usable in CSS/`<img>`, or null when empty. */
  src: string | null;
  /** Friendly file/image name. */
  name: string;
  hasImage: boolean;
}

/**
 * Resolves an `ImageBackground["image"]` (File | string | null) into a stable
 * object-URL/string `src`, and revokes any object URL it created when the
 * source changes or the component unmounts — preventing memory leaks.
 */
export function useImage(image: ImageBackground["image"]): UseImageResult {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!image) {
      setSrc(null);
      return;
    }
    if (typeof image === "string") {
      setSrc(image);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const name = React.useMemo(() => imageDisplayName(image), [image]);

  return { src, name, hasImage: Boolean(image) };
}
