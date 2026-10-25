import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-saved-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (propertyService.isSavedDrawerOpen()) {
      <div class="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end animate-fadeIn">
        
        <!-- Accessible Backdrop button to close -->
        <button
          type="button"
          class="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer p-0"
          (click)="close()"
          aria-label="Close saved drawer backdrop"
        ></button>

        <!-- Slide-over Drawer Panel -->
        <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 text-stone-900 border-l border-stone-200">
          
          <!-- Drawer Header -->
          <div class="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div class="flex items-center gap-2">
              <mat-icon class="text-emerald-700">favorite</mat-icon>
              <div>
                <h3 class="font-serif-display text-base font-semibold text-stone-900">Saved Residences</h3>
                <span class="text-xs text-stone-500 font-mono tabular-nums">
                  {{ propertyService.savedProperties().length }} saved portfolio listings
                </span>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close saved drawer"
            >
              <mat-icon class="text-xl">close</mat-icon>
            </button>
          </div>

          <!-- Drawer Body Content -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            @if (propertyService.savedProperties().length === 0) {
              <div class="text-center py-16 space-y-3">
                <mat-icon class="text-4xl text-stone-300">favorite_border</mat-icon>
                <h4 class="font-semibold text-stone-700 text-sm">No saved estates yet</h4>
                <p class="text-xs text-stone-500 max-w-xs mx-auto">
                  Click the heart icon on any residence to bookmark it for private review or tour scheduling.
                </p>
              </div>
            } @else {
              @for (prop of propertyService.savedProperties(); track prop.id) {
                <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-600/40 transition-all flex flex-col gap-2.5">
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      class="w-20 h-16 rounded-xl overflow-hidden p-0 border-0 cursor-pointer shrink-0"
                      (click)="viewDetails(prop)"
                      [attr.aria-label]="'View details of ' + prop.title"
                    >
                      <img
                        [src]="prop.images[0].url"
                        [alt]="prop.title"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerpolicy="no-referrer"
                        (error)="handleImageError($event)"
                      />
                    </button>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold font-mono text-stone-900 tabular-nums">
                          {{ propertyService.formatCurrency(prop.financials.price) }}
                        </span>
                        <button
                          type="button"
                          (click)="remove(prop.id)"
                          class="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                          title="Remove from saved"
                        >
                          <mat-icon class="text-sm">delete_outline</mat-icon>
                        </button>
                      </div>

                      <h4 class="font-serif-display text-sm font-semibold text-stone-900 truncate">
                        <button
                          type="button"
                          (click)="viewDetails(prop)"
                          class="text-left font-serif-display truncate hover:text-emerald-800 transition-colors cursor-pointer w-full p-0 bg-transparent border-0"
                        >
                          {{ prop.title }}
                        </button>
                      </h4>

                      <p class="text-[11px] text-stone-500 truncate">
                        {{ prop.location.neighborhood }} · {{ prop.specs.beds }}b / {{ prop.specs.baths }}ba
                      </p>
                    </div>
                  </div>

                  <!-- Quick Actions for this saved property -->
                  <div class="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/60 text-xs">
                    <button
                      type="button"
                      (click)="scheduleTour(prop)"
                      class="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <mat-icon class="text-xs">calendar_month</mat-icon>
                      <span>Tour</span>
                    </button>
                    <button
                      type="button"
                      (click)="viewDetails(prop)"
                      class="py-1.5 px-2 bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Dossier</span>
                      <mat-icon class="text-xs">arrow_forward</mat-icon>
                    </button>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Drawer Footer -->
          @if (propertyService.savedProperties().length > 0) {
            <div class="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
              <button
                type="button"
                (click)="scheduleGroupTour()"
                class="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <mat-icon class="text-base">calendar_today</mat-icon>
                <span>Schedule Itinerary Tour</span>
              </button>
            </div>
          }

        </div>
      </div>
    }
  `
})
export class SavedDrawer {
  readonly propertyService = inject(PropertyService);

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('hero_modern_villa')) {
      target.src = '/images/hero_modern_villa_1792939739344.webp';
    }
  }

  close(): void {
    this.propertyService.isSavedDrawerOpen.set(false);
  }

  remove(id: string): void {
    this.propertyService.toggleSave(id);
  }

  viewDetails(prop: Property): void {
    this.close();
    this.propertyService.openPropertyDetails(prop);
  }

  scheduleTour(prop: Property): void {
    this.close();
    this.propertyService.openTourModal(prop);
  }

  scheduleGroupTour(): void {
    const list = this.propertyService.savedProperties();
    if (list.length > 0) {
      this.close();
      this.propertyService.openTourModal(list[0]);
    }
  }
}
