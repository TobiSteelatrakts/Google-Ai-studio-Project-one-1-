import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-filter-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div id="listings-anchor" class="bg-white border-y border-stone-200 py-3.5 sm:py-4 px-3 sm:px-6 lg:px-8 shadow-xs">
      <div class="max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4">
        
        <!-- Row 1: Primary Controls Bar (Views, Status, Sort, Count) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <!-- Left side: Results Count & Horizontally scrollable Property Status tabs -->
          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span class="text-xs sm:text-sm font-semibold text-stone-900 whitespace-nowrap">
              <span class="tabular-nums font-mono text-emerald-800 text-sm sm:text-base">{{ propertyService.filteredProperties().length }}</span>
              <span class="text-stone-500 font-normal ml-1">Estates</span>
            </span>

            <span aria-hidden="true" class="text-stone-300 hidden sm:inline">|</span>

            <!-- Status Filter Segmented Control (Horizontally scrollable on mobile) -->
            <div class="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200/80 text-xs font-medium overflow-x-auto no-scrollbar touch-pan-x">
              <button
                type="button"
                (click)="setStatus('all')"
                class="px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[32px]"
                [class.bg-white]="propertyService.filterState().status === 'all'"
                [class.text-stone-900]="propertyService.filterState().status === 'all'"
                [class.shadow-xs]="propertyService.filterState().status === 'all'"
                [class.text-stone-600]="propertyService.filterState().status !== 'all'"
              >
                All Status
              </button>
              <button
                type="button"
                (click)="setStatus('available')"
                class="px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[32px]"
                [class.bg-white]="propertyService.filterState().status === 'available'"
                [class.text-emerald-900]="propertyService.filterState().status === 'available'"
                [class.shadow-xs]="propertyService.filterState().status === 'available'"
                [class.text-stone-600]="propertyService.filterState().status !== 'available'"
              >
                Available
              </button>
              <button
                type="button"
                (click)="setStatus('new_listing')"
                class="px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[32px]"
                [class.bg-white]="propertyService.filterState().status === 'new_listing'"
                [class.text-stone-900]="propertyService.filterState().status === 'new_listing'"
                [class.shadow-xs]="propertyService.filterState().status === 'new_listing'"
                [class.text-stone-600]="propertyService.filterState().status !== 'new_listing'"
              >
                New
              </button>
              <button
                type="button"
                (click)="setStatus('under_contract')"
                class="px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[32px]"
                [class.bg-white]="propertyService.filterState().status === 'under_contract'"
                [class.text-stone-900]="propertyService.filterState().status === 'under_contract'"
                [class.shadow-xs]="propertyService.filterState().status === 'under_contract'"
                [class.text-stone-600]="propertyService.filterState().status !== 'under_contract'"
              >
                Contract
              </button>
            </div>
          </div>

          <!-- Right side: Sort Selector & View Mode Switcher -->
          <div class="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
            
            <!-- Sort dropdown -->
            <div class="flex items-center gap-1.5 text-xs flex-1 sm:flex-none">
              <label for="filterSortSelect" class="text-stone-500 hidden lg:inline">Sort:</label>
              <select
                id="filterSortSelect"
                [formControl]="sortControl"
                (change)="applySort()"
                class="w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer min-h-[36px]"
              >
                <option value="newest">Featured &amp; Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="sqft-desc">Living Area: Largest First</option>
              </select>
            </div>

            <!-- View Modes (Grid / Split / Map) -->
            <div class="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/80 shrink-0">
              <button
                type="button"
                (click)="setViewMode('grid')"
                title="Card Grid View"
                class="w-8 h-8 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                [class.bg-white]="propertyService.viewMode() === 'grid'"
                [class.text-emerald-800]="propertyService.viewMode() === 'grid'"
                [class.shadow-xs]="propertyService.viewMode() === 'grid'"
                [class.text-stone-500]="propertyService.viewMode() !== 'grid'"
                aria-label="Grid view"
              >
                <mat-icon class="text-base sm:text-lg">grid_view</mat-icon>
              </button>
              <button
                type="button"
                (click)="setViewMode('split')"
                title="Split Map &amp; Listings"
                class="w-8 h-8 rounded-lg transition-all cursor-pointer hidden md:flex items-center justify-center"
                [class.bg-white]="propertyService.viewMode() === 'split'"
                [class.text-emerald-800]="propertyService.viewMode() === 'split'"
                [class.shadow-xs]="propertyService.viewMode() === 'split'"
                [class.text-stone-500]="propertyService.viewMode() !== 'split'"
                aria-label="Split view"
              >
                <mat-icon class="text-base sm:text-lg">splitscreen</mat-icon>
              </button>
              <button
                type="button"
                (click)="setViewMode('map')"
                title="Full Interactive Map"
                class="w-8 h-8 rounded-lg transition-all cursor-pointer flex items-center justify-center"
                [class.bg-white]="propertyService.viewMode() === 'map'"
                [class.text-emerald-800]="propertyService.viewMode() === 'map'"
                [class.shadow-xs]="propertyService.viewMode() === 'map'"
                [class.text-stone-500]="propertyService.viewMode() !== 'map'"
                aria-label="Map view"
              >
                <mat-icon class="text-base sm:text-lg">map</mat-icon>
              </button>
            </div>

          </div>

        </div>

        <!-- Row 2: Amenities Filters and Reset (Horizontally swipeable on mobile) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x -mx-1 px-1 py-0.5">
            <span class="text-stone-400 font-semibold text-[10px] uppercase tracking-wider shrink-0 mr-1">Features:</span>
            @for (feature of popularAmenities; track feature) {
              <button
                type="button"
                (click)="toggleAmenity(feature)"
                class="px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center gap-1 text-[11px] whitespace-nowrap shrink-0 min-h-[28px]"
                [class.bg-emerald-50]="isAmenityActive(feature)"
                [class.border-emerald-300]="isAmenityActive(feature)"
                [class.text-emerald-900]="isAmenityActive(feature)"
                [class.font-semibold]="isAmenityActive(feature)"
                [class.bg-white]="!isAmenityActive(feature)"
                [class.border-stone-200]="!isAmenityActive(feature)"
                [class.text-stone-600]="!isAmenityActive(feature)"
              >
                @if (isAmenityActive(feature)) {
                  <mat-icon class="text-xs text-emerald-700">check</mat-icon>
                }
                <span>{{ feature }}</span>
              </button>
            }
          </div>

          <!-- Reset Filter Button if any active filter -->
          @if (hasActiveFilters()) {
            <button
              type="button"
              (click)="resetFilters()"
              class="text-xs text-stone-500 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer transition-colors pt-1 sm:pt-0 shrink-0 self-end sm:self-auto"
            >
              <mat-icon class="text-sm">restart_alt</mat-icon>
              <span>Reset All Filters</span>
            </button>
          }
        </div>

      </div>
    </div>
  `
})
export class FilterBar {
  readonly propertyService = inject(PropertyService);

  readonly popularAmenities = [
    'Pool',
    'Wine Cellar',
    'Solar',
    'EV',
    'Chef Kitchen',
    'Terrace'
  ];

  readonly sortControl = new FormControl<'price-asc' | 'price-desc' | 'sqft-desc' | 'newest'>('newest');

  setViewMode(mode: 'grid' | 'split' | 'map'): void {
    this.propertyService.setViewMode(mode);
  }

  setStatus(status: string): void {
    this.propertyService.setStatus(status);
  }

  toggleAmenity(amenity: string): void {
    this.propertyService.toggleAmenity(amenity);
  }

  isAmenityActive(amenity: string): boolean {
    return this.propertyService.filterState().amenities.includes(amenity);
  }

  applySort(): void {
    const val = this.sortControl.value || 'newest';
    this.propertyService.setSortBy(val);
  }

  hasActiveFilters(): boolean {
    const s = this.propertyService.filterState();
    return (
      Boolean(s.searchQuery) ||
      s.propertyType !== 'All' ||
      s.minPrice > 0 ||
      s.maxPrice < 20000000 ||
      s.minBeds > 0 ||
      s.minBaths > 0 ||
      s.status !== 'all' ||
      s.amenities.length > 0
    );
  }

  resetFilters(): void {
    this.propertyService.resetFilters();
    this.sortControl.setValue('newest');
  }
}
