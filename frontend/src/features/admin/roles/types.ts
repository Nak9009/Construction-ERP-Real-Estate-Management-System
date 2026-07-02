export interface Role {
  id: string | number;
  name: string; // Typically Spatie/Laravel-permission uses 'name'
  roleName?: string;
  users?: number;
  accessLevel?: string;
  status?: string;
}
