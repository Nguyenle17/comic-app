export interface CoinPackage {
  id: number;
  name: string;
  priceVnd: number;
  coinAmount: number;
  bonusCoin: number;
  isPopular?: boolean;
}

export type TransactionType = 'deposit' | 'purchase_chapter';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'vnpay' | 'momo' | 'zalopay';

export interface WalletTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  amountVnd?: number;
  status: TransactionStatus;
  description: string;
  storyTitle?: string;
  chapterTitle?: string;
  createdAt: string;
}
