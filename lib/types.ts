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

export interface IdentifiedPart {
  name: string;
  category: string;
  likelySkus: string[];
  specs: { label: string; value: string }[];
  confidence: number;
  notes?: string;
}

export type RfqStatus = 'open' | 'quoted' | 'awarded' | 'closed';

export interface Rfq {
  id: string;
  createdAt: number;
  buyer: string;
  facility: string;
  part: IdentifiedPart;
  imageDataUrl?: string;
  quantity: number;
  neededBy: string;
  urgency: 'standard' | 'rush' | 'emergency';
  notes: string;
  status: RfqStatus;
  awardedQuoteId?: string;
}

export interface Quote {
  id: string;
  rfqId: string;
  supplier: string;
  supplierTag: string;
  unitPrice: number;
  totalPrice: number;
  leadTimeDays: number;
  stockAvailable: number;
  sku: string;
  terms: string;
  submittedAt: number;
  auto?: boolean;
}

export interface Order {
  id: string;
  rfqId: string;
  quoteId: string;
  supplier: string;
  total: number;
  placedAt: number;
  eta: string;
  status: 'in_production' | 'shipped' | 'delivered';
}
