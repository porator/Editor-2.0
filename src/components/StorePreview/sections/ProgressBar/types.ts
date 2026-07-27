export interface ProgressBarMilestone {
  /** Position along the track, 0–100. */
  at: number;
  icon: string;
  label: string;
}

export interface ProgressBarData {
  title: string;
  /** Current fill, 0–100. */
  progress: number;
  /** Progress readout shown beside the title, e.g. "650 / 1,000". */
  progressLabel: string;
  milestones: ProgressBarMilestone[];
}
