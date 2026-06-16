import React, { useState } from 'react';
import { Type, Image, Square, Minus, Move, Video, Layers, ImageIcon, Boxes } from 'lucide-react';

type Tab = 'Blocks' | 'Layers' | 'Assets';

const blockTypes = [
  { label: 'Text', icon: <Type size={18} /> },
  { label: 'Image', icon: <Image size={18} /> },
  { label: 'Button', icon: <Square size={18} /> },
  { label: 'Divider', icon: <Minus size={18} /> },
  { label: 'Spacer', icon: <Move size={18} /> },
  { label: 'Video', icon: <Video size={18} /> },
];

const layerItems = ['Header', 'Hero Section', 'Footer'];

const tabs: Tab[] = ['Blocks', 'Layers', 'Assets'];

const tabIcons: Record<Tab, React.ReactNode> = {
  Blocks: <Boxes size={14} />,
  Layers: <Layers size={14} />,
  Assets: <ImageIcon size={14} />,
};

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('Blocks');

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-[#e5e5e5] shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex items-center gap-1 text-xs py-2 px-3 font-medium whitespace-nowrap transition-colors',
              activeTab === tab
                ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                : 'text-[#737373] hover:text-[#171717]',
            ].join(' ')}
          >
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'Blocks' && (
          <div className="grid grid-cols-2 gap-2">
            {blockTypes.map(({ label, icon }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[#e5e5e5] cursor-pointer hover:border-[#4f46e5] hover:bg-[#f0f0ff] transition-colors text-[#525252]"
              >
                {icon}
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'Layers' && (
          <ul className="space-y-1">
            {layerItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 px-2 py-2 rounded-md text-xs text-[#525252] cursor-pointer hover:bg-[#f5f5f5] hover:text-[#171717] transition-colors"
              >
                <Layers size={13} className="text-[#a3a3a3]" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'Assets' && (
          <div className="flex items-center justify-center h-24 text-xs text-[#a3a3a3]">
            No assets yet
          </div>
        )}
      </div>
    </div>
  );
}
