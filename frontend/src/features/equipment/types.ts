export interface Equipment {
  id: string | number;
  name: string;
  category: string;
  location: string;
  status: string;
  lastMaintenance?: string;
  last_maintenance?: string;
}
