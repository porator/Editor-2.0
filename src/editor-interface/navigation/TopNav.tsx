import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";
import {
  ChevronDown,
  Undo2,
  Redo2,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Device = "desktop" | "tablet" | "mobile";

const deviceOptions: { id: Device; icon: React.ReactNode; label: string }[] = [
  { id: "desktop", icon: <Monitor className="h-4 w-4" />, label: "Desktop" },
  { id: "tablet", icon: <Tablet className="h-4 w-4" />, label: "Tablet" },
  { id: "mobile", icon: <Smartphone className="h-4 w-4" />, label: "Mobile" },
];

export function TopNav() {
  const [activeDevice, setActiveDevice] = useState<Device>("desktop");

  return (
    <header className="flex items-center justify-between w-full h-12 px-4 border-b border-[#e5e5e5] bg-white">
      {/* Left: Logo + title */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="h-5 w-5 rounded-sm bg-[#4f46e5] flex-shrink-0"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-[#171717] whitespace-nowrap">
          Editor 2.0
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[#737373] flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Center: Undo/Redo + Divider + Device switcher */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Undo"
          onClick={() => {}}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Redo"
          onClick={() => {}}
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <div
          className="w-px h-5 bg-[#e5e5e5] mx-1 flex-shrink-0"
          role="separator"
          aria-orientation="vertical"
        />

        <div
          className="flex items-center gap-0.5 rounded-md p-0.5 bg-[#f5f5f5]"
          role="group"
          aria-label="Device preview"
        >
          {deviceOptions.map(({ id, icon, label }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={activeDevice === id}
              onClick={() => setActiveDevice(id)}
              className={cn(
                "inline-flex items-center justify-center h-7 w-7 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]",
                activeDevice === id
                  ? "bg-[#f0f0ff] text-[#4f46e5]"
                  : "text-[#737373] hover:text-[#171717] hover:bg-white"
              )}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Preview + Share + Avatar */}
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="outline"
          size="sm"
          leadingIcon={<Eye className="h-4 w-4" />}
        >
          Preview
        </Button>
        <Button
          variant="default"
          size="sm"
          leadingIcon={<Share2 className="h-4 w-4" />}
        >
          Share
        </Button>
        <Avatar size="sm" aria-label="User account">
          <AvatarFallback>OR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
