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

export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLineItem {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderEvent {
  ts: number;
  event: string;
  actor: string;
  detail?: string;
}

export type InvoiceStatus = 'pending' | 'invoiced' | 'paid';

export interface Order {
  id: string;
  rfqId: string;
  quoteId: string;
  supplier: string;
  total: number;
  placedAt: number;
  eta: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  timeline: OrderEvent[];
  trackingNumber?: string;
  carrier?: string;
  invoiceStatus: InvoiceStatus;
  terms: string;
  buyer: string;
  facility: string;
}

export interface Supplier {
  id: string;
  name: string;
  tag: string;
  categories: string[];
  region: string;
  verified: boolean;
  certifications: string[];
  joinedAt: number;
  logoLetter: string;
  color: string;
}

export interface SupplierScorecard {
  supplier: Supplier;
  quotesSubmitted: number;
  ordersWon: number;
  winRate: number;
  revenue: number;
  onTimeRate: number;
  qualityScore: number;
  avgLeadDays: number;
  avgResponseMinutes: number;
  priceCompetitivenessPct: number;
  activeOrders: number;
  lastActivityAt: number | null;
}
