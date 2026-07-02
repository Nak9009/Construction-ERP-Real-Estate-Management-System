export interface Contractor {
  id: string | number;
  company?: string;
  name?: string;
  trade?: string;
  specialty?: string;
  rating?: string | number;
  status: string;
  activeWorkers?: number;
  active_workers?: number;
}
