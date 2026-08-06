import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/* ── A2HS state bridge (Template Studio config → Store Preview) ──
 * Single source of truth for the Add-to-Home-Screen entry point: the
 * publisher config authored in the A2HS config panel, plus the in-session
 * player-flow runtime that drives the clickable preview (banner → instruction
 * popup → simulated home-screen entry → reward popup → suppression).
 *
 * Two-way, unlike useGrouping: the config panel writes `config`, the preview
 * writes `runtime` (via the flow actions) and reads both. This is a deliberate,
 * contained deviation from the prototype's ephemeral-config norm — the clickable
 * flow needs config edits to be live in the preview. */

export type A2HSTemplate = 'existing' | 'banner';
export type A2HSPresentation = 'drawer' | 'inline';
export type A2HSPlatform = 'ios' | 'android';
export type A2HSIdentityMode = 'playerId' | 'playerId+deviceId';
export type A2HSCooldownUnit = 'hours' | 'days';

export interface A2HSBannerConfig {
  title: string;
  richText: string;
  bgColor: string;
  bgImage?: string;
  opacity: number; // 0–100
  productEmoji?: string; // stand-in for the PAPI product-image override
  productImage?: string; // uploaded image (data URL); mutually exclusive with productEmoji
  ctaFont: string; // CTA button font-family stack
  ctaBgColor: string; // CTA button background
  ctaTextColor: string; // CTA button text color
  dismissIcon?: string; // uploaded image (data URL) replacing the X dismiss icon
}

export interface A2HSInstructionStep {
  text: string;
  image?: string; // uploaded image (data URL) shown as the step card
}

export interface A2HSInstructionConfig {
  presentation: A2HSPresentation;
  title: string; // drawer headline
  richText: string; // drawer description
  bgColor: string;
  bgImage?: string;
  opacity: number; // 0–100
  ctaText: string;
  dismissIcon?: string; // uploaded image (data URL) replacing the ✕ close icon
  steps: A2HSInstructionStep[]; // publisher-editable install steps (text + image)
}

export interface A2HSConfig {
  enabled: boolean; // tree eye toggle — shows/hides the entry point
  template: A2HSTemplate;
  ctaText: string; // entry-point CTA label
  buttonBgColor: string; // floating-button (Button template) fill color
  banner: A2HSBannerConfig;
  instruction: A2HSInstructionConfig;
  reward: { configured: boolean }; // drives the "configure a reward" reminder
  dismissalCooldown: { enabled: boolean; value: number; unit: A2HSCooldownUnit };
  completionIdentityMode: A2HSIdentityMode;
}

export interface A2HSRuntime {
  platform: A2HSPlatform;
  androidNativeAvailable: boolean; // false → iOS-style fallback steps on Android
  instructionOpen: boolean;
  rewardOpen: boolean;
  dismissed: boolean; // banner X-dismissed this session
  completed: boolean; // flow completed → entry permanently suppressed
}

/* Defaults mirror the PRD Configuration table (`template` = 'existing', the
 * floating Button); `reward.configured` defaults true so the reward popup
 * fires in the demo without extra setup. */
export const DEFAULT_A2HS_CONFIG: A2HSConfig = {
  enabled: true,
  template: 'existing',
  ctaText: 'Add to home screen',
  buttonBgColor: '#4f46e5',
  banner: {
    title: 'Add to Home Screen',
    richText: 'Add our store to your home screen — grab a reward!',
    bgColor: '#6d28d9',
    opacity: 100,
    productEmoji: '🎁',
    ctaFont: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    ctaBgColor: '#ffffff',
    ctaTextColor: '#111827',
  },
  instruction: {
    presentation: 'drawer',
    title: 'Install Store on your Apple Device',
    richText: 'Stay updated on events and bonuses without missing out',
    bgColor: '#ffffff',
    opacity: 100,
    ctaText: 'Got it',
    steps: [
      { text: 'Press "Share" icon in the toolbar' },
      { text: 'Select "Add to Home Screen" Option' },
      { text: 'Wait until the app is installed and enjoy quick access to exclusive offers and limited-time deals' },
    ],
  },
  reward: { configured: true },
  dismissalCooldown: { enabled: false, value: 7, unit: 'days' },
  completionIdentityMode: 'playerId',
};

const DEFAULT_A2HS_RUNTIME: A2HSRuntime = {
  platform: 'ios',
  androidNativeAvailable: true,
  instructionOpen: false,
  rewardOpen: false,
  dismissed: false,
  completed: false,
};

interface A2HSContextValue {
  config: A2HSConfig;
  runtime: A2HSRuntime;
  setConfig: Dispatch<SetStateAction<A2HSConfig>>;
  setRuntime: Dispatch<SetStateAction<A2HSRuntime>>;
  /* Derived: is the entry point currently shown to the player? */
  entryVisible: boolean;
  /* Flow actions (preview side). */
  openInstruction: () => void;
  closeInstruction: () => void;
  dismissEntry: () => void;
  simulateHomeEntry: () => void;
  closeReward: () => void;
  resetFlow: () => void;
  setPlatform: (p: A2HSPlatform) => void;
}

const A2HSContext = createContext<A2HSContextValue | null>(null);

export function A2HSProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<A2HSConfig>(DEFAULT_A2HS_CONFIG);
  const [runtime, setRuntime] = useState<A2HSRuntime>(DEFAULT_A2HS_RUNTIME);

  const entryVisible = config.enabled && !runtime.completed && !runtime.dismissed;

  const openInstruction = useCallback(
    () => setRuntime((r) => ({ ...r, instructionOpen: true })),
    [],
  );
  const closeInstruction = useCallback(
    () => setRuntime((r) => ({ ...r, instructionOpen: false })),
    [],
  );
  const dismissEntry = useCallback(
    () => setRuntime((r) => ({ ...r, dismissed: true })),
    [],
  );
  const closeReward = useCallback(
    () => setRuntime((r) => ({ ...r, rewardOpen: false })),
    [],
  );
  const setPlatform = useCallback(
    (platform: A2HSPlatform) => setRuntime((r) => ({ ...r, platform })),
    [],
  );

  /* First home-screen entry: completes the flow (suppressing the entry point)
   * and fires the reward popup if the publisher configured a reward. */
  const simulateHomeEntry = useCallback(() => {
    setRuntime((r) => ({ ...r, instructionOpen: false, completed: true }));
    setConfig((c) => {
      if (c.reward.configured) setRuntime((r) => ({ ...r, rewardOpen: true }));
      return c;
    });
  }, []);

  const resetFlow = useCallback(
    () => setRuntime((r) => ({
      ...DEFAULT_A2HS_RUNTIME,
      platform: r.platform,
      androidNativeAvailable: r.androidNativeAvailable,
    })),
    [],
  );

  const value = useMemo(
    () => ({
      config, runtime, setConfig, setRuntime, entryVisible,
      openInstruction, closeInstruction, dismissEntry,
      simulateHomeEntry, closeReward, resetFlow, setPlatform,
    }),
    [config, runtime, entryVisible, openInstruction, closeInstruction,
      dismissEntry, simulateHomeEntry, closeReward, resetFlow, setPlatform],
  );

  return <A2HSContext.Provider value={value}>{children}</A2HSContext.Provider>;
}

export function useA2HS(): A2HSContextValue {
  const ctx = useContext(A2HSContext);
  if (!ctx) throw new Error('useA2HS must be used inside an A2HSProvider');
  return ctx;
}
