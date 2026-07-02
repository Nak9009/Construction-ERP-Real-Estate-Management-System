export interface Contract {
  id: string;
  contract_number: string;
  customer_id?: string;
  amount: number;
  signed_date?: string;
  status: string;
}
