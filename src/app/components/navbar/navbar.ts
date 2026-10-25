import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <header class="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between gap-3 sm:gap-8 h-16 sm:h-20">
          
          <!-- Zone 1: Single text element wordmark -->
          <a href="#" class="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group">
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
              <mat-icon class="text-base sm:text-xl">home_work</mat-icon>
            </span>
            <span class="font-serif-display text-xl sm:text-2xl tracking-normal font-semibold">
              Verdant<span class="text-emerald-400 font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase ml-1">Estates</span>
            </span>
          </a>

          <!-- Zone 2: 4-5 clean single-line text navigation links (Desktop) -->
          <nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-300">
            <a href="#featured-estates" (click)="scrollTo('featured-estates')" class="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
              Curated Estates
            </a>
            <button type="button" (click)="toggleMapView()" class="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer">
              <mat-icon class="text-base">map</mat-icon>
              <span>Interactive Map</span>
            </button>
            <button type="button" (click)="openMortgagePlanner()" class="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer">
              <mat-icon class="text-base">calculate</mat-icon>
              <span>Mortgage Planner</span>
            </button>
            <a href="#advisors-section" (click)="scrollTo('advisors-section')" class="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0">
              Private Advisors
            </a>
          </nav>

          <!-- Zone 3: 1 primary action + Saved drawer trigger -->
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <!-- Saved Estates Button (Touch optimized) -->
            <button
              type="button"
              (click)="openSavedDrawer()"
              class="relative flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 min-h-[40px] text-xs font-medium text-stone-300 bg-stone-800/80 hover:bg-stone-700/80 rounded-xl transition-colors border border-stone-700/60 cursor-pointer"
              aria-label="View saved estates"
            >
              <mat-icon class="text-base text-emerald-400">favorite</mat-icon>
              <span class="hidden sm:inline">Saved</span>
              <span class="px-1.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold tabular-nums">
                {{ propertyService.savedPropertyIds().length }}
              </span>
            </button>

            <!-- Primary Tour CTA (Hidden on tiny mobile, shown in bottom bar / mobile menu) -->
            <button
              type="button"
              (click)="openDirectTour()"
              class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-xs font-semibold tracking-wide text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm hover:shadow-emerald-900/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <mat-icon class="text-base">calendar_month</mat-icon>
              <span>Schedule a Viewing</span>
            </button>

            <!-- Mobile menu toggle (Min 44x44px touch target) -->
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="md:hidden w-11 h-11 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 flex items-center justify-center focus:outline-none cursor-pointer border border-stone-800"
              aria-label="Toggle mobile navigation menu"
              [attr.aria-expanded]="isMobileMenuOpen()"
            >
              <mat-icon class="text-xl">{{ isMobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile dropdown drawer -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden border-t border-stone-800 bg-stone-900/98 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fadeIn">
          <a
            href="#featured-estates"
            (click)="scrollTo('featured-estates'); closeMobileMenu()"
            class="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <mat-icon class="text-emerald-400 text-base">villa</mat-icon>
            <span>Curated Estates</span>
          </a>
          <button
            type="button"
            (click)="toggleMapView(); closeMobileMenu()"
            class="w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <mat-icon class="text-emerald-400 text-base">map</mat-icon>
            <span>Interactive Vector Map</span>
          </button>
          <button
            type="button"
            (click)="openMortgagePlanner(); closeMobileMenu()"
            class="w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <mat-icon class="text-emerald-400 text-base">calculate</mat-icon>
            <span>Mortgage &amp; Investment Planner</span>
          </button>
          <a
            href="#advisors-section"
            (click)="scrollTo('advisors-section'); closeMobileMenu()"
            class="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <mat-icon class="text-emerald-400 text-base">support_agent</mat-icon>
            <span>Private Advisors Desk</span>
          </a>
          <div class="pt-3 border-t border-stone-800">
            <button
              type="button"
              (click)="openDirectTour(); closeMobileMenu()"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl cursor-pointer shadow-md transition-colors"
            >
              <mat-icon class="text-base">calendar_month</mat-icon>
              <span>Schedule Private Tour</span>
            </button>
          </div>
        </div>
      }
    </header>
  `
})
export class Navbar {
  readonly propertyService = inject(PropertyService);
  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleMapView(): void {
    const current = this.propertyService.viewMode();
    this.propertyService.setViewMode(current === 'map' ? 'grid' : 'map');
    this.scrollTo('listings-anchor');
  }

  openMortgagePlanner(): void {
    this.propertyService.openMortgageModal(5450000, 'The Solstice Glass Pavilion');
  }

  openSavedDrawer(): void {
    this.propertyService.isSavedDrawerOpen.set(true);
  }

  openDirectTour(): void {
    const firstAvailable = this.propertyService.allProperties().find((p) => p.status === 'available') || this.propertyService.allProperties()[0];
    this.propertyService.openTourModal(firstAvailable);
  }

  scrollTo(elementId: string): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
