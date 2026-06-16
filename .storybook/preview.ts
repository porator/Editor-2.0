import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";
const preview: Preview = {
  parameters: {
    layout: "centered",
    docs: { toc: true },
  },
};
export default preview;
