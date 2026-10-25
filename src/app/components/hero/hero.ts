import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <section class="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-stone-950 text-white">
      <!-- Background 16:9 Focal Image with Measured Scrim -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/hero_modern_villa_1792939739344.jpg"
          alt="Modern luxury architectural villa with floor-to-ceiling glass and illuminated reflection pool at dusk"
          class="w-full h-full object-cover object-center filter brightness-[0.88]"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          referrerpolicy="no-referrer"
        />
        <!-- Measured Scrim for contrast -->
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/30"></div>
      </div>

      <!-- Main Content Container -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 text-center flex flex-col items-center w-full">
        
        <!-- Subtle Top Brand Kicker (No Pill Enclosure) -->
        <div class="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3 sm:mb-4">
          <span>Private Architectural Residences</span>
          <span aria-hidden="true">·</span>
          <span>Southern California Coastal</span>
        </div>

        <!-- Headline with balance and cooling luxury typography -->
        <h1 class="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl text-balance leading-tight mb-4 sm:mb-5 drop-shadow-md">
          Where pure architectural craft meets coastal sanctuary.
        </h1>

        <!-- Concrete Value Proposition -->
        <p class="text-xs sm:text-base md:text-lg text-stone-200 max-w-2xl text-balance mb-6 sm:mb-8 font-light leading-relaxed">
          Explore curated modern villas, penthouses, and modernist estates with transparent pricing, verified floor plans, interactive map navigation, and on-demand private viewings.
        </p>

        <!-- Floating Smart Search Bar Card (Responsive on all viewports) -->
        <div class="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-5 shadow-2xl border border-white/20 text-stone-900 text-left">
          
          <!-- Category Quick Tabs (Touch pan horizontal scroll) -->
          <div class="flex items-center gap-1.5 pb-3 border-b border-stone-200/80 overflow-x-auto no-scrollbar touch-pan-x -mx-1 px-1">
            @for (type of quickTypes; track type) {
              <button
                type="button"
                (click)="selectQuickType(type)"
                class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
                [class.bg-emerald-800]="selectedType() === type"
                [class.text-white]="selectedType() === type"
                [class.text-stone-600]="selectedType() !== type"
                [class.hover:bg-stone-100]="selectedType() !== type"
              >
                {{ type }}
              </button>
            }
          </div>

          <!-- Multi-field Filter Controls Grid (1 col on mobile, 2 on tablet, 4 on desktop) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 items-center">
            
            <!-- Location / Search Input -->
            <div class="relative flex flex-col">
              <label for="heroSearchInput" class="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <mat-icon class="text-xs text-emerald-600">place</mat-icon>
                <span>Location or Keyword</span>
              </label>
              <div class="relative">
                <input
                  id="heroSearchInput"
                  type="text"
                  [formControl]="searchControl"
                  (keyup.enter)="applySearch()"
                  placeholder="e.g. Pacific Palisades, Bel-Air..."
                  class="w-full min-h-[44px] text-xs sm:text-sm font-medium bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
                @if (searchControl.value) {
                  <button
                    type="button"
                    (click)="clearSearch()"
                    class="absolute right-2.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
                    aria-label="Clear location input"
                  >
                    <mat-icon class="text-sm">close</mat-icon>
                  </button>
                }
              </div>
            </div>

            <!-- Price Range Dropdown -->
            <div class="flex flex-col">
              <label for="heroPriceSelect" class="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <mat-icon class="text-xs text-emerald-600">payments</mat-icon>
                <span>Price Bracket</span>
              </label>
              <select
                id="heroPriceSelect"
                [formControl]="priceBracketControl"
                (change)="applyPriceBracket()"
                class="w-full min-h-[44px] text-xs sm:text-sm font-medium bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent cursor-pointer transition-all"
              >
                <option value="all">Any Price</option>
                <option value="under-3m">Under $3,000,000</option>
                <option value="3m-6m">$3,000,000 – $6,000,000</option>
                <option value="6m-10m">$6,000,000 – $10,000,000</option>
                <option value="over-10m">$10,000,000+</option>
              </select>
            </div>

            <!-- Bedrooms Dropdown -->
            <div class="flex flex-col">
              <label for="heroBedsSelect" class="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <mat-icon class="text-xs text-emerald-600">bed</mat-icon>
                <span>Min Bedrooms</span>
              </label>
              <select
                id="heroBedsSelect"
                [formControl]="bedsControl"
                (change)="applyBeds()"
                class="w-full min-h-[44px] text-xs sm:text-sm font-medium bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent cursor-pointer transition-all"
              >
                <option [value]="0">Any Beds</option>
                <option [value]="2">2+ Bedrooms</option>
                <option [value]="3">3+ Bedrooms</option>
                <option [value]="4">4+ Bedrooms</option>
                <option [value]="5">5+ Bedrooms</option>
              </select>
            </div>

            <!-- Search Action CTA Button (Touch optimized) -->
            <div class="flex flex-col justify-end pt-1 sm:pt-0">
              <button
                type="button"
                (click)="applySearch()"
                class="w-full min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-emerald-900/20 transition-all cursor-pointer"
              >
                <mat-icon class="text-base">search</mat-icon>
                <span>Search {{ propertyService.filteredProperties().length }} Estates</span>
              </button>
            </div>

          </div>
        </div>

        <!-- Claim-to-Proof Strip (Quantitative Rigor, No pills) -->
        <div class="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-stone-300">
          <div class="flex items-center gap-1.5">
            <span class="font-semibold text-white tabular-nums">14 Days</span>
            <span class="text-stone-300">Average Escrow Timeline</span>
          </div>
          <span aria-hidden="true" class="text-stone-600 hidden sm:inline">·</span>
          <div class="flex items-center gap-1.5">
            <span class="font-semibold text-white tabular-nums">99.4%</span>
            <span class="text-stone-300">List-to-Sale Accuracy</span>
          </div>
          <span aria-hidden="true" class="text-stone-600 hidden sm:inline">·</span>
          <div class="flex items-center gap-1.5">
            <span class="font-semibold text-emerald-400">100% Verified</span>
            <span class="text-stone-300">Clean Title Guarantee</span>
          </div>
        </div>

      </div>
    </section>
  `
})
export class Hero {
  readonly propertyService = inject(PropertyService);

  readonly quickTypes = ['All', 'Villa', 'Penthouse', 'Modernist Estate', 'Waterfront'];
  readonly selectedType = signal<string>('All');

  readonly searchControl = new FormControl<string>('');
  readonly priceBracketControl = new FormControl<string>('all');
  readonly bedsControl = new FormControl<number>(0);

  selectQuickType(type: string): void {
    this.selectedType.set(type);
    this.propertyService.setPropertyType(type);
    this.scrollToListings();
  }

  applySearch(): void {
    const query = this.searchControl.value || '';
    this.propertyService.setSearchQuery(query);
    this.scrollToListings();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.propertyService.setSearchQuery('');
  }

  applyPriceBracket(): void {
    const val = this.priceBracketControl.value;
    switch (val) {
      case 'under-3m':
        this.propertyService.setPriceRange(0, 3000000);
        break;
      case '3m-6m':
        this.propertyService.setPriceRange(3000000, 6000000);
        break;
      case '6m-10m':
        this.propertyService.setPriceRange(6000000, 10000000);
        break;
      case 'over-10m':
        this.propertyService.setPriceRange(10000000, 50000000);
        break;
      default:
        this.propertyService.setPriceRange(0, 50000000);
    }
    this.scrollToListings();
  }

  applyBeds(): void {
    const beds = Number(this.bedsControl.value) || 0;
    this.propertyService.setMinBeds(beds);
    this.scrollToListings();
  }

  private scrollToListings(): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('listings-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
