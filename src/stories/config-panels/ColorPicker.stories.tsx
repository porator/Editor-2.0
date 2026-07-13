import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { BackgroundPicker } from "@/components/background-picker";
import type { BackgroundValue } from "@/components/background-picker";
import {
  createDefaultGradient,
  createDefaultSolid,
  toGradientCss,
  toRgbaString,
} from "@/components/background-picker";
import { useImage } from "@/components/background-picker/hooks/useImage";
import { CHECKERBOARD_STYLE } from "@/components/background-picker/components/LinearTrack";

/** Live preview of the current BackgroundValue, over a checkerboard. */
function Preview({ value }: { value: BackgroundValue }) {
  const image = value.type === "image" ? value.image : null;
  const { src } = useImage(image);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">Preview</span>
      <div className="relative size-56 overflow-hidden rounded-xl border border-border shadow-xs">
        <span aria-hidden className="absolute inset-0" style={CHECKERBOARD_STYLE} />
        {value.type === "solid" && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: toRgbaString(value.color, value.opacity) }}
          />
        )}
        {value.type === "gradient" && (
          <div className="absolute inset-0" style={{ backgroundImage: toGradientCss(value) }} />
        )}
        {value.type === "image" &&
          (src ? (
            <img
              src={src}
              alt="Preview"
              className="absolute inset-0 size-full"
              style={{
                objectFit: value.fit,
                objectPosition: value.position,
                opacity: value.opacity,
                filter: value.blur ? `blur(${value.blur}px)` : undefined,
                transform: value.scale ? `scale(${value.scale / 100})` : undefined,
              }}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
              No image
            </div>
          ))}
      </div>
    </div>
  );
}

/** Controlled demo: the config panel + a live preview. */
function Demo({ initial }: { initial: BackgroundValue }) {
  const [value, setValue] = React.useState<BackgroundValue>(initial);
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div style={{ width: 256 }}>
        <BackgroundPicker value={value} onChange={setValue} />
      </div>
      <Preview value={value} />
    </div>
  );
}

const meta: Meta<typeof BackgroundPicker> = {
  title: "Config Panels/Color Picker",
  component: BackgroundPicker,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof BackgroundPicker>;

export const Solid: Story = {
  render: () => <Demo initial={createDefaultSolid()} />,
};

export const Gradient: Story = {
  render: () => <Demo initial={createDefaultGradient()} />,
};
