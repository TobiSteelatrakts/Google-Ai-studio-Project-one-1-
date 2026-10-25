import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

import { LazyImgDirective } from '../../directives/lazy-img.directive';

@Component({
  selector: 'app-property-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, LazyImgDirective],
  template: `
    <article
      (mouseenter)="onCardHover(true)"
      (mouseleave)="onCardHover(false)"
      class="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl hover:border-emerald-600/30 transition-all duration-300 flex flex-col h-full"
      [class.ring-2]="isMapHighlighted()"
      [class.ring-emerald-600]="isMapHighlighted()"
    >
      <!-- Media Gallery Container (4:3 aspect ratio) -->
      <div class="relative aspect-4/3 w-full bg-stone-200 overflow-hidden select-none">
        <!-- Main Image button -->
        <button
          type="button"
          (click)="openDetails()"
          class="w-full h-full block p-0 border-0 bg-transparent cursor-pointer text-left focus:outline-none"
          [attr.aria-label]="'View details for ' + property().title"
        >
          <img
            [appLazySrc]="currentImage().url"
            [alt]="property().title + ' - ' + currentImage().caption"
            class="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
            referrerpolicy="no-referrer"
          />
        </button>

        <!-- Soft top shadow for controls legibility -->
        <div class="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>

        <!-- Top Status & Actions Bar -->
        <div class="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-auto">
          <!-- Availability Text Indicator (Clean, non-pill) -->
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-stone-900/80 backdrop-blur-md rounded-md text-[11px] font-semibold text-white tracking-wide">
            @switch (property().status) {
              @case ('available') {
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span class="text-emerald-300">Available</span>
              }
              @case ('new_listing') {
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span class="text-amber-200">New Listing</span>
              }
              @case ('under_contract') {
                <span class="w-2 h-2 rounded-full bg-stone-400"></span>
                <span class="text-stone-300">Under Contract</span>
              }
              @case ('coming_soon') {
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span class="text-blue-200">Coming Soon</span>
              }
            }
          </div>

          <!-- Save / Favorite Button -->
          <button
            type="button"
            (click)="toggleSave($event)"
            [attr.aria-label]="isSaved() ? 'Remove from saved' : 'Save this property'"
            class="w-8 h-8 rounded-full bg-stone-900/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-stone-900 transition-colors cursor-pointer"
          >
            <mat-icon class="text-base" [class.text-emerald-400]="isSaved()">
              {{ isSaved() ? 'favorite' : 'favorite_border' }}
            </mat-icon>
          </button>
        </div>

        <!-- Image Navigation Carousel Controls (Left / Right Arrows) -->
        @if (property().images.length > 1) {
          <div class="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
            <button
              type="button"
              (click)="prevImage($event)"
              class="w-7 h-7 rounded-full bg-stone-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-stone-900 cursor-pointer shadow-sm"
              aria-label="Previous property photograph"
            >
              <mat-icon class="text-sm">chevron_left</mat-icon>
            </button>
            <button
              type="button"
              (click)="nextImage($event)"
              class="w-7 h-7 rounded-full bg-stone-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-stone-900 cursor-pointer shadow-sm"
              aria-label="Next property photograph"
            >
              <mat-icon class="text-sm">chevron_right</mat-icon>
            </button>
          </div>
        }

        <!-- Bottom Image Counter & Tag -->
        <div class="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-white z-10 pointer-events-none">
          <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs font-medium text-[10px]">
            {{ currentImage().tag }}
          </span>
          <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs font-mono tabular-nums text-[10px]">
            {{ currentImageIndex() + 1 }} / {{ property().images.length }}
          </span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-5 flex flex-col flex-1">
        
        <!-- Price & Mortgage Line -->
        <div class="flex items-baseline justify-between mb-1.5">
          <div class="flex items-baseline gap-2">
            <span class="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900 tracking-tight">
              {{ propertyService.formatCurrency(property().financials.price) }}
            </span>
            @if (property().financials.originalPrice) {
              <span class="text-xs text-stone-400 line-through tabular-nums font-mono">
                {{ propertyService.formatCurrency(property().financials.originalPrice!) }}
              </span>
            }
          </div>
          <!-- Integrated Mortgage Quick Calc Link -->
          <button
            type="button"
            (click)="openMortgage($event)"
            class="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors cursor-pointer whitespace-nowrap"
            title="Calculate monthly mortgage payment"
          >
            est. {{ propertyService.formatCurrency(property().financials.estMonthlyMortgage) }}/mo
          </button>
        </div>

        <!-- Title -->
        <h3 class="font-serif-display text-lg font-semibold text-stone-900 mb-1">
          <button
            type="button"
            (click)="openDetails()"
            class="text-left font-serif-display group-hover:text-emerald-800 transition-colors line-clamp-1 cursor-pointer w-full p-0 bg-transparent border-0"
          >
            {{ property().title }}
          </button>
        </h3>

        <!-- Location address -->
        <p class="text-xs text-stone-500 mb-3 flex items-center gap-1">
          <mat-icon class="text-xs text-stone-400">place</mat-icon>
          <span class="truncate">{{ property().location.neighborhood }}, {{ property().location.city }}</span>
        </p>

        <!-- Unboxed Metadata Line (Rule: Zero-Pill Discipline with · separators) -->
        <div class="flex items-center gap-2 text-xs text-stone-600 font-medium py-2.5 border-y border-stone-100 mb-3">
          <div class="flex items-center gap-1">
            <mat-icon class="text-sm text-emerald-700">bed</mat-icon>
            <span class="tabular-nums font-mono">{{ property().specs.beds }}</span>
            <span class="text-stone-400 font-normal">beds</span>
          </div>
          <span aria-hidden="true" class="text-stone-300">·</span>
          <div class="flex items-center gap-1">
            <mat-icon class="text-sm text-emerald-700">bathtub</mat-icon>
            <span class="tabular-nums font-mono">{{ property().specs.baths }}</span>
            <span class="text-stone-400 font-normal">baths</span>
          </div>
          <span aria-hidden="true" class="text-stone-300">·</span>
          <div class="flex items-center gap-1">
            <mat-icon class="text-sm text-emerald-700">square_foot</mat-icon>
            <span class="tabular-nums font-mono">{{ propertyService.formatNumber(property().specs.sqft) }}</span>
            <span class="text-stone-400 font-normal">sqft</span>
          </div>
          <span aria-hidden="true" class="text-stone-300">·</span>
          <span class="text-stone-500 text-[11px] truncate">{{ property().propertyType }}</span>
        </div>

        <!-- Architectural highlights snippet -->
        <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {{ property().tagline }}
        </p>

        <!-- Key Actions Bar: Agent Contact & Viewing Tour Schedule CTA -->
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 mt-auto">
          <!-- Direct Agent Contact Button -->
          <button
            type="button"
            (click)="contactAgent($event)"
            class="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <mat-icon class="text-sm text-emerald-700">mail</mat-icon>
            <span>Agent</span>
          </button>

          <!-- Schedule Viewing Tour CTA -->
          <button
            type="button"
            (click)="scheduleTour($event)"
            class="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs hover:shadow-emerald-900/20 transition-all cursor-pointer"
          >
            <mat-icon class="text-sm">calendar_today</mat-icon>
            <span>Tour</span>
          </button>
        </div>

      </div>
    </article>
  `
})
export class PropertyCard {
  readonly property = input.required<Property>();
  readonly propertyService = inject(PropertyService);

