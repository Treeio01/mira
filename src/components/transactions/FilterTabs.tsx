import { memo } from 'react';

export interface FilterTab {
  key: string;
  label: string;
  hasDropdown?: boolean;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export const FilterTabs = memo(function FilterTabs({ tabs, activeKey, onSelect }: FilterTabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={`flex w-full items-center gap-1 px-4 py-2 rounded-full text-sm font-medium tracking-[-0.02em] whitespace-nowrap shrink-0 transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-white/[0.06] text-text-secondary'
            }`}
          >
            {tab.label}
            {tab.hasDropdown && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
});
