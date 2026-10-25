import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <footer class="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
        <!-- Main Footer Row -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <!-- Brand Column -->
          <div class="space-y-3 md:col-span-1">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <mat-icon class="text-base">home_work</mat-icon>
              </span>
              <span class="font-serif-display text-xl font-semibold text-white">Verdant<span class="text-emerald-400 text-xs font-sans uppercase font-bold tracking-wider ml-1">Estates</span></span>
            </div>
            <p class="text-stone-400 leading-relaxed font-normal">
              Curating rare architectural modernism, coastal sanctuaries, and sustainable luxury holdings across Southern California.
            </p>
            <div class="flex items-center gap-2 text-stone-300 pt-1">
              <mat-icon class="text-sm text-emerald-400">verified</mat-icon>
              <span class="text-[11px] font-mono">California DRE Corporate Broker #01994821</span>
            </div>
          </div>

          <!-- Quick Navigation -->
          <div>
            <h4 class="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Portfolio Portals</h4>
            <ul class="space-y-2">
              <li>
                <button type="button" (click)="filterByType('Villa')" class="hover:text-white transition-colors cursor-pointer">
                  Architectural Villas
                </button>
              </li>
              <li>
                <button type="button" (click)="filterByType('Penthouse')" class="hover:text-white transition-colors cursor-pointer">
                  Coastal Penthouses
                </button>
              </li>
              <li>
                <button type="button" (click)="filterByType('Modernist Estate')" class="hover:text-white transition-colors cursor-pointer">
                  Modernist Sanctuary Compounds
                </button>
              </li>
              <li>
                <button type="button" (click)="filterByType('Waterfront')" class="hover:text-white transition-colors cursor-pointer">
                  Private Waterfront Holdings
                </button>
              </li>
            </ul>
          </div>

          <!-- Client Services -->
          <div>
            <h4 class="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Buyer Services</h4>
            <ul class="space-y-2">
              <li>
                <button type="button" (click)="openDirectTour()" class="hover:text-white transition-colors cursor-pointer">
                  Schedule Private Viewing
                </button>
              </li>
              <li>
                <button type="button" (click)="openMortgage()" class="hover:text-white transition-colors cursor-pointer">
                  Mortgage &amp; Jumbo Loan Calculator
                </button>
              </li>
              <li>
                <button type="button" (click)="toggleMap()" class="hover:text-white transition-colors cursor-pointer">
                  Interactive Vector Map Navigation
                </button>
              </li>
              <li>
                <a href="#advisors-section" class="hover:text-white transition-colors">
                  Private Wealth Advisory Desk
                </a>
              </li>
            </ul>
          </div>

          <!-- Offices & Representation -->
          <div>
            <h4 class="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">Offices</h4>
            <p class="text-stone-300 mb-1">Pacific Palisades Gallery</p>
            <p class="text-stone-400 mb-3">15420 Sunset Boulevard, Suite 400<br/>Pacific Palisades, CA 90272</p>
            <p class="text-stone-300">Concierge Desk: <span class="font-mono text-emerald-400">+1 (310) 892-4410</span></p>
            <p class="text-stone-300">Inquiries: <span class="text-emerald-400">concierge&#64;verdantestates.com</span></p>
          </div>

        </div>

        <!-- Equal Housing & Disclaimers -->
        <div class="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1 font-semibold text-stone-300">
              <mat-icon class="text-xs">house</mat-icon>
              <span>Equal Housing Opportunity</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>All property dimensions, boundaries, and square footages are approximate.</span>
          </div>

          <div>
            &copy; 2026 Verdant Estates Luxury Realty LLC. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  `
})
export class Footer {
  readonly propertyService = inject(PropertyService);

  filterByType(type: string): void {
    this.propertyService.setPropertyType(type);
    this.scrollToAnchor('listings-anchor');
  }

  toggleMap(): void {
    this.propertyService.setViewMode('map');
    this.scrollToAnchor('listings-anchor');
  }

  openMortgage(): void {
    this.propertyService.openMortgageModal(5450000, 'The Solstice Glass Pavilion');
  }

  openDirectTour(): void {
    const prop = this.propertyService.allProperties()[0];
    this.propertyService.openTourModal(prop);
  }

  private scrollToAnchor(id: string): void {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}
