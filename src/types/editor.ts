export type ActivePanel = 'blocks' | 'brandKit' | 'personalization';
export type PreviewMode = 'mobile' | 'desktop';

export interface EditorState {
  activePanel: ActivePanel;
  previewMode: PreviewMode;
  desktopScale: number;
  templateName: string;
  canUndo: boolean;
  canRedo: boolean;
}
