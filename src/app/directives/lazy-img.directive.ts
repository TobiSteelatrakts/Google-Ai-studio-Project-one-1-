import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TRANSPARENT_PIXEL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';

@Directive({
  selector: 'img[appLazySrc]',
  host: {
    '[src]': 'currentSource()',
    '[class.opacity-0]': '!isLoaded()',
    '[class.opacity-100]': 'isLoaded()',
    '[class.transition-opacity]': 'true',
    '[class.duration-500]': 'true',
    '(load)': 'onImageLoad()',
    '(error)': 'onImageError()'
  }
})
export class LazyImgDirective {
  readonly appLazySrc = input.required<string>();
  readonly fallbackSrc = input<string>('/images/hero_modern_villa_1792939739344.webp');

  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentSource = signal<string>(TRANSPARENT_PIXEL);
  readonly isLoaded = signal<boolean>(false);
  private hasIntersected = false;
  private observer: IntersectionObserver | null = null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      // In SSR, preserve empty pixel to avoid unnecessary early network requests
      this.currentSource.set(TRANSPARENT_PIXEL);
      return;
    }

    // Reactively watch appLazySrc changes if already in view (e.g. carousel slide change)
    effect(() => {
      const targetUrl = this.appLazySrc();
      if (this.hasIntersected && targetUrl && targetUrl !== this.currentSource()) {
        this.isLoaded.set(false);
        this.currentSource.set(targetUrl);
      }
    });

    // Check IntersectionObserver support in browser
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.loadActualImage();
              this.cleanupObserver();
              break;
            }
          }
        },
        {
          // Load image strictly when it enters within 80px of viewport
          rootMargin: '80px 0px 80px 0px',
          threshold: 0.01
        }
      );

      this.observer.observe(this.el.nativeElement);

      this.destroyRef.onDestroy(() => {
        this.cleanupObserver();
      });
    } else {
      // Fallback for older browsers without IntersectionObserver
      this.loadActualImage();
    }
  }

  private loadActualImage(): void {
    this.hasIntersected = true;
    const url = this.appLazySrc();
    if (url) {
      this.currentSource.set(url);
      // If already cached and completed synchronously by browser
      const nativeImg = this.el.nativeElement;
      if (nativeImg && nativeImg.complete && nativeImg.naturalWidth > 0 && nativeImg.src === url) {
        this.isLoaded.set(true);
      }
    }
  }

  onImageLoad(): void {
    if (this.currentSource() !== TRANSPARENT_PIXEL) {
      this.isLoaded.set(true);
    }
  }

  onImageError(): void {
    if (this.currentSource() !== this.fallbackSrc()) {
      this.currentSource.set(this.fallbackSrc());
      this.isLoaded.set(true);
    }
  }

  private cleanupObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
