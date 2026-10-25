import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Property, PropertyAgent } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-details-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (property(); as prop) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 animate-fadeIn">
        
        <!-- Modal Dialog Surface -->
        <div class="relative bg-white w-full max-w-5xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 mt-auto sm:my-auto text-stone-900 flex flex-col max-h-[94dvh] sm:max-h-[90vh]">
          
          <!-- Sticky Header Bar -->
          <div class="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-xs font-semibold text-emerald-800 uppercase tracking-wider">{{ prop.statusLabel }}</span>
              </div>
              <span aria-hidden="true" class="text-stone-300">·</span>
              <span class="text-xs text-stone-500 font-medium truncate">{{ prop.location.neighborhood }}, {{ prop.location.city }}</span>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="toggleSave(prop.id)"
                class="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                [attr.aria-label]="isSaved(prop.id) ? 'Remove saved' : 'Save property'"
              >
                <mat-icon class="text-xl" [class.text-emerald-600]="isSaved(prop.id)">
                  {{ isSaved(prop.id) ? 'favorite' : 'favorite_border' }}
                </mat-icon>
              </button>

              <button
                type="button"
                (click)="close()"
                class="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <mat-icon class="text-xl">close</mat-icon>
              </button>
            </div>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
            
            <!-- High-Quality Image Gallery Component -->
            <div class="space-y-3">
              <!-- Active Hero Photo Button (Interactive Click to Open Fullscreen Lightbox) -->
              <div class="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-900 group">
                <button
                  type="button"
                  (click)="openLightbox()"
                  class="w-full h-full p-0 border-0 bg-transparent block cursor-pointer text-left focus:outline-none"
                  aria-label="Open full screen photograph gallery"
                >
                  <img
                    [src]="activeGalleryImage().url"
                    [alt]="prop.title + ' - ' + activeGalleryImage().caption"
                    class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                    loading="lazy"
                    decoding="async"
                    referrerpolicy="no-referrer"
                    (error)="handleImageError($event)"
                  />
                </button>
                
                <!-- Bottom Scrim & Caption -->
                <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between text-white pointer-events-none">
                  <div>
                    <span class="px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-[10px] font-semibold uppercase tracking-wider mb-1 inline-block">
                      {{ activeGalleryImage().tag }}
                    </span>
                    <p class="text-xs sm:text-sm font-medium">{{ activeGalleryImage().caption }}</p>
                  </div>
                  <span class="flex items-center gap-1 text-xs text-stone-300 font-mono tabular-nums bg-black/50 px-2.5 py-1 rounded-md">
                    <mat-icon class="text-sm">fullscreen</mat-icon>
                    <span>View Lightbox ({{ selectedImageIndex() + 1 }}/{{ prop.images.length }})</span>
                  </span>
                </div>

                <!-- Next/Prev floating arrows -->
                <button
                  type="button"
                  (click)="prevPhoto($event)"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-stone-900 cursor-pointer shadow-md opacity-80 hover:opacity-100"
                  aria-label="Previous photograph"
                >
                  <mat-icon>chevron_left</mat-icon>
                </button>
                <button
                  type="button"
                  (click)="nextPhoto($event)"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-stone-900 cursor-pointer shadow-md opacity-80 hover:opacity-100"
                  aria-label="Next photograph"
                >
                  <mat-icon>chevron_right</mat-icon>
                </button>
              </div>

              <!-- Thumbnails Strip -->
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                @for (img of prop.images; track img.url; let idx = $index) {
                  <button
                    type="button"
                    (click)="selectPhoto(idx)"
                    class="relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer"
                    [class.border-emerald-600]="selectedImageIndex() === idx"
                    [class.border-transparent]="selectedImageIndex() !== idx"
                    [class.opacity-60]="selectedImageIndex() !== idx"
                    [class.hover:opacity-100]="selectedImageIndex() !== idx"
                    [attr.aria-label]="'Select photograph ' + (idx + 1)"
                  >
                    <img
                      [src]="img.url"
                      [alt]="img.caption"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerpolicy="no-referrer"
                      (error)="handleImageError($event)"
                    />
                  </button>
                }
              </div>
            </div>

            <!-- Price & Key Title Section -->
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-stone-200">
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  <span>{{ prop.propertyType }}</span>
                  <span aria-hidden="true">·</span>
                  <span>Architect: {{ prop.specs.architect }}</span>
                </div>
                <h2 class="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 leading-tight">
                  {{ prop.title }}
                </h2>
                <p class="text-sm text-stone-500 font-medium">
                  {{ prop.location.address }}, {{ prop.location.city }}, {{ prop.location.state }} {{ prop.location.zip }}
                </p>
              </div>

              <div class="flex flex-col md:items-end justify-center shrink-0 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-stone-900 tracking-tight">
                    {{ propertyService.formatCurrency(prop.financials.price) }}
                  </span>
                </div>
                <div class="text-xs text-stone-500 font-mono mt-0.5">
                  {{ propertyService.formatCurrency(prop.financials.pricePerSqft) }}/sqft
                </div>
                <button
                  type="button"
                  (click)="openMortgagePlanner(prop.financials.price, prop.title)"
                  class="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <mat-icon class="text-sm">calculate</mat-icon>
                  <span>est. {{ propertyService.formatCurrency(prop.financials.estMonthlyMortgage) }}/mo &rarr;</span>
                </button>
              </div>
            </div>

            <!-- Unboxed Specifications Grid (Zero-Pill Discipline) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Bedrooms</span>
                <span class="text-xl font-bold font-mono tabular-nums text-stone-900">{{ prop.specs.beds }} Beds</span>
              </div>
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Bathrooms</span>
                <span class="text-xl font-bold font-mono tabular-nums text-stone-900">{{ prop.specs.baths }} Baths</span>
              </div>
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Living Area</span>
                <span class="text-xl font-bold font-mono tabular-nums text-stone-900">{{ propertyService.formatNumber(prop.specs.sqft) }} sqft</span>
              </div>
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Lot Size</span>
                <span class="text-xl font-bold font-mono tabular-nums text-stone-900">{{ propertyService.formatNumber(prop.specs.lotSizeSqft) }} sqft</span>
              </div>
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Year Built</span>
                <span class="text-lg font-bold font-mono tabular-nums text-stone-900">{{ prop.specs.yearBuilt }}</span>
              </div>
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Garage</span>
                <span class="text-lg font-bold font-mono tabular-nums text-stone-900">{{ prop.specs.garageSpaces }} Vehicles</span>
              </div>
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Ceiling Height</span>
                <span class="text-lg font-bold font-mono tabular-nums text-stone-900">{{ prop.specs.ceilingHeightFt }} ft</span>
              </div>
              <div>
                <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Energy Rating</span>
                <span class="text-xs font-semibold text-emerald-800">{{ prop.energyScore }}</span>
              </div>
            </div>

            <!-- Architectural Narrative -->
            <div class="space-y-3">
              <h3 class="font-serif-display text-xl font-semibold text-stone-900">Architectural Narrative</h3>
              <p class="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
                {{ prop.description }}
              </p>
              <div class="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                <span class="font-bold">Architect's Note:</span> {{ prop.architecturalNotes }}
              </div>
            </div>

            <!-- Features & Amenities List -->
            <div class="space-y-4">
              <h3 class="font-serif-display text-xl font-semibold text-stone-900">Curated Amenities &amp; Smart Tech</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                @for (feat of prop.features; track feat) {
                  <div class="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-medium text-stone-800">
                    <mat-icon class="text-base text-emerald-700">check_circle</mat-icon>
                    <span>{{ feat }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Architectural Floor Plans -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-serif-display text-xl font-semibold text-stone-900">Floor Plans &amp; Spatial Layout</h3>
                <span class="text-xs text-stone-500 font-mono">CAD Verified Scaled Schematics</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (plan of prop.floorPlans; track plan.name) {
                  <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
                    <div class="flex items-center justify-between border-b border-stone-200 pb-2">
                      <h4 class="font-semibold text-sm text-stone-900">{{ plan.name }}</h4>
                      <span class="font-mono text-xs font-bold text-emerald-800 tabular-nums">{{ propertyService.formatNumber(plan.sqft) }} sqft</span>
                    </div>
                    <div class="text-xs text-stone-500 font-mono">Dimensions: {{ plan.dimensions }}</div>
                    <div class="flex flex-wrap gap-1.5 pt-1">
                      @for (room of plan.rooms; track room) {
                        <span class="px-2 py-0.5 rounded bg-white border border-stone-200 text-[11px] text-stone-700 font-medium">
                          {{ room }}
                        </span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- In-Line Mortgage Quick Estimator for this Estate -->
            <div class="p-6 rounded-2xl bg-stone-900 text-white space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
                <div>
                  <h3 class="font-serif-display text-lg font-semibold text-white">Monthly Investment Estimator</h3>
                  <p class="text-xs text-stone-400">Based on a 20% down payment, 30-year fixed loan at 6.5% APR.</p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold font-mono tabular-nums text-emerald-400">
                    {{ propertyService.formatCurrency(prop.financials.estMonthlyMortgage) }}
                    <span class="text-xs font-normal text-stone-400">/mo</span>
                  </div>
                </div>
              </div>

              <!-- Quick breakdown -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-300">
                <div class="p-2.5 rounded-lg bg-stone-800/80">
                  <span class="text-stone-400 block text-[10px] uppercase">Principal &amp; Interest</span>
                  <span class="font-mono font-semibold text-white tabular-nums">
                    {{ propertyService.formatCurrency(prop.financials.estMonthlyMortgage * 0.78) }}
                  </span>
                </div>
                <div class="p-2.5 rounded-lg bg-stone-800/80">
                  <span class="text-stone-400 block text-[10px] uppercase">Property Tax</span>
                  <span class="font-mono font-semibold text-white tabular-nums">
                    {{ propertyService.formatCurrency(prop.financials.propertyTaxAnnual / 12) }}
                  </span>
                </div>
                <div class="p-2.5 rounded-lg bg-stone-800/80">
                  <span class="text-stone-400 block text-[10px] uppercase">Home Insurance</span>
                  <span class="font-mono font-semibold text-white tabular-nums">
                    {{ propertyService.formatCurrency(prop.financials.homeInsuranceAnnual / 12) }}
                  </span>
                </div>
                <div class="p-2.5 rounded-lg bg-stone-800/80">
                  <span class="text-stone-400 block text-[10px] uppercase">HOA Monthly</span>
                  <span class="font-mono font-semibold text-white tabular-nums">
                    {{ propertyService.formatCurrency(prop.financials.hoaDuesMonthly) }}
                  </span>
                </div>
              </div>

              <div class="flex justify-end pt-1">
                <button
                  type="button"
                  (click)="openMortgagePlanner(prop.financials.price, prop.title)"
                  class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Customize Rate, Down Payment &amp; Term in Full Calculator</span>
                  <mat-icon class="text-sm">chevron_right</mat-icon>
                </button>
              </div>
            </div>

            <!-- Direct Agent Contact Card Section -->
            <div class="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex items-center gap-4">
                <img
                  [src]="prop.agent.avatar"
                  [alt]="prop.agent.name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                />
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-base text-stone-900">{{ prop.agent.name }}</h4>
                    <span class="text-xs text-stone-500 font-mono">({{ prop.agent.license }})</span>
                  </div>
                  <p class="text-xs text-stone-500 mb-1">{{ prop.agent.title }}</p>
                  <div class="flex items-center gap-3 text-xs text-stone-600">
                    <span class="flex items-center gap-1 text-emerald-800 font-semibold">
                      <mat-icon class="text-xs">star</mat-icon>
                      <span class="tabular-nums">{{ prop.agent.rating }}</span>
                    </span>
                    <span aria-hidden="true" class="text-stone-300">·</span>
                    <span class="tabular-nums">{{ prop.agent.totalDeals }} Transactions Closed</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  (click)="contactAgent(prop.agent, prop)"
                  class="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <mat-icon class="text-sm text-emerald-400">mail</mat-icon>
                  <span>Inquire with Agent</span>
                </button>
                <a
                  [href]="'tel:' + prop.agent.phone"
                  class="p-2.5 rounded-xl border border-stone-300 hover:bg-stone-200 text-stone-700 transition-colors flex items-center justify-center cursor-pointer"
                  title="Direct Phone Line"
                >
                  <mat-icon class="text-base text-emerald-700">phone</mat-icon>
                </a>
              </div>
            </div>

          </div>

          <!-- Sticky Bottom CTA Action Bar for Scheduling Property Viewings -->
          <div class="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span class="text-xs text-stone-500 uppercase tracking-wider font-semibold block">Schedule Private Inspection</span>
              <span class="text-sm font-semibold text-stone-900">Book in-person private walkthrough or live video tour</span>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                (click)="openTour(prop)"
                class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-emerald-900/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <mat-icon class="text-base">calendar_month</mat-icon>
                <span>Schedule a Viewing</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class PropertyDetailsModal {
  readonly propertyService = inject(PropertyService);
  readonly property = this.propertyService.selectedProperty;

  readonly selectedImageIndex = signal<number>(0);

  activeGalleryImage() {
    const p = this.property();
    if (!p) return { url: '', caption: '', tag: '' };
    return p.images[this.selectedImageIndex()] || p.images[0];
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('hero_modern_villa')) {
      target.src = '/images/hero_modern_villa_1792939739344.jpg';
    }
  }

  selectPhoto(idx: number): void {
    this.selectedImageIndex.set(idx);
  }

  nextPhoto(event: Event): void {
    event.stopPropagation();
    const p = this.property();
    if (!p) return;
    this.selectedImageIndex.update((i) => (i + 1) % p.images.length);
  }

  prevPhoto(event: Event): void {
    event.stopPropagation();
    const p = this.property();
    if (!p) return;
    this.selectedImageIndex.update((i) => (i - 1 + p.images.length) % p.images.length);
  }

  openLightbox(): void {
    const p = this.property();
    if (!p) return;
    this.propertyService.openLightbox(p.images, this.selectedImageIndex());
  }

  isSaved(id: string): boolean {
    return this.propertyService.isSaved(id);
  }

  toggleSave(id: string): void {
    this.propertyService.toggleSave(id);
  }

  openTour(prop: Property): void {
    this.propertyService.openTourModal(prop);
  }

  contactAgent(agent: PropertyAgent, prop: Property): void {
    this.propertyService.openContactModal(agent, prop);
  }

  openMortgagePlanner(price: number, title: string): void {
    this.propertyService.openMortgageModal(price, title);
  }

  close(): void {
    this.propertyService.closePropertyDetails();
  }
}
