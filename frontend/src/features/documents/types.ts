export interface Document {
  id: string | number;
  name: string;
  type: string;
  project: string;
  uploadedBy?: string;
  uploaded_by?: string;
  date: string;
  size: string;
}
