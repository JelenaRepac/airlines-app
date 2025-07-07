export interface Voucher {
  code: string;
  discountPercentage: number;
  userId?: string;
  validUntil: string;
  used: boolean;
}
