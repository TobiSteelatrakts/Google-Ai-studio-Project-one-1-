import { Injectable, computed, signal } from '@angular/core';
import { PROPERTIES_DATA, PRIMARY_AGENT } from '../data/properties.data';
import {
  MortgageBreakdown,
  MortgageInputs,
  Property,
  PropertyAgent,
  PropertyFilterState,
  ViewingBooking
} from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  // Raw Data
  readonly allProperties = signal<Property[]>(PROPERTIES_DATA);

  // View state: 'grid' | 'split' | 'map'
  readonly viewMode = signal<'grid' | 'split' | 'map'>('grid');

  // Filter state
  readonly filterState = signal<PropertyFilterState>({
    searchQuery: '',
    propertyType: 'All',
    minPrice: 0,
    maxPrice: 20000000,
    minBeds: 0,
    minBaths: 0,
    status: 'all',
    sortBy: 'newest',
    amenities: []
  });

  // Map state
  readonly activeMapHoverId = signal<string | null>(null);
  readonly activeMapSelectedId = signal<string | null>(null);

  // Saved Properties State (persisted in localStorage if in browser)
  readonly savedPropertyIds = signal<string[]>(this.getInitialSavedIds());

  // Modal / Overlay States
  readonly selectedProperty = signal<Property | null>(null);
  readonly lightboxState = signal<{ isOpen: boolean; images: { url: string; caption: string; tag: string }[]; currentIndex: number }>({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  readonly tourModalProperty = signal<Property | null>(null);
  readonly isTourModalOpen = signal<boolean>(false);

  readonly contactModalState = signal<{ isOpen: boolean; property: Property | null; agent: PropertyAgent }>({
    isOpen: false,
    property: null,
    agent: PRIMARY_AGENT
  });

  readonly mortgageModalState = signal<{ isOpen: boolean; homePrice: number; propertyTitle?: string }>({
    isOpen: false,
    homePrice: 5450000,
    propertyTitle: 'The Solstice Glass Pavilion'
  });

  readonly isSavedDrawerOpen = signal<boolean>(false);
  readonly isMobileFilterOpen = signal<boolean>(false);

  readonly isAnyModalOpen = computed(() => {
    return !!this.selectedProperty() ||
      this.lightboxState().isOpen ||
      this.isTourModalOpen() ||
      this.contactModalState().isOpen ||
      this.mortgageModalState().isOpen ||
      this.isSavedDrawerOpen() ||
      this.isMobileFilterOpen();
  });

  // Scheduled bookings history
  readonly bookings = signal<ViewingBooking[]>([]);

  // Computed filtered properties
  readonly filteredProperties = computed(() => {
    const list = this.allProperties();
    const filter = this.filterState();
    const query = filter.searchQuery.trim().toLowerCase();

    return list.filter((p) => {
      // Search query check
      if (query) {
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchNeighborhood = p.location.neighborhood.toLowerCase().includes(query);
        const matchCity = p.location.city.toLowerCase().includes(query);
        const matchAddress = p.location.address.toLowerCase().includes(query);
        const matchType = p.propertyType.toLowerCase().includes(query);
        const matchArchitect = p.specs.architect?.toLowerCase().includes(query) ?? false;
        const matchFeatures = p.features.some((f) => f.toLowerCase().includes(query));

        if (!matchTitle && !matchNeighborhood && !matchCity && !matchAddress && !matchType && !matchArchitect && !matchFeatures) {
          return false;
        }
      }

      // Property type
      if (filter.propertyType !== 'All' && p.propertyType !== filter.propertyType) {
        return false;
      }

      // Price range
      if (p.financials.price < filter.minPrice || p.financials.price > filter.maxPrice) {
        return false;
      }

      // Beds
      if (filter.minBeds > 0 && p.specs.beds < filter.minBeds) {
        return false;
      }

      // Baths
      if (filter.minBaths > 0 && p.specs.baths < filter.minBaths) {
        return false;
      }

      // Status
      if (filter.status !== 'all' && p.status !== filter.status) {
        return false;
      }

      // Amenities filter
      if (filter.amenities.length > 0) {
        const hasAllAmenities = filter.amenities.every((req) =>
          p.features.some((feat) => feat.toLowerCase().includes(req.toLowerCase()))
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filter.sortBy) {
        case 'price-asc':
          return a.financials.price - b.financials.price;
        case 'price-desc':
          return b.financials.price - a.financials.price;
        case 'sqft-desc':
          return b.specs.sqft - a.specs.sqft;
        case 'newest':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.specs.yearBuilt - a.specs.yearBuilt;
      }
    });
  });

  // Saved properties list
  readonly savedProperties = computed(() => {
    const ids = new Set(this.savedPropertyIds());
    return this.allProperties().filter((p) => ids.has(p.id));
  });

  // Unique property types
  readonly availablePropertyTypes = computed(() => {
    const types = new Set(this.allProperties().map((p) => p.propertyType));
    return ['All', ...Array.from(types)];
  });

  private getInitialSavedIds(): string[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem('verdant_saved_estates');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // ignore
      }
    }
    // Default saved starter
    return ['prop-1'];
  }

  toggleSave(propertyId: string): void {
    const current = this.savedPropertyIds();
    let updated: string[];
    if (current.includes(propertyId)) {
      updated = current.filter((id) => id !== propertyId);
    } else {
      updated = [...current, propertyId];
    }
    this.savedPropertyIds.set(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('verdant_saved_estates', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  }

  isSaved(propertyId: string): boolean {
    return this.savedPropertyIds().includes(propertyId);
  }

  // Filter actions
  setSearchQuery(query: string): void {
    this.filterState.update((s) => ({ ...s, searchQuery: query }));
  }

  setPropertyType(type: string): void {
    this.filterState.update((s) => ({ ...s, propertyType: type }));
  }

  setPriceRange(min: number, max: number): void {
    this.filterState.update((s) => ({ ...s, minPrice: min, maxPrice: max }));
  }

  setMinBeds(beds: number): void {
    this.filterState.update((s) => ({ ...s, minBeds: beds }));
  }

  setMinBaths(baths: number): void {
    this.filterState.update((s) => ({ ...s, minBaths: baths }));
  }

  setStatus(status: string): void {
    this.filterState.update((s) => ({ ...s, status }));
  }

  setSortBy(sortBy: 'price-asc' | 'price-desc' | 'sqft-desc' | 'newest'): void {
    this.filterState.update((s) => ({ ...s, sortBy }));
  }

  toggleAmenity(amenity: string): void {
    this.filterState.update((s) => {
      const exists = s.amenities.includes(amenity);
      return {
        ...s,
        amenities: exists
          ? s.amenities.filter((a) => a !== amenity)
          : [...s.amenities, amenity]
      };
    });
  }

  resetFilters(): void {
    this.filterState.set({
      searchQuery: '',
      propertyType: 'All',
      minPrice: 0,
      maxPrice: 20000000,
      minBeds: 0,
      minBaths: 0,
      status: 'all',
      sortBy: 'newest',
      amenities: []
    });
  }

  // Views & navigation
  setViewMode(mode: 'grid' | 'split' | 'map'): void {
    this.viewMode.set(mode);
  }

  openPropertyDetails(property: Property): void {
    this.selectedProperty.set(property);
  }

  closePropertyDetails(): void {
    this.selectedProperty.set(null);
  }

  // Lightbox
  openLightbox(images: { url: string; caption: string; tag: string }[], startIndex = 0): void {
    this.lightboxState.set({
      isOpen: true,
      images,
      currentIndex: startIndex
    });
  }

  closeLightbox(): void {
    this.lightboxState.update((s) => ({ ...s, isOpen: false }));
  }

  nextLightboxImage(): void {
    this.lightboxState.update((s) => {
      const next = (s.currentIndex + 1) % s.images.length;
      return { ...s, currentIndex: next };
    });
  }

  prevLightboxImage(): void {
    this.lightboxState.update((s) => {
      const prev = (s.currentIndex - 1 + s.images.length) % s.images.length;
      return { ...s, currentIndex: prev };
    });
  }

  // Tour Booking
  openTourModal(property: Property): void {
    this.tourModalProperty.set(property);
    this.isTourModalOpen.set(true);
  }

  closeTourModal(): void {
    this.isTourModalOpen.set(false);
  }

  submitTourBooking(booking: Omit<ViewingBooking, 'id' | 'status'>): ViewingBooking {
    const newBooking: ViewingBooking = {
      ...booking,
      id: 'tour-' + Date.now(),
      status: 'confirmed'
    };
    this.bookings.update((list) => [newBooking, ...list]);
    this.isTourModalOpen.set(false);
    return newBooking;
  }

  // Agent contact
  openContactModal(agent: PropertyAgent, property: Property | null = null): void {
    this.contactModalState.set({
      isOpen: true,
      agent,
      property
    });
  }

  closeContactModal(): void {
    this.contactModalState.update((s) => ({ ...s, isOpen: false }));
  }

  // Mortgage modal
  openMortgageModal(homePrice = 5450000, propertyTitle?: string): void {
    this.mortgageModalState.set({
      isOpen: true,
      homePrice,
      propertyTitle
    });
  }

  closeMortgageModal(): void {
    this.mortgageModalState.update((s) => ({ ...s, isOpen: false }));
  }

  // Calculate Mortgage Math utility
  calculateMortgage(inputs: MortgageInputs): MortgageBreakdown {
    const loanAmount = Math.max(0, inputs.homePrice - inputs.downPaymentAmount);
    const monthlyRate = inputs.interestRate / 100 / 12;
    const totalPayments = inputs.loanTermYears * 12;

    let monthlyPrincipalInterest = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
      monthlyPrincipalInterest =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (loanAmount > 0) {
      monthlyPrincipalInterest = loanAmount / totalPayments;
    }

    const monthlyPropertyTax = (inputs.homePrice * (inputs.propertyTaxRate / 100)) / 12;
    const monthlyInsurance = inputs.annualInsurance / 12;
    const monthlyHoa = inputs.monthlyHoa;

    const totalMonthlyPayment =
      monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + monthlyHoa;

    const totalInterestPaid = Math.max(0, monthlyPrincipalInterest * totalPayments - loanAmount);
    const totalLoanCost = loanAmount + totalInterestPaid;

    return {
      loanAmount: Math.round(loanAmount),
      monthlyPrincipalInterest: Math.round(monthlyPrincipalInterest),
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      monthlyHoa: Math.round(monthlyHoa),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      totalInterestPaid: Math.round(totalInterestPaid),
      totalLoanCost: Math.round(totalLoanCost)
    };
  }

  // Format currency helper
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
