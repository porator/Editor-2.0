import { useState } from 'react';
import type { EditorState } from '../../types/editor';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import { SectionFocusProvider } from '../../hooks/useSectionFocus';
import { GroupingProvider } from '../../hooks/useGrouping';
import TopNavigation from '../TopNavigation/TopNavigation';
import LeftPanel from '../LeftPanel/LeftPanel';
import PreviewWorkspace from '../PreviewWorkspace/PreviewWorkspace';
import ConfigDrawer, { ConfigDrawerBody } from '../ConfigDrawer/ConfigDrawer';
import { isNewBlock } from '../LeftPanel/NewBadge';
import SECTION_CONFIGS, { SUB_BLOCK_CONFIGS } from '../ConfigDrawer/config-data';
import styles from './EditorShell.module.css';

function drawerTitle(configSection: string): string {
  const cfg = SECTION_CONFIGS[configSection] ?? SUB_BLOCK_CONFIGS[configSection];
  if (!cfg) return configSection;
  return cfg.label;
}

const BREAKPOINT = 1280;

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
}

export default function EditorShell({ state, onStateChange }: Props) {
  const windowWidth = useWindowWidth();
  const isNarrow = windowWidth <= BREAKPOINT;

  // First-time: no block selected, config drawer closed
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [, setActiveLabel]                = useState('');
  const [configSection, setConfigSection] = useState<string | null>(null);

  const handleSectionActivate = (id: string, label: string) => {
    setActiveLabel(label);
    setDrawerOpen(true);
    setConfigSection(id);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setConfigSection(null);
  };

  return (
    <SectionFocusProvider>
    <GroupingProvider>
    <div className={styles.shell}>
      <TopNavigation state={state} onStateChange={onStateChange} />
      <div className={styles.body}>
        <LeftPanel
          state={state}
          onStateChange={onStateChange}
          activeSectionId={configSection ?? undefined}
          onSectionActivate={handleSectionActivate}
          bottomOverride={isNarrow && drawerOpen && configSection ? {
            title: drawerTitle(configSection),
            content: <ConfigDrawerBody sectionId={configSection} />,
            onClose: closeDrawer,
            isNew: isNewBlock(configSection),
          } : undefined}
        />
        <PreviewWorkspace
          state={state}
          onStateChange={onStateChange}
          activeSection={configSection ?? undefined}
          onSectionClick={(id, label) => handleSectionActivate(id, label)}
        />
        {!isNarrow && drawerOpen && configSection && (
          <ConfigDrawer
            key={configSection}
            sectionId={configSection}
            onBack={closeDrawer}
          />
        )}
      </div>
    </div>
    </GroupingProvider>
    </SectionFocusProvider>
  );
}
