import type { ReactNode, ComponentType } from 'react';
import {
  Image, Package, Megaphone, Ticket, Calendar, Gift, MessageSquare,
} from 'lucide-react';
import {
  BannerPreview, BundlePreview, PromotionPreview, RollingOfferPreview,
  RewardCalendarPreview, DailyBonusPreview, PopupPreview,
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
    id: 'banner',
    name: 'Banner',
    icon: <Image size={16} strokeWidth={1.75} />,
    category: 'Promotions',
    description: 'Promotional artwork strip',
    preview: BannerPreview,
    keywords: ['hero', 'artwork', 'image', 'campaign'],
  },
  {
    id: 'promotion',
    name: 'Promotion',
    icon: <Megaphone size={16} strokeWidth={1.75} />,
    category: 'Promotions',
    description: 'Large promotional offer',
    preview: PromotionPreview,
    keywords: ['sale', 'offer', 'discount', 'welcome'],
    badge: 'New',
  },
  {
    id: 'bundle',
    name: 'Bundle',
    icon: <Package size={16} strokeWidth={1.75} />,
    category: 'Promotions',
    description: 'Multi-item purchase bundle',
    preview: BundlePreview,
    keywords: ['pack', 'items', 'products', 'combo'],
    badge: 'New',
  },
  {
    id: 'rolling-offer',
    name: 'Rolling Offer',
    icon: <Ticket size={16} strokeWidth={1.75} />,
    category: 'Promotions',
    description: 'Carousel of rotating offers',
    preview: RollingOfferPreview,
    keywords: ['carousel', 'timer', 'rotating', 'limited'],
  },
  {
    id: 'reward-calendar',
    name: 'Reward Calendar',
    icon: <Calendar size={16} strokeWidth={1.75} />,
    category: 'Rewards',
    description: 'Daily login rewards',
    preview: RewardCalendarPreview,
    keywords: ['daily', 'login', 'streak', 'calendar'],
  },
  {
    id: 'daily-bonus',
    name: 'Daily Bonus',
    icon: <Gift size={16} strokeWidth={1.75} />,
    category: 'Rewards',
    description: 'Free daily claimable bonus',
    preview: DailyBonusPreview,
    keywords: ['free', 'claim', 'gift', 'daily'],
  },
  {
    id: 'popup',
    name: 'Popup',
    icon: <MessageSquare size={16} strokeWidth={1.75} />,
    category: 'Utility',
    description: 'Triggered overlay message',
    preview: PopupPreview,
    keywords: ['modal', 'overlay', 'announcement', 'triggered'],
  },
];

export const BLOCK_CATEGORIES: string[] = [
  'All',
  ...Array.from(new Set(BLOCK_REGISTRY.map((b) => b.category))),
];
