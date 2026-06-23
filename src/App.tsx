import { useState } from 'react';
import EditorShell from './components/EditorShell/EditorShell';
import type { EditorState } from './types/editor';

export default function App() {
  const [state, setState] = useState<EditorState>({
    activePanel: 'blocks',
    previewMode: 'mobile',
    desktopScale: 55,
    templateName: 'Summer Sale Template',
    canUndo: true,
    canRedo: false,
    whiteLabel: false,
  });

  return <EditorShell state={state} onStateChange={setState} />;
}
