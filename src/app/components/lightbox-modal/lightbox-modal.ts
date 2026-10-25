import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-lightbox-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (lightbox().isOpen) {
      <div
        role="dialog"
        aria-modal="true"
        aria-label="High resolution photo gallery"
        class="fixed inset-0 z-60 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn"
      >
        <!-- Accessible Backdrop Click to Dismiss -->
        <button
          type="button"
          class="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer p-0"
          (click)="close()"
          aria-label="Close lightbox backdrop"
        ></button>

        <!-- Top Toolbar -->
        <div class="relative z-10 flex items-center justify-between text-white">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 rounded bg-white/20 text-xs font-semibold uppercase tracking-wider">
              {{ currentImage().tag }}
            </span>
            <span class="text-xs sm:text-sm text-stone-300">
              {{ currentImage().caption }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <span class="font-mono text-xs text-stone-400 tabular-nums">
              {{ lightbox().currentIndex + 1 }} / {{ lightbox().images.length }}
            </span>
            <button
              type="button"
              (click)="close()"
              class="w-10 h-10 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <mat-icon class="text-xl">close</mat-icon>
            </button>
          </div>
        </div>

        <!-- Center Image Display -->
        <div class="relative z-10 flex-1 flex items-center justify-center p-2 sm:p-6 pointer-events-none">
          <img
            [src]="currentImage().url"
            [alt]="currentImage().caption"
            class="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-all duration-300 pointer-events-auto"
            decoding="async"
            referrerpolicy="no-referrer"
            (error)="handleImageError($event)"
          />

          <!-- Previous Button -->
          <button
            type="button"
            (click)="prev($event)"
            class="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
            aria-label="Previous photo"
          >
            <mat-icon class="text-2xl">chevron_left</mat-icon>
          </button>

          <!-- Next Button -->
          <button
            type="button"
            (click)="next($event)"
            class="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg"
            aria-label="Next photo"
          >
            <mat-icon class="text-2xl">chevron_right</mat-icon>
          </button>
        </div>

        <!-- Bottom Thumbnails Bar -->
        <div class="relative z-10 flex items-center justify-center gap-2 overflow-x-auto p-2">
          @for (img of lightbox().images; track img.url; let i = $index) {
            <button
              type="button"
              (click)="select(i)"
              class="w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0"
              [class.border-emerald-500]="lightbox().currentIndex === i"
              [class.border-transparent]="lightbox().currentIndex !== i"
              [class.opacity-50]="lightbox().currentIndex !== i"
              [attr.aria-label]="'View image ' + (i + 1)"
            >
              <img [src]="img.url" [alt]="img.caption" class="w-full h-full object-cover" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
            </button>
          }
        </div>
      </div>
    }
  `
})
export class LightboxModal {
  readonly propertyService = inject(PropertyService);
  readonly lightbox = this.propertyService.lightboxState;

  currentImage() {
    const s = this.lightbox();
    return s.images[s.currentIndex] || { url: '', caption: '', tag: '' };
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('hero_modern_villa')) {
      target.src = '/images/hero_modern_villa_1792939739344.jpg';
    }
  }

  next(event: Event): void {
    event.stopPropagation();
    this.propertyService.nextLightboxImage();
  }

  prev(event: Event): void {
    event.stopPropagation();
    this.propertyService.prevLightboxImage();
  }

  select(i: number): void {
    this.propertyService.lightboxState.update((s) => ({ ...s, currentIndex: i }));
  }

  close(): void {
    this.propertyService.closeLightbox();
  }
}
