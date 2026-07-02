export interface Transaction {
  id: string | number;
  txNumber?: string;
  tx_number?: string;
  type: string;
  category: string;
  amount: string | number;
  date: string;
  status: string;
}
