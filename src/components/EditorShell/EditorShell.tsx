import { useState } from 'react';
import type { EditorState } from '../../types/editor';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import TopNavigation from '../TopNavigation/TopNavigation';
import LeftPanel from '../LeftPanel/LeftPanel';
import PreviewWorkspace from '../PreviewWorkspace/PreviewWorkspace';
import ConfigDrawer, { ConfigDrawerBody } from '../ConfigDrawer/ConfigDrawer';
import SECTION_CONFIGS, { SUB_BLOCK_CONFIGS } from '../ConfigDrawer/config-data';
import styles from './EditorShell.module.css';

function drawerTitle(configSection: string): string {
  const cfg = SECTION_CONFIGS[configSection] ?? SUB_BLOCK_CONFIGS[configSection];
  if (!cfg) return configSection;
  return cfg.parentLabel ? `${cfg.parentLabel} → ${cfg.label}` : cfg.label;
}

const BREAKPOINT = 1280;

const LABEL_TO_CONFIG_ID: Record<string, string> = {
  Header:            'header',
  Footer:            'footer',
  Banner:            'bundle',
  Bundle:            'bundle',
  Promotion:         'promotion',
  'Rolling Offer':   'promotion',
  'Reward Calendar': 'bundle',
  'Daily Bonus':     'bundle',
  Popup:             'popup',
  Store:             'store',
};

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
}

export default function EditorShell({ state, onStateChange }: Props) {
  const windowWidth = useWindowWidth();
  const isNarrow = windowWidth <= BREAKPOINT;

  const [drawerOpen, setDrawerOpen]       = useState(true);
  const [activeLabel, setActiveLabel]     = useState('Header');
  const [configSection, setConfigSection] = useState<string | null>('header');

  const handleSectionActivate = (id: string, label: string) => {
    setActiveLabel(label);
    setDrawerOpen(true);
    setConfigSection(LABEL_TO_CONFIG_ID[label] ?? id);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setConfigSection(null);
  };

  return (
    <div className={styles.shell}>
      <TopNavigation state={state} onStateChange={onStateChange} />
      <div className={styles.body}>
        <LeftPanel
          state={state}
          onStateChange={onStateChange}
          onSectionActivate={handleSectionActivate}
          bottomOverride={isNarrow && drawerOpen && configSection ? {
            title: drawerTitle(configSection),
            content: <ConfigDrawerBody sectionId={configSection} />,
            onClose: closeDrawer,
          } : undefined}
        />
        <PreviewWorkspace
          state={state}
          onStateChange={onStateChange}
          activeSection={activeLabel}
          onSectionClick={(name) => handleSectionActivate(name, name)}
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
  );
}
