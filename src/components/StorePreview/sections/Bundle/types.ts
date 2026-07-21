export interface BundleItem {
  icon: string;
  amount: string;
}

export interface BundleData {
  hero: { icon: string; amount: string; oldAmount?: string };
  items: BundleItem[];
  price: string;
  badgeTopLeft?: string;
  badgeTopRight?: string;
}
