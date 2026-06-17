import { useState } from 'react';
import type { EditorState } from '../../types/editor';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import TopNavigation from '../TopNavigation/TopNavigation';
import LeftPanel from '../LeftPanel/LeftPanel';
import PreviewWorkspace from '../PreviewWorkspace/PreviewWorkspace';
import SettingsPanel, { SettingsPanelBody } from '../SettingsPanel/SettingsPanel';
import styles from './EditorShell.module.css';

const BREAKPOINT = 1280;

interface Props {
  state: EditorState;
  onStateChange: (s: EditorState) => void;
}

export default function EditorShell({ state, onStateChange }: Props) {
  const windowWidth = useWindowWidth();
  const isNarrow = windowWidth <= BREAKPOINT;

  const [settingsOpen, setSettingsOpen] = useState(true);
  const [settingsTitle, setSettingsTitle] = useState('Header');

  const handleSectionActivate = (_id: string, label: string) => {
    setSettingsTitle(label);
    setSettingsOpen(true);
  };

  const closeSettings = () => setSettingsOpen(false);

  return (
    <div className={styles.shell}>
      <TopNavigation state={state} onStateChange={onStateChange} />
      <div className={styles.body}>
        <LeftPanel
          state={state}
          onStateChange={onStateChange}
          onSectionActivate={handleSectionActivate}
          bottomOverride={isNarrow && settingsOpen ? {
            title: settingsTitle,
            content: <SettingsPanelBody />,
            onClose: closeSettings,
          } : undefined}
        />
        <PreviewWorkspace
          state={state}
          onStateChange={onStateChange}
          activeSection={settingsTitle}
          onSectionClick={(name) => handleSectionActivate(name, name)}
        />
        {!isNarrow && settingsOpen && (
          <SettingsPanel title={settingsTitle} onClose={closeSettings} />
        )}
      </div>
    </div>
  );
}
