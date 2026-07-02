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

export interface DashboardMetrics {
  total_users: number;
  active_projects: number;
  monthly_sales: number;
  open_maintenance_requests: number;
}
