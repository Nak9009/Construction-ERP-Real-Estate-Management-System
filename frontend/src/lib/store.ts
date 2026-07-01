import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  company_id: string | null;
  phone?: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
}

interface Company {
  id: string;
  name: string;
  logo: string | null;
  address: string | null;
  status: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  company: Company | null;
  setAuth: (token: string, user: User, company: Company | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('erp_token') : null,
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('erp_user') || 'null') : null,
  company: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('erp_company') || 'null') : null,
  setAuth: (token, user, company) => {
    localStorage.setItem('erp_token', token);
    localStorage.setItem('erp_user', JSON.stringify(user));
    localStorage.setItem('erp_company', JSON.stringify(company));
    set({ token, user, company });
  },
  logout: () => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_company');
    set({ token: null, user: null, company: null });
  },
}));
