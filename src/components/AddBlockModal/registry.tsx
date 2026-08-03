import type { ReactNode, ComponentType } from 'react';
import {
  Image, Package, Megaphone, Ticket, Calendar, Gift, MessageSquare, Blocks,
  BarChart3, Smartphone,
} from 'lucide-react';
import {
  BannerPreview, BundlePreview, PromotionPreview, RollingOfferPreview,
  RewardCalendarPreview, DailyBonusPreview, PopupPreview, ProgressBarPreview,
  AddToHomeScreenPreview,
  CustomBlock1Preview, CustomBlock2Preview, CustomBlock3Preview,
  CustomBlock4Preview, CustomBlock5Preview,
} from './previews';

/* ── Block registry ──
 * The Add Block modal renders entirely from this list: search, category
 * tabs, previews, and insertion all derive from BlockDefinition. Adding
 * a new block type = registering one entry here. */

export interface BlockDefinition {
  id: string;
  name: string;
  icon: ReactNode;
  category: string;
  description: string;
  preview: ComponentType;
  keywords: string[];
  badge?: string;
}

export const BLOCK_REGISTRY: BlockDefinition[] = [
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    icon: <BarChart3 size={16} strokeWidth={1.75} />,
    category: 'Retention',
    description: 'Goal progress with milestones',
    preview: ProgressBarPreview,
    keywords: ['progress', 'milestone', 'battle pass', 'goal', 'tier'],
  },
  {
    id: 'banner',
    name: 'Banner',
    icon: <Image size={16} strokeWidth={1.75} />,
    category: 'General',
    description: 'Promotional artwork strip',
    preview: BannerPreview,
    keywords: ['hero', 'artwork', 'image', 'campaign'],
  },
  {
    id: 'promotion',
    name: 'Promotion',
    icon: <Megaphone size={16} strokeWidth={1.75} />,
    category: 'Monetization',
    description: 'Large promotional offer',
    preview: PromotionPreview,
    keywords: ['sale', 'offer', 'discount', 'welcome'],
    badge: 'New',
  },
  {
    id: 'bundle',
    name: 'Bundle',
    icon: <Package size={16} strokeWidth={1.75} />,
    category: 'Monetization',
    description: 'Multi-item purchase bundle',
    preview: BundlePreview,
    keywords: ['pack', 'items', 'products', 'combo'],
    badge: 'New',
  },
  {
    id: 'rolling-offer',
    name: 'Rolling Offer',
    icon: <Ticket size={16} strokeWidth={1.75} />,
    category: 'Monetization',
    description: 'Carousel of rotating offers',
    preview: RollingOfferPreview,
    keywords: ['carousel', 'timer', 'rotating', 'limited'],
  },
  {
    id: 'reward-calendar',
    name: 'Reward Calendar',
    icon: <Calendar size={16} strokeWidth={1.75} />,
    category: 'Retention',
    description: 'Daily login rewards',
    preview: RewardCalendarPreview,
    keywords: ['daily', 'login', 'streak', 'calendar'],
  },
  {
    id: 'daily-bonus',
    name: 'Daily Bonus',
    icon: <Gift size={16} strokeWidth={1.75} />,
    category: 'Retention',
    description: 'Free daily claimable bonus',
    preview: DailyBonusPreview,
    keywords: ['free', 'claim', 'gift', 'daily'],
  },
  {
    id: 'add-to-home-screen',
    name: 'Add to Home Screen',
    icon: <Smartphone size={16} strokeWidth={1.75} />,
    category: 'Retention',
    description: 'Prompt to install the web store',
    preview: AddToHomeScreenPreview,
    keywords: ['pwa', 'install', 'home screen', 'shortcut', 'a2hs'],
  },
  {
    id: 'popup',
    name: 'Triggered Popup',
    icon: <MessageSquare size={16} strokeWidth={1.75} />,
    category: 'Monetization',
    description: 'Triggered overlay message',
    preview: PopupPreview,
    keywords: ['modal', 'overlay', 'announcement', 'triggered'],
  },
  {
    id: 'custom-block-1',
    name: 'Custom Block 1',
    icon: <Blocks size={16} strokeWidth={1.75} />,
    category: 'General',
    description: 'Custom offer block',
    preview: CustomBlock1Preview,
    keywords: ['custom', 'blank', 'placeholder'],
  },
  {
    id: 'custom-block-2',
    name: 'Custom Block 2',
    icon: <Blocks size={16} strokeWidth={1.75} />,
    category: 'General',
    description: 'Custom offer block',
    preview: CustomBlock2Preview,
    keywords: ['custom', 'blank', 'placeholder'],
  },
  {
    id: 'custom-block-3',
    name: 'Custom Block 3',
    icon: <Blocks size={16} strokeWidth={1.75} />,
    category: 'General',
    description: 'Custom offer block',
    preview: CustomBlock3Preview,
    keywords: ['custom', 'blank', 'placeholder'],
  },
  {
    id: 'custom-block-4',
    name: 'Custom Block 298357983275897429857423975',
    icon: <Blocks size={16} strokeWidth={1.75} />,
    category: 'General',
    description: 'Custom offer block',
    preview: CustomBlock4Preview,
    keywords: ['custom', 'blank', 'placeholder'],
  },
  {
    id: 'custom-block-5',
    name: 'Custom Block 5',
    icon: <Blocks size={16} strokeWidth={1.75} />,
    category: 'General',
    description: 'Custom offer block',
    preview: CustomBlock5Preview,
    keywords: ['custom', 'blank', 'placeholder'],
  },
];

/* Section order in the Add Offer modal. Any category not listed here still
 * renders, appended after these, so a new one can't silently vanish. */
export const CATEGORY_ORDER = ['Retention', 'Monetization', 'General'] as const;

export const BLOCK_CATEGORIES: string[] = [
  'All',
  ...Array.from(new Set(BLOCK_REGISTRY.map((b) => b.category))),
];
