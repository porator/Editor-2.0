export interface PromoItem {
  icon: string;
  amount: string;
  oldAmount?: string;
}

export interface PromotionData {
  title: string;
  items: PromoItem[];
  price: string;
  oldPrice?: string;
  endsIn: string;
  availability: string;
}
