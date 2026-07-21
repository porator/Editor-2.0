export interface RollingOfferItem {
  icon: string;
  amount: string;
}

export interface RollingOffer {
  items: RollingOfferItem[];
  price: string;
  oldPrice?: string;
}

export interface RollingOfferData {
  offers: RollingOffer[];
  endsIn: string;
}