  readonly currentImageIndex = signal<number>(0);

  currentImage() {
    const images = this.property().images;
    const idx = this.currentImageIndex() % images.length;
    return images[idx] || images[0];
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('hero_modern_villa')) {
      target.src = '/images/hero_modern_villa_1792939739344.webp';
    }
  }

  isSaved(): boolean {
    return this.propertyService.isSaved(this.property().id);
  }

  isMapHighlighted(): boolean {
    const activeHover = this.propertyService.activeMapHoverId();
    const activeSelect = this.propertyService.activeMapSelectedId();
    return activeHover === this.property().id || activeSelect === this.property().id;
  }

  onCardHover(isHovered: boolean): void {
    if (isHovered) {
      this.propertyService.activeMapHoverId.set(this.property().id);
    } else if (this.propertyService.activeMapHoverId() === this.property().id) {
      this.propertyService.activeMapHoverId.set(null);
    }
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    const total = this.property().images.length;
    this.currentImageIndex.update((i) => (i - 1 + total) % total);
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    const total = this.property().images.length;
    this.currentImageIndex.update((i) => (i + 1) % total);
  }

  toggleSave(event: Event): void {
    event.stopPropagation();
    this.propertyService.toggleSave(this.property().id);
  }

  openDetails(): void {
    this.propertyService.openPropertyDetails(this.property());
  }

  openMortgage(event: Event): void {
    event.stopPropagation();
    this.propertyService.openMortgageModal(this.property().financials.price, this.property().title);
  }

  contactAgent(event: Event): void {
    event.stopPropagation();
    this.propertyService.openContactModal(this.property().agent, this.property());
  }

  scheduleTour(event: Event): void {
    event.stopPropagation();
    this.propertyService.openTourModal(this.property());
  }
}
