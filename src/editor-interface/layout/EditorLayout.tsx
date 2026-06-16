import React from "react";

interface EditorLayoutProps {
  topNav: React.ReactNode;
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  rightPanel: React.ReactNode;
}

export function EditorLayout({
  topNav,
  leftSidebar,
  canvas,
  rightPanel,
}: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] overflow-hidden">
      {/* Top nav */}
      <header className="h-12 bg-white border-b border-[#e5e5e5] flex items-center px-4 shrink-0">
        {topNav}
      </header>

      {/* Bottom row */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-64 shrink-0 bg-white border-r border-[#e5e5e5] overflow-y-auto">
          {leftSidebar}
        </aside>

        {/* Center canvas */}
        <main className="flex-1 overflow-auto bg-[#f0f0f0] flex items-start justify-center p-8">
          {canvas}
        </main>

        {/* Right panel */}
        <aside className="w-72 shrink-0 bg-white border-l border-[#e5e5e5] overflow-y-auto">
          {rightPanel}
        </aside>
      </div>
    </div>
  );
}
