import React, { useState } from 'react';

type Tab = 'Style' | 'Content';

const tabs: Tab[] = ['Style', 'Content'];

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
}

function PropertyRow({ label, children }: PropertyRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#f5f5f5]">
      <span className="text-xs text-[#737373]">{label}</span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}

interface NumberInputProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  width?: string;
}

function NumberInput({ value, onChange, label, width = 'w-12' }: NumberInputProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${width} text-xs text-[#171717] border border-[#e5e5e5] rounded px-1.5 py-1 text-center focus:outline-none focus:border-[#4f46e5] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
      />
      {label && <span className="text-[10px] text-[#a3a3a3]">{label}</span>}
    </div>
  );
}

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('Style');

  // Style state
  const [bgColor, setBgColor] = useState('#ffffff');
  const [paddingT, setPaddingT] = useState('0');
  const [paddingR, setPaddingR] = useState('0');
  const [paddingB, setPaddingB] = useState('0');
  const [paddingL, setPaddingL] = useState('0');
  const [borderRadius, setBorderRadius] = useState('0');
  const [fontSize, setFontSize] = useState('16');

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="text-xs font-semibold text-[#171717] px-4 py-3 border-b border-[#e5e5e5] shrink-0">
        Properties
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#e5e5e5] shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex-1 text-xs py-2 px-3 font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-[#4f46e5] text-[#4f46e5]'
                : 'text-[#737373] hover:text-[#171717]',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {activeTab === 'Style' && (
          <div>
            {/* Background */}
            <PropertyRow label="Background">
              <div
                className="w-5 h-5 rounded border border-[#e5e5e5] cursor-pointer shrink-0"
                style={{ backgroundColor: bgColor }}
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-20 text-xs text-[#171717] border border-[#e5e5e5] rounded px-1.5 py-1 focus:outline-none focus:border-[#4f46e5]"
              />
            </PropertyRow>

            {/* Padding */}
            <PropertyRow label="Padding">
              <div className="flex gap-1">
                <NumberInput value={paddingT} onChange={setPaddingT} label="T" />
                <NumberInput value={paddingR} onChange={setPaddingR} label="R" />
                <NumberInput value={paddingB} onChange={setPaddingB} label="B" />
                <NumberInput value={paddingL} onChange={setPaddingL} label="L" />
              </div>
            </PropertyRow>

            {/* Border Radius */}
            <PropertyRow label="Border Radius">
              <div className="flex items-center gap-1">
                <NumberInput value={borderRadius} onChange={setBorderRadius} width="w-14" />
                <span className="text-xs text-[#a3a3a3]">px</span>
              </div>
            </PropertyRow>

            {/* Font Size */}
            <PropertyRow label="Font Size">
              <div className="flex items-center gap-1">
                <NumberInput value={fontSize} onChange={setFontSize} width="w-14" />
                <span className="text-xs text-[#a3a3a3]">px</span>
              </div>
            </PropertyRow>
          </div>
        )}

        {activeTab === 'Content' && (
          <div className="flex items-center justify-center h-24 text-xs text-[#a3a3a3] text-center">
            Select an element to edit content
          </div>
        )}
      </div>
    </div>
  );
}
