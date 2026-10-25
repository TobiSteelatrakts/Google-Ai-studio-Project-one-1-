import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

type MapTheme = 'architectural' | 'satellite' | 'topographic';

@Component({
  selector: 'app-interactive-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="relative w-full h-[520px] lg:h-[650px] bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col select-none">
      
      <!-- Map Header & Layer Controls -->
      <div class="absolute top-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        <!-- Left: Map Theme Switcher -->
        <div class="pointer-events-auto bg-stone-900/90 backdrop-blur-md rounded-xl p-1 border border-stone-700/60 shadow-md flex items-center gap-1 text-xs">
          <button
            type="button"
            (click)="setTheme('architectural')"
            class="px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
            [class.bg-emerald-700]="theme() === 'architectural'"
            [class.text-white]="theme() === 'architectural'"
            [class.text-stone-300]="theme() !== 'architectural'"
            [class.hover:text-white]="theme() !== 'architectural'"
          >
            Architectural
          </button>
          <button
            type="button"
            (click)="setTheme('satellite')"
            class="px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
            [class.bg-emerald-700]="theme() === 'satellite'"
            [class.text-white]="theme() === 'satellite'"
            [class.text-stone-300]="theme() !== 'satellite'"
            [class.hover:text-white]="theme() !== 'satellite'"
          >
            Satellite
          </button>
          <button
            type="button"
            (click)="setTheme('topographic')"
            class="px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
            [class.bg-emerald-700]="theme() === 'topographic'"
            [class.text-white]="theme() === 'topographic'"
            [class.text-stone-300]="theme() !== 'topographic'"
            [class.hover:text-white]="theme() !== 'topographic'"
          >
            Topographic
          </button>
        </div>

        <!-- Right: Active Listings Counter & Layer Toggles -->
        <div class="pointer-events-auto flex items-center gap-2">
          <!-- Amenities Layer Toggles -->
          <div class="hidden sm:flex items-center gap-1 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-stone-700/60 text-xs text-stone-300">
            <button
              type="button"
              (click)="toggleLayer('beaches')"
              class="flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors"
              [class.text-emerald-400]="showBeaches()"
              [class.font-semibold]="showBeaches()"
            >
              <mat-icon class="text-xs">waves</mat-icon>
              <span>Coast &amp; Parks</span>
            </button>
            <span class="text-stone-600">·</span>
            <button
              type="button"
              (click)="toggleLayer('transit')"
              class="flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors"
              [class.text-emerald-400]="showTransit()"
              [class.font-semibold]="showTransit()"
            >
              <mat-icon class="text-xs">directions_transit</mat-icon>
              <span>Transit</span>
            </button>
          </div>

          <!-- Total Pins Tag -->
          <div class="bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/60 text-xs font-semibold text-stone-200">
            <span class="text-emerald-400 tabular-nums font-mono">{{ propertyService.filteredProperties().length }}</span>
            <span class="ml-1 text-stone-400 font-normal">Pins Mapped</span>
          </div>
        </div>

      </div>

      <!-- SVG & Canvas Map Surface -->
      <div
        role="region"
        aria-label="Interactive coastal real estate map"
        tabindex="0"
        class="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing transition-colors duration-500 focus:outline-none"
        [class.bg-slate-900]="theme() === 'satellite'"
        [class.bg-stone-100]="theme() === 'architectural'"
        [class.bg-emerald-950]="theme() === 'topographic'"
        (click)="deselectPin()"
        (keydown.escape)="deselectPin()"
      >
        <!-- Map Canvas / SVG Graphics -->
        <svg
          class="w-full h-full pointer-events-none"
          viewBox="0 0 1000 650"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <!-- Water Gradient -->
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              @if (theme() === 'architectural') {
                <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.8"/>
              } @else if (theme() === 'satellite') {
                <stop offset="0%" stop-color="#0c2340"/>
                <stop offset="100%" stop-color="#07172b"/>
              } @else {
                <stop offset="0%" stop-color="#064e3b" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#022c22"/>
              }
            </linearGradient>

            <!-- Parkland Gradient -->
            <linearGradient id="parkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              @if (theme() === 'architectural') {
                <stop offset="0%" stop-color="#dcfce7" stop-opacity="0.7"/>
                <stop offset="100%" stop-color="#bbf7d0" stop-opacity="0.8"/>
              } @else if (theme() === 'satellite') {
                <stop offset="0%" stop-color="#14532d" stop-opacity="0.5"/>
                <stop offset="100%" stop-color="#052e16" stop-opacity="0.8"/>
              } @else {
                <stop offset="0%" stop-color="#065f46" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#047857" stop-opacity="0.4"/>
              }
            </linearGradient>
          </defs>

          <!-- Ocean / Bay Coastline Geometry -->
          <path
            d="M 0,250 C 180,280 240,420 320,490 C 400,560 520,620 620,650 L 0,650 Z"
            fill="url(#oceanGrad)"
          />
          <path
            d="M 680,650 C 720,580 840,540 1000,560 L 1000,650 Z"
            fill="url(#oceanGrad)"
          />

          <!-- Mountain Topography Contour Lines -->
          @if (theme() === 'topographic' || theme() === 'architectural') {
            <g [attr.stroke]="theme() === 'architectural' ? '#e2e8f0' : '#047857'" stroke-width="1.2" fill="none" opacity="0.6">
              <path d="M 100,0 C 220,90 350,110 500,60 C 650,10 780,120 950,80" />
              <path d="M 80,40 C 200,130 330,150 480,100 C 630,50 760,160 930,120" />
              <path d="M 60,80 C 180,170 310,190 460,140 C 610,90 740,200 910,160" />
              <path d="M 40,120 C 160,210 290,230 440,180 C 590,130 720,240 890,200" />
            </g>
          }

          <!-- Preserved State Parks / Coastal Ridges -->
          @if (showBeaches()) {
            <polygon
              points="140,80 340,60 380,210 200,240"
              fill="url(#parkGrad)"
              stroke="#86efac"
              stroke-width="1"
              stroke-dasharray="4 3"
              opacity="0.75"
            />
            <polygon
              points="600,100 840,90 890,240 680,260"
              fill="url(#parkGrad)"
              stroke="#86efac"
              stroke-width="1"
              stroke-dasharray="4 3"
              opacity="0.75"
            />
            <text x="240" y="150" fill="#15803d" font-size="11" font-weight="600" opacity="0.8">Topanga Coastal Preserve</text>
            <text x="710" y="170" fill="#15803d" font-size="11" font-weight="600" opacity="0.8">Griffith Wildlands</text>
          }

          <!-- Major Highways & Boulevard Grid Network -->
          <g [attr.stroke]="theme() === 'satellite' ? '#334155' : (theme() === 'topographic' ? '#064e3b' : '#cbd5e1')" stroke-width="2" fill="none">
            <!-- Pacific Coast Highway (PCH) -->
            <path d="M 0,260 C 190,290 250,430 330,500 C 410,570 530,630 630,650" stroke="#059669" stroke-width="3" stroke-linecap="round"/>
            
            <!-- Sunset Boulevard -->
            <path d="M 80,180 C 280,220 520,210 740,280 C 880,320 960,340 1000,350"/>
            
            <!-- Sepulveda Canyon Corridor -->
            <path d="M 480,0 C 470,180 490,340 500,520 C 510,600 520,650 530,650"/>
            
            <!-- Wilshire Boulevard -->
            <path d="M 320,440 L 1000,410"/>
            
            <!-- Santa Monica Boulevard -->
            <path d="M 300,380 L 1000,320"/>
          </g>

          <!-- Transit Lines (when enabled) -->
          @if (showTransit()) {
            <g stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6 4" fill="none">
              <path d="M 300,480 C 450,480 620,440 850,420 L 1000,420"/>
            </g>
          }

          <!-- Neighborhood Geographic Labels -->
          <g [attr.fill]="theme() === 'architectural' ? '#475569' : '#94a3b8'" font-size="13" font-weight="700" letter-spacing="1.5">
            <text x="110" y="380">MALIBU BLUFFS</text>
            <text x="240" y="270">PACIFIC PALISADES</text>
            <text x="440" y="190">BEL-AIR PROMONTORY</text>
            <text x="640" y="470">MARINA BAY</text>
            <text x="410" y="90">ENCINO HILLS</text>
            <text x="820" y="320">ARTS DISTRICT</text>
            <text x="730" y="140">HIGHLAND PARK</text>
            <text x="80" y="590">CARMEL POINT</text>
          </g>
        </svg>

        <!-- Dynamic Property Price Pins -->
        @for (prop of propertyService.filteredProperties(); track prop.id) {
          <button
            type="button"
            class="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300 focus:outline-none"
            [style.left.%]="prop.location.mapX"
            [style.top.%]="prop.location.mapY"
            (mouseenter)="onPinHover(prop.id)"
            (mouseleave)="onPinLeave()"
            (click)="selectPin($event, prop)"
            [attr.aria-label]="prop.title + ' ' + formatShortPrice(prop.financials.price)"
          >
            <!-- Pin Badge Button -->
            <div
              class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold shadow-lg transition-transform hover:scale-110"
              [class.scale-125]="isHighlighted(prop.id)"
              [class.bg-emerald-600]="prop.status === 'available'"
              [class.text-white]="prop.status === 'available'"
              [class.bg-amber-500]="prop.status === 'new_listing'"
              [class.text-stone-950]="prop.status === 'new_listing'"
              [class.bg-stone-700]="prop.status === 'under_contract'"
              [class.text-stone-200]="prop.status === 'under_contract'"
              [class.bg-blue-600]="prop.status === 'coming_soon'"
              [class.ring-4]="isHighlighted(prop.id)"
              [class.ring-white]="isHighlighted(prop.id)"
              [class.z-30]="isHighlighted(prop.id)"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span class="tabular-nums tracking-tight">{{ formatShortPrice(prop.financials.price) }}</span>
            </div>

            <!-- Anchor triangle marker pointing down -->
            <div
              class="w-0 h-0 mx-auto border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6"
              [class.border-t-emerald-600]="prop.status === 'available'"
              [class.border-t-amber-500]="prop.status === 'new_listing'"
              [class.border-t-stone-700]="prop.status === 'under_contract'"
              [class.border-t-blue-600]="prop.status === 'coming_soon'"
            ></div>
          </button>
        }

        <!-- Interactive Selected / Hovered Property Preview Card Popup -->
        @if (activeProperty(); as active) {
          <div
            role="region"
            aria-label="Property preview card"
            tabindex="0"
            class="absolute z-40 bg-white rounded-xl shadow-2xl border border-stone-200 p-3 w-72 sm:w-80 pointer-events-auto transition-all duration-200 focus:outline-none"
            [style.left.%]="clampPopupX(active.location.mapX)"
            [style.top.%]="clampPopupY(active.location.mapY)"
            (click)="$event.stopPropagation()"
            (keydown.escape)="deselectPin()"
          >
            <!-- Close Card Button -->
            <button
              type="button"
              (click)="deselectPin()"
              class="absolute top-2 right-2 w-6 h-6 rounded-full bg-stone-900/60 text-white flex items-center justify-center hover:bg-stone-900 transition-colors z-10 cursor-pointer"
              aria-label="Close property preview"
            >
              <mat-icon class="text-xs">close</mat-icon>
            </button>

            <!-- Card Thumbnail with Status -->
            <div class="relative aspect-16/9 rounded-lg overflow-hidden mb-2 bg-stone-100">
              <img
                [src]="active.images[0].url"
                [alt]="active.title"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
                (error)="handleImageError($event)"
              />
              <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 text-[10px] font-semibold text-emerald-400">
                {{ active.statusLabel }}
              </div>
            </div>

            <!-- Card Info -->
            <div class="flex items-baseline justify-between mb-1">
              <span class="font-mono font-bold text-base text-stone-900 tabular-nums">
                {{ propertyService.formatCurrency(active.financials.price) }}
              </span>
              <span class="text-[10px] text-stone-500">
                {{ active.propertyType }}
              </span>
            </div>

            <h4 class="font-serif-display text-sm font-semibold text-stone-900 truncate mb-1">
              {{ active.title }}
            </h4>

            <div class="flex items-center gap-2 text-[11px] text-stone-600 mb-3">
              <span>{{ active.specs.beds }} beds</span>
              <span aria-hidden="true">·</span>
              <span>{{ active.specs.baths }} baths</span>
              <span aria-hidden="true">·</span>
              <span class="tabular-nums font-mono">{{ propertyService.formatNumber(active.specs.sqft) }} sqft</span>
            </div>

            <!-- Action buttons in preview popup -->
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                (click)="openTour(active)"
                class="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <mat-icon class="text-xs">calendar_month</mat-icon>
                <span>Tour</span>
              </button>
              <button
                type="button"
                (click)="openDetails(active)"
                class="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>Details</span>
                <mat-icon class="text-xs">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        }

      </div>

      <!-- Map Zoom & Center Controls (Bottom Right) -->
      <div class="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-stone-900/90 backdrop-blur-md p-1 rounded-xl border border-stone-700/60 shadow-lg text-white">
        <button
          type="button"
          (click)="zoomIn()"
          title="Zoom Map In"
          class="w-8 h-8 rounded-lg hover:bg-stone-800 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Zoom in"
        >
          <mat-icon class="text-base">add</mat-icon>
        </button>
        <div class="w-full h-px bg-stone-800"></div>
        <button
          type="button"
          (click)="zoomOut()"
          title="Zoom Map Out"
          class="w-8 h-8 rounded-lg hover:bg-stone-800 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Zoom out"
        >
          <mat-icon class="text-base">remove</mat-icon>
        </button>
        <div class="w-full h-px bg-stone-800"></div>
        <button
          type="button"
          (click)="resetMap()"
          title="Reset Map Center"
          class="w-8 h-8 rounded-lg hover:bg-stone-800 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Reset map"
        >
          <mat-icon class="text-base">my_location</mat-icon>
        </button>
      </div>

      <!-- Map Legend (Bottom Left) -->
      <div class="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700/60 text-[11px] text-stone-300">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Available</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>New Listing</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-stone-500"></span>
          <span>Under Contract</span>
        </div>
      </div>

    </div>
  `
})
export class InteractiveMap {
  readonly propertyService = inject(PropertyService);

  readonly theme = signal<MapTheme>('architectural');
  readonly showBeaches = signal<boolean>(true);
  readonly showTransit = signal<boolean>(false);
  readonly selectedPinProperty = signal<Property | null>(null);

  readonly activeProperty = computed(() => {
    if (this.selectedPinProperty()) {
      return this.selectedPinProperty();
    }
    const hoverId = this.propertyService.activeMapHoverId();
    if (hoverId) {
      return this.propertyService.allProperties().find((p) => p.id === hoverId) || null;
    }
    return null;
  });

  setTheme(theme: MapTheme): void {
    this.theme.set(theme);
  }

  toggleLayer(layer: 'beaches' | 'transit'): void {
    if (layer === 'beaches') {
      this.showBeaches.update((v) => !v);
    } else {
      this.showTransit.update((v) => !v);
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('hero_modern_villa')) {
      target.src = '/images/hero_modern_villa_1792939739344.jpg';
    }
  }

  formatShortPrice(price: number): string {
    if (price >= 1000000) {
      const m = price / 1000000;
      return `$${m.toFixed(m % 1 === 0 ? 0 : 2)}M`;
    }
    return `$${Math.round(price / 1000)}k`;
  }

  isHighlighted(id: string): boolean {
    return (
      this.propertyService.activeMapHoverId() === id ||
      this.propertyService.activeMapSelectedId() === id ||
      this.selectedPinProperty()?.id === id
    );
  }

  onPinHover(id: string): void {
    this.propertyService.activeMapHoverId.set(id);
  }

  onPinLeave(): void {
    if (!this.selectedPinProperty()) {
      this.propertyService.activeMapHoverId.set(null);
    }
  }

  selectPin(event: Event, prop: Property): void {
    event.stopPropagation();
    this.selectedPinProperty.set(prop);
    this.propertyService.activeMapSelectedId.set(prop.id);
  }

  deselectPin(): void {
    this.selectedPinProperty.set(null);
    this.propertyService.activeMapSelectedId.set(null);
    this.propertyService.activeMapHoverId.set(null);
  }

  openTour(prop: Property): void {
    this.propertyService.openTourModal(prop);
  }

  openDetails(prop: Property): void {
    this.propertyService.openPropertyDetails(prop);
  }

  zoomIn(): void {
    // Zoom in interaction
  }

  zoomOut(): void {
    // Zoom out interaction
  }

  resetMap(): void {
    this.deselectPin();
  }

  clampPopupX(mapX: number): number {
    return Math.min(Math.max(mapX - 15, 4), 65);
  }

  clampPopupY(mapY: number): number {
    return Math.min(Math.max(mapY - 30, 8), 50);
  }
}
