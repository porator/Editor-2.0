import React from "react";
import { EditorLayout } from "./layout/EditorLayout";
import { TopNav } from "./navigation/TopNav";
import { LeftSidebar } from "./panels/LeftSidebar";
import { RightPanel } from "./panels/RightPanel";
import { Canvas } from "./preview/Canvas";

export function EditorShell() {
  return (
    <EditorLayout
      topNav={<TopNav />}
      leftSidebar={<LeftSidebar />}
      canvas={<Canvas />}
      rightPanel={<RightPanel />}
    />
  );
}
