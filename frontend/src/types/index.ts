export interface User {
  id: string;
  name: string;
  email: string;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  logo?: string;
  settings?: any;
  created_at: string;
  updated_at: string;
}
