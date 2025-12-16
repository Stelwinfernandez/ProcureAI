export type UserType = 'manufacturer' | 'supplier';

export interface ManufacturerFormData {
  companyName: string;
  contactName: string;
  email: string;
  mroCategories: string;
  facilitiesCount: string;
}

export interface SupplierFormData {
  companyName: string;
  contactName: string;
  email: string;
  productLines: string;
  region: string;
}

export interface RoadmapItem {
  year: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
}
