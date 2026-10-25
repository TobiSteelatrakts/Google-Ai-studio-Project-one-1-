export type PropertyStatus = 'available' | 'under_contract' | 'new_listing' | 'coming_soon';
export type PropertyType = 'Villa' | 'Penthouse' | 'Modernist Estate' | 'Waterfront' | 'Architectural Studio' | 'Townhome';

export interface PropertyAgent {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  license: string;
  avatar: string;
  rating: number;
  experienceYears: number;
  totalDeals: number;
  bio: string;
}

export interface PropertyLocation {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  mapX: number; // Normalized coordinate 0 - 100 for vector map
  mapY: number; // Normalized coordinate 0 - 100 for vector map
  walkScore: number;
  transitScore: number;
  schoolRating: string;
}

export interface PropertySpecs {
  beds: number;
  baths: number;
  sqft: number;
  lotSizeSqft: number;
  yearBuilt: number;
  garageSpaces: number;
  stories: number;
  architect?: string;
  ceilingHeightFt: number;
}

export interface PropertyFinancials {
  price: number;
  originalPrice?: number;
  estMonthlyMortgage: number;
  propertyTaxAnnual: number;
  hoaDuesMonthly: number;
  homeInsuranceAnnual: number;
  pricePerSqft: number;
}

export interface FloorPlanLevel {
  name: string;
  sqft: number;
  rooms: string[];
  dimensions: string;
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  status: PropertyStatus;
  statusLabel: string;
  propertyType: PropertyType;
  featured: boolean;
  location: PropertyLocation;
  specs: PropertySpecs;
  financials: PropertyFinancials;
  features: string[];
  energyScore: string;
  description: string;
  architecturalNotes: string;
  images: { url: string; caption: string; tag: string }[];
  floorPlans: FloorPlanLevel[];
  agent: PropertyAgent;
  virtualTourUrl?: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  status: string;
  sortBy: 'price-asc' | 'price-desc' | 'sqft-desc' | 'newest';
  amenities: string[];
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  propertyAddress: string;
  agentName: string;
  tourType: 'in-person' | 'video-walkthrough';
  date: string;
  timeSlot: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  notes?: string;
  preApproved: boolean;
  status: 'confirmed' | 'pending';
}

export interface MortgageInputs {
  homePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanTermYears: number;
  interestRate: number;
  propertyTaxRate: number; // percentage, e.g. 1.15
  annualInsurance: number;
  monthlyHoa: number;
}

export interface MortgageBreakdown {
  loanAmount: number;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  totalLoanCost: number;
}
