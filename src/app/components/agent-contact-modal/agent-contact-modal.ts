import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-agent-contact-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    @if (modalState().isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-0 sm:p-6 animate-fadeIn">
        <div class="relative bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 mt-auto sm:my-auto text-stone-900 flex flex-col max-h-[94dvh] sm:max-h-[90vh]">
          
          <!-- Top Header -->
          <div class="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <mat-icon class="text-lg">support_agent</mat-icon>
              </span>
              <div>
                <h3 class="font-serif-display text-lg font-semibold text-stone-900">Direct Agent Advisory</h3>
                <p class="text-xs text-stone-500">Confidential representation &amp; property inquiries</p>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close contact modal"
            >
              <mat-icon class="text-xl">close</mat-icon>
            </button>
          </div>

          <!-- Body Container -->
          <div class="p-6 overflow-y-auto max-h-[82vh] space-y-6">
            
            @if (isSent()) {
              <!-- Sent state -->
              <div class="text-center py-8 space-y-4">
                <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <mat-icon class="text-3xl">mark_email_read</mat-icon>
                </div>
                <div class="space-y-1">
                  <span class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Message Delivered</span>
                  <h4 class="font-serif-display text-2xl font-bold text-stone-900">Inquiry Dispatched to {{ modalState().agent.name }}</h4>
                  <p class="text-xs text-stone-500 max-w-sm mx-auto">
                    {{ modalState().agent.name }} typically responds within 2 hours during market hours. A copy has been delivered to your email.
                  </p>
                </div>

                <div class="pt-4 flex justify-center">
                  <button
                    type="button"
                    (click)="close()"
                    class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            } @else {
              <!-- Agent Profile Banner -->
              <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-4">
                <img
                  [src]="modalState().agent.avatar"
                  [alt]="modalState().agent.name"
                  class="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                  (error)="handleImageError($event)"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-base text-stone-900 truncate">{{ modalState().agent.name }}</h4>
                    <span class="text-xs text-stone-400 font-mono">({{ modalState().agent.license }})</span>
                  </div>
                  <p class="text-xs text-stone-500 truncate mb-1">{{ modalState().agent.title }}</p>
                  
                  <div class="flex items-center gap-3 text-xs text-stone-600">
                    <span class="flex items-center gap-1 text-emerald-800 font-semibold">
                      <mat-icon class="text-xs">star</mat-icon>
                      <span class="tabular-nums">{{ modalState().agent.rating }}</span>
                    </span>
                    <span aria-hidden="true" class="text-stone-300">·</span>
                    <span class="tabular-nums">{{ modalState().agent.experienceYears }} Years Exp</span>
                  </div>
                </div>
              </div>

              <!-- Quick Direct Contact Channels (Call, WhatsApp, Email) -->
              <div class="grid grid-cols-3 gap-2">
                <a
                  [href]="'tel:' + modalState().agent.phone"
                  class="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-center flex flex-col items-center gap-1 transition-colors"
                >
                  <mat-icon class="text-emerald-700 text-lg">call</mat-icon>
                  <span class="text-[11px] font-semibold text-stone-800">Direct Phone</span>
                </a>

                <a
                  [href]="'mailto:' + modalState().agent.email"
                  class="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-center flex flex-col items-center gap-1 transition-colors"
                >
                  <mat-icon class="text-emerald-700 text-lg">mail</mat-icon>
                  <span class="text-[11px] font-semibold text-stone-800">Email Dossier</span>
                </a>

                <button
                  type="button"
                  (click)="prefillWhatsApp()"
                  class="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-center flex flex-col items-center gap-1 transition-colors cursor-pointer"
                >
                  <mat-icon class="text-emerald-700 text-lg">chat</mat-icon>
                  <span class="text-[11px] font-semibold text-stone-800">WhatsApp</span>
                </button>
              </div>

              <!-- Associated Property Reference if any -->
              @if (modalState().property; as prop) {
                <div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
                  <mat-icon class="text-emerald-700 text-base">home</mat-icon>
                  <div class="flex-1 truncate">
                    <span class="font-semibold text-emerald-950">Referencing:</span> {{ prop.title }} ({{ propertyService.formatCurrency(prop.financials.price) }})
                  </div>
                </div>
              }

              <!-- Inquiry Form -->
              <form [formGroup]="contactForm" class="space-y-4">
                
                <!-- Quick Topic Buttons -->
                <div class="space-y-1.5">
                  <span class="text-xs font-semibold text-stone-700 block">Topic of Inquiry</span>
                  <div class="flex flex-wrap gap-1.5">
                    @for (topic of topics; track topic) {
                      <button
                        type="button"
                        (click)="selectTopic(topic)"
                        class="px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer"
                        [class.bg-emerald-700]="selectedTopic() === topic"
                        [class.text-white]="selectedTopic() === topic"
                        [class.border-emerald-700]="selectedTopic() === topic"
                        [class.bg-white]="selectedTopic() !== topic"
                        [class.text-stone-600]="selectedTopic() !== topic"
                        [class.border-stone-200]="selectedTopic() !== topic"
                      >
                        {{ topic }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Message input -->
                <div>
                  <label for="agentContactMessage" class="text-xs font-semibold text-stone-700 block mb-1">Confidential Note / Questions *</label>
                  <textarea
                    id="agentContactMessage"
                    rows="3"
                    formControlName="message"
                    class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  ></textarea>
                  @if (contactForm.get('message')?.invalid && contactForm.get('message')?.touched) {
                    <span class="text-[10px] text-red-600 block mt-0.5">Please provide a brief note</span>
                  }
                </div>

                <!-- Client Contact Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="agentClientName" class="text-xs font-semibold text-stone-700 block mb-1">Your Name *</label>
                    <input
                      id="agentClientName"
                      type="text"
                      formControlName="name"
                      placeholder="e.g. Eleanor Vance"
                      class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label for="agentClientEmail" class="text-xs font-semibold text-stone-700 block mb-1">Email *</label>
                    <input
                      id="agentClientEmail"
                      type="email"
                      formControlName="email"
                      placeholder="eleanor@example.com"
                      class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label for="agentClientPhone" class="text-xs font-semibold text-stone-700 block mb-1">Direct Phone (Optional for SMS updates)</label>
                  <input
                    id="agentClientPhone"
                    type="tel"
                    formControlName="phone"
                    placeholder="+1 (310) 555-0199"
                    class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <!-- Submit Button -->
                <div class="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    (click)="close()"
                    class="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    (click)="submitInquiry()"
                    [disabled]="contactForm.invalid"
                    class="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <mat-icon class="text-base">send</mat-icon>
                    <span>Send Message to Agent</span>
                  </button>
                </div>

              </form>
            }

          </div>
        </div>
      </div>
    }
  `
})
export class AgentContactModal {
  readonly propertyService = inject(PropertyService);
  readonly modalState = this.propertyService.contactModalState;

  readonly isSent = signal<boolean>(false);
  readonly selectedTopic = signal<string>('Request Property Disclosure Package');

  readonly topics = [
    'Request Property Disclosure Package',
    'Inquire on Seller Financing & Terms',
    'Request Architectural CAD Floor Plans',
    'Submit Purchase Offer Letter'
  ];

  readonly contactForm = new FormGroup({
    name: new FormControl<string>('Jordan Vance', [Validators.required, Validators.minLength(2)]),
    email: new FormControl<string>('jordan.vance@example.com', [Validators.required, Validators.email]),
    phone: new FormControl<string>('+1 (310) 890-4122'),
    message: new FormControl<string>(
      'Please send the complete title disclosure, HOA bylaws, and recent architectural inspection reports for this residence.',
      [Validators.required, Validators.minLength(5)]
    )
  });

  selectTopic(topic: string): void {
    this.selectedTopic.set(topic);
    this.contactForm.get('message')?.setValue(
      `Inquiry regarding ${topic}: Please provide detailed documentation and next steps.`
    );
  }

  prefillWhatsApp(): void {
    const phone = this.modalState().agent.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${this.modalState().agent.name}, I am interested in discussing your architectural portfolio.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }

  submitInquiry(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.isSent.set(true);
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('agent_portrait')) {
      target.src = '/images/agent_portrait_1792939740440.webp';
    }
  }

  close(): void {
    this.isSent.set(false);
    this.propertyService.closeContactModal();
  }
}
