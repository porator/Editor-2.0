import type { PreviewState } from './types';
import Header from './sections/Header';
import Banner from './sections/Banner';
import CollectWidget from './sections/CollectWidget';
import Promotion from './sections/Promotion';
import Bundle from './sections/Bundle';
import RollingOffer from './sections/RollingOffer';
import ProgressBar from './sections/ProgressBar';
import Footer from './sections/Footer';

/* Section ids match the Sections tree + config-data ids so selecting a
 * section in the preview opens the matching config drawer. */
export const DEFAULT_PREVIEW_STATE: PreviewState = {
  sections: [
    {
      id: 'header',
      label: 'Header',
      component: Header,
      isVisible: true,
      data: {
        playerName: 'Royal_Princess',
        balance: '500,000,000',
        gameLogoLine1: 'Royal',
        gameLogoLine2: 'Blast',
      },
    },
    {
      id: 'banner',
      label: 'Banner',
      component: Banner,
      isVisible: true,
      data: {
        logoLine1: 'Royal',
        logoLine2: 'Blast',
        title: 'Web Store',
        subtitle: 'Up to 20% Off',
      },
    },
    {
      id: 'reward-calendar',
      label: 'Reward Calendar',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '🛡️', cta: 'COLLECT' },
    },
    /* Registry entries — rendered only when the tree has added them
     * (see useGrouping order). Popup & Daily Bonus aren't placed by default. */
    {
      id: 'popup',
      label: 'Popup',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '🏺', cta: 'COLLECT' },
    },
    {
      id: 'daily-bonus',
      label: 'Daily Bonus',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '🧪', cta: 'COLLECT' },
    },
    {
      id: 'promotion',
      label: 'Promotion',
      component: Promotion,
      isVisible: true,
      data: {
        title: 'Welcome Offer',
        items: [
          { icon: '💰', amount: '200,000', oldAmount: '100,000' },
          { icon: '👑', amount: 'x250' },
          { icon: '🧪', amount: 'x30' },
          { icon: '🧰', amount: 'x10' },
        ],
        endsIn: '22:22:22',
        availability: '2/2',
        price: '$99.90',
        oldPrice: '$104.90',
      },
    },
    {
      id: 'bundle',
      label: 'Bundle',
      component: Bundle,
      isVisible: true,
      data: {
        hero: { icon: '💰', amount: '200,000', oldAmount: '100,000' },
        items: [
          { icon: '🧪', amount: 'x50' },
          { icon: '🧪', amount: 'x50' },
          { icon: '🧪', amount: 'x50' },
          { icon: '🧪', amount: 'x50' },
          { icon: '🧪', amount: 'x50' },
          { icon: '🧪', amount: 'x50' },
        ],
        price: '$3.90',
        badgeTopLeft: 'Best Value',
        badgeTopRight: '100% MORE',
      },
    },
    {
      id: 'rolling-offer',
      label: 'Rolling Offer',
      component: RollingOffer,
      isVisible: true,
      data: {
        endsIn: '22:22:22',
        offers: [
          {
            items: [
              { icon: '💰', amount: '200,000' },
              { icon: '🧪', amount: 'x500' },
              { icon: '👑', amount: 'x200' },
              { icon: '🛡️', amount: 'x250' },
            ],
            price: '$32.90',
          },
          {
            items: [
              { icon: '💰', amount: '200,000' },
              { icon: '🧰', amount: 'x18' },
              { icon: '🗝️', amount: 'x40' },
              { icon: '✉️', amount: 'x32' },
            ],
            price: '$89.90',
            oldPrice: '$92.90',
          },
          {
            items: [
              { icon: '💰', amount: '10,000' },
              { icon: '🧪', amount: 'x50' },
              { icon: '👑', amount: 'x4' },
              { icon: '🛡️', amount: 'x28' },
            ],
            price: 'Free',
          },
        ],
      },
    },
    {
      id: 'progress-bar',
      label: 'Progress Bar',
      component: ProgressBar,
      isVisible: true,
      data: {
        title: 'Battle Pass',
        progress: 65,
        progressLabel: '650 / 1,000',
        milestones: [
          { at: 20, icon: '💰', label: '10K' },
          { at: 50, icon: '🧪', label: 'x25' },
          { at: 80, icon: '👑', label: 'x5' },
          { at: 100, icon: '🎁', label: 'Bonus' },
        ],
      },
    },
    /* Custom Block 1-5 — generic placeholder slots (Add Offer modal), reuse
     * CollectWidget like the other registry-only blocks above. */
    {
      id: 'custom-block-1',
      label: 'Custom Block 1',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '✨', cta: 'COLLECT' },
    },
    {
      id: 'custom-block-2',
      label: 'Custom Block 2',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '✨', cta: 'COLLECT' },
    },
    {
      id: 'custom-block-3',
      label: 'Custom Block 3',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '✨', cta: 'COLLECT' },
    },
    {
      id: 'custom-block-4',
      label: 'Custom Block 298357983275897429857423975',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '✨', cta: 'COLLECT' },
    },
    {
      id: 'custom-block-5',
      label: 'Custom Block 5',
      component: CollectWidget,
      isVisible: true,
      data: { icon: '✨', cta: 'COLLECT' },
    },
    {
      id: 'footer',
      label: 'Footer',
      component: Footer,
      isVisible: true,
      data: {
        gameName: 'Royal Blast',
        links: ['Support', 'Terms of Service', 'Privacy Policy', 'FAQ'],
        legal: '© 2026 Royal Blast. All rights reserved.',
      },
    },
  ],
};
