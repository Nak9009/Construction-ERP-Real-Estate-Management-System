export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  identity_card_number: string | null;
  created_at: string;
}
