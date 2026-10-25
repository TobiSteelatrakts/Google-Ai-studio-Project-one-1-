import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PRIMARY_AGENT, SECONDARY_AGENT } from '../../data/properties.data';
import { PropertyAgent } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-advisors-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <section id="advisors-section" class="py-16 sm:py-20 bg-stone-900 text-white border-t border-stone-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-2">
              <span>Private Client Representation</span>
              <span aria-hidden="true">·</span>
              <span>Off-Market Acquisitions</span>
            </div>
            <h2 class="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white">
              Bespoke representation for discerning buyers.
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed font-normal">
            Our architectural advisors provide unlisted inventory access, structural engineering review, and private negotiation discretion.
          </p>
        </div>

        <!-- Advisors Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          @for (advisor of advisors; track advisor.id) {
            <div class="p-6 rounded-3xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:border-emerald-600/40 transition-all">
              <img
                [src]="advisor.avatar"
                [alt]="advisor.name"
                class="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-600 shrink-0 shadow-md"
                referrerpolicy="no-referrer"
                (error)="handleImageError($event)"
              />
              <div class="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h3 class="font-serif-display text-xl font-semibold text-white">{{ advisor.name }}</h3>
                  <p class="text-xs text-emerald-400 font-medium">{{ advisor.title }}</p>
                  <span class="text-[11px] text-stone-500 font-mono">{{ advisor.license }}</span>
                </div>

                <p class="text-xs text-stone-300 leading-relaxed font-normal">
                  {{ advisor.bio }}
                </p>

                <!-- Track Record Stats (No pills, clean unboxed numbers) -->
                <div class="flex items-center justify-center sm:justify-start gap-3 text-xs text-stone-400 pt-1 font-medium">
                  <div>
                    <span class="text-white font-mono font-bold tabular-nums">{{ advisor.experienceYears }}+</span>
                    <span class="text-[11px] text-stone-400 ml-1">Years</span>
                  </div>
                  <span aria-hidden="true" class="text-stone-700">·</span>
                  <div>
                    <span class="text-white font-mono font-bold tabular-nums">{{ advisor.totalDeals }}</span>
                    <span class="text-[11px] text-stone-400 ml-1">Transactions</span>
                  </div>
                  <span aria-hidden="true" class="text-stone-700">·</span>
                  <div class="text-emerald-400 flex items-center gap-0.5">
                    <mat-icon class="text-xs">star</mat-icon>
                    <span class="font-bold tabular-nums">{{ advisor.rating }}</span>
                  </div>
                </div>

                <!-- Direct Action Buttons -->
                <div class="flex items-center justify-center sm:justify-start gap-2 pt-3">
                  <button
                    type="button"
                    (click)="contactAdvisor(advisor)"
                    class="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <mat-icon class="text-xs">mail</mat-icon>
                    <span>Send Inquiry</span>
                  </button>
                  <a
                    [href]="'tel:' + advisor.phone"
                    class="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <mat-icon class="text-xs text-emerald-400">call</mat-icon>
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>
            </div>
          }
        </div>

      </div>
    </section>
  `
})
export class AdvisorsSection {
  readonly propertyService = inject(PropertyService);
  readonly advisors: PropertyAgent[] = [PRIMARY_AGENT, SECONDARY_AGENT];

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('agent_portrait')) {
      target.src = '/images/agent_portrait_1792939740440.jpg';
    }
  }

  contactAdvisor(advisor: PropertyAgent): void {
    this.propertyService.openContactModal(advisor);
  }
}
