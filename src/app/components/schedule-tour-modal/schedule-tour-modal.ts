import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ViewingBooking } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

interface CalendarDay {
  dateStr: string;
  dayName: string;
  dayNum: string;
  monthName: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-schedule-tour-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    @if (isOpen(); as prop) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-0 sm:p-6 animate-fadeIn">
        <div class="relative bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 mt-auto sm:my-auto text-stone-900 flex flex-col max-h-[94dvh] sm:max-h-[90vh]">
          
          <!-- Modal Top Header -->
          <div class="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <mat-icon class="text-lg">calendar_month</mat-icon>
              </span>
              <div>
                <h3 class="font-serif-display text-lg font-semibold text-stone-900">Schedule Private Viewing</h3>
                <p class="text-xs text-stone-500">Concierge inspection appointment with assigned advisor</p>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close booking modal"
            >
              <mat-icon class="text-xl">close</mat-icon>
            </button>
          </div>

          <!-- Body Container -->
          <div class="p-6 overflow-y-auto max-h-[80vh] space-y-6">
            
            @if (confirmedBooking(); as booking) {
              <!-- Confirmation Success State -->
              <div class="text-center py-6 space-y-4">
                <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <mat-icon class="text-3xl">task_alt</mat-icon>
                </div>

                <div class="space-y-1">
                  <span class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Appointment Confirmed</span>
                  <h4 class="font-serif-display text-2xl font-bold text-stone-900">Your Private Viewing is Booked</h4>
                  <p class="text-xs text-stone-500 max-w-md mx-auto">
                    A confirmation packet and calendar invitation have been dispatched to <span class="font-semibold text-stone-800">{{ booking.buyerEmail }}</span>.
                  </p>
                </div>

                <!-- Booking Summary Card -->
                <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left max-w-lg mx-auto space-y-3">
                  <div class="flex items-start justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h5 class="font-semibold text-stone-900 text-sm">{{ booking.propertyTitle }}</h5>
                      <p class="text-xs text-stone-500">{{ booking.propertyAddress }}</p>
                    </div>
                    <span class="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                      {{ propertyService.formatCurrency(booking.propertyPrice) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span class="text-stone-400 block text-[10px] uppercase font-semibold">Date &amp; Time</span>
                      <span class="font-semibold text-stone-900">{{ booking.date }} at {{ booking.timeSlot }}</span>
                    </div>
                    <div>
                      <span class="text-stone-400 block text-[10px] uppercase font-semibold">Format</span>
                      <span class="font-semibold text-stone-900 capitalize">{{ booking.tourType === 'in-person' ? 'Private In-Person Tour' : 'Live 4K Walkthrough' }}</span>
                    </div>
                    <div>
                      <span class="text-stone-400 block text-[10px] uppercase font-semibold">Assigned Specialist</span>
                      <span class="font-semibold text-stone-900">{{ booking.agentName }}</span>
                    </div>
                    <div>
                      <span class="text-stone-400 block text-[10px] uppercase font-semibold">Reference ID</span>
                      <span class="font-mono font-bold text-emerald-800">{{ booking.id }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    (click)="downloadCalendarFile(booking)"
                    class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <mat-icon class="text-sm">event</mat-icon>
                    <span>Add to Calendar (.ics)</span>
                  </button>
                  <button
                    type="button"
                    (click)="close()"
                    class="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Return to Estates
                  </button>
                </div>
              </div>
            } @else {
              <!-- Step Form -->
              <!-- Property Miniature Preview -->
              <div class="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <img
                  [src]="prop.images[0].url"
                  [alt]="prop.title"
                  class="w-16 h-14 object-cover rounded-xl"
                  referrerpolicy="no-referrer"
                  (error)="handleImageError($event)"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-sm text-stone-900 truncate">{{ prop.title }}</h4>
                  <p class="text-xs text-stone-500 truncate">{{ prop.location.address }}, {{ prop.location.neighborhood }}</p>
                  <span class="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                    {{ propertyService.formatCurrency(prop.financials.price) }}
                  </span>
                </div>
              </div>

              <!-- Tour Type Segmented Selector -->
              <div class="space-y-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Select Viewing Experience
                </span>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    (click)="setTourType('in-person')"
                    class="p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1"
                    [class.border-emerald-600]="tourType() === 'in-person'"
                    [class.bg-emerald-50/50]="tourType() === 'in-person'"
                    [class.ring-1]="tourType() === 'in-person'"
                    [class.ring-emerald-600]="tourType() === 'in-person'"
                    [class.border-stone-200]="tourType() !== 'in-person'"
                    [class.hover:bg-stone-50]="tourType() !== 'in-person'"
                  >
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-emerald-700 text-base">directions_walk</mat-icon>
                      <span class="text-xs font-bold text-stone-900">In-Person Private Tour</span>
                    </div>
                    <span class="text-[11px] text-stone-500 leading-tight">Private walkthrough with champagne reception &amp; architect dossier.</span>
                  </button>

                  <button
                    type="button"
                    (click)="setTourType('video-walkthrough')"
                    class="p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1"
                    [class.border-emerald-600]="tourType() === 'video-walkthrough'"
                    [class.bg-emerald-50/50]="tourType() === 'video-walkthrough'"
                    [class.ring-1]="tourType() === 'video-walkthrough'"
                    [class.ring-emerald-600]="tourType() === 'video-walkthrough'"
                    [class.border-stone-200]="tourType() !== 'video-walkthrough'"
                    [class.hover:bg-stone-50]="tourType() !== 'video-walkthrough'"
                  >
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-emerald-700 text-base">videocam</mat-icon>
                      <span class="text-xs font-bold text-stone-900">Live 4K Walkthrough</span>
                    </div>
                    <span class="text-[11px] text-stone-500 leading-tight">Interactive real-time video stream for global remote clients.</span>
                  </button>
                </div>
              </div>

              <!-- Interactive Date Picker (Next 7 Upcoming Dates) -->
              <div class="space-y-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Select Preferred Date
                </span>
                <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  @for (day of calendarDays; track day.dateStr) {
                    <button
                      type="button"
                      (click)="selectDate(day.dateStr)"
                      class="p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center"
                      [class.border-emerald-600]="selectedDate() === day.dateStr"
                      [class.bg-emerald-700]="selectedDate() === day.dateStr"
                      [class.text-white]="selectedDate() === day.dateStr"
                      [class.border-stone-200]="selectedDate() !== day.dateStr"
                      [class.bg-stone-50]="selectedDate() !== day.dateStr"
                      [class.text-stone-700]="selectedDate() !== day.dateStr"
                      [class.hover:border-emerald-400]="selectedDate() !== day.dateStr"
                    >
                      <span class="text-[10px] uppercase font-semibold tracking-wider opacity-75">{{ day.dayName }}</span>
                      <span class="text-base font-bold font-mono tabular-nums">{{ day.dayNum }}</span>
                      <span class="text-[9px] opacity-75">{{ day.monthName }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Time Slot Selector -->
              <div class="space-y-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                  Select Time Window
                </span>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  @for (slot of availableTimeSlots; track slot) {
                    <button
                      type="button"
                      (click)="selectTime(slot)"
                      class="py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      [class.border-emerald-600]="selectedTime() === slot"
                      [class.bg-emerald-50]="selectedTime() === slot"
                      [class.text-emerald-900]="selectedTime() === slot"
                      [class.border-stone-200]="selectedTime() !== slot"
                      [class.text-stone-700]="selectedTime() !== slot"
                      [class.hover:bg-stone-50]="selectedTime() !== slot"
                    >
                      <mat-icon class="text-xs text-emerald-700">schedule</mat-icon>
                      <span>{{ slot }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Buyer Information Form -->
              <form [formGroup]="bookingForm" class="space-y-4 pt-2 border-t border-stone-200">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="buyerFullNameInput" class="text-xs font-semibold text-stone-700 block mb-1">Full Legal Name *</label>
                    <input
                      id="buyerFullNameInput"
                      type="text"
                      formControlName="name"
                      placeholder="e.g. Jordan Vance"
                      class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    @if (bookingForm.get('name')?.invalid && bookingForm.get('name')?.touched) {
                      <span class="text-[10px] text-red-600 block mt-0.5">Please provide your name</span>
                    }
                  </div>

                  <div>
                    <label for="buyerEmailInput" class="text-xs font-semibold text-stone-700 block mb-1">Email Address *</label>
                    <input
                      id="buyerEmailInput"
                      type="email"
                      formControlName="email"
                      placeholder="jordan.vance@example.com"
                      class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    @if (bookingForm.get('email')?.invalid && bookingForm.get('email')?.touched) {
                      <span class="text-[10px] text-red-600 block mt-0.5">Valid email address required</span>
                    }
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="buyerPhoneInput" class="text-xs font-semibold text-stone-700 block mb-1">Direct Phone Number *</label>
                    <input
                      id="buyerPhoneInput"
                      type="tel"
                      formControlName="phone"
                      placeholder="+1 (310) 555-0199"
                      class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    @if (bookingForm.get('phone')?.invalid && bookingForm.get('phone')?.touched) {
                      <span class="text-[10px] text-red-600 block mt-0.5">Contact phone is required</span>
                    }
                  </div>

                  <div class="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="preApproved"
                      formControlName="preApproved"
                      class="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-600 cursor-pointer"
                    />
                    <label for="preApproved" class="text-xs text-stone-600 font-medium cursor-pointer">
                      Pre-approved financing / Cash buyer verified
                    </label>
                  </div>
                </div>

                <div>
                  <label for="specialInquiriesArea" class="text-xs font-semibold text-stone-700 block mb-1">Special Inquiries or Architectural Focus</label>
                  <textarea
                    id="specialInquiriesArea"
                    rows="2"
                    formControlName="notes"
                    placeholder="Specific requests, confidentiality requirements, or architectural questions..."
                    class="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  ></textarea>
                </div>
              </form>

              <!-- Modal Submit Action Bar -->
              <div class="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  (click)="close()"
                  class="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  (click)="confirmBooking()"
                  [disabled]="bookingForm.invalid"
                  class="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <mat-icon class="text-base">verified</mat-icon>
                  <span>Confirm Viewing Appointment</span>
                </button>
              </div>
            }

          </div>
        </div>
      </div>
    }
  `
})
export class ScheduleTourModal {
  readonly propertyService = inject(PropertyService);
  readonly isOpen = this.propertyService.tourModalProperty;

  readonly tourType = signal<'in-person' | 'video-walkthrough'>('in-person');
  readonly selectedDate = signal<string>('');
  readonly selectedTime = signal<string>('11:30 AM');
  readonly confirmedBooking = signal<ViewingBooking | null>(null);

  readonly calendarDays: CalendarDay[] = this.generateDays();
  readonly availableTimeSlots = [
    '10:00 AM',
    '11:30 AM',
    '1:30 PM',
    '3:00 PM',
    '4:30 PM',
    '6:00 PM (Sunset)'
  ];

  readonly bookingForm = new FormGroup({
    name: new FormControl<string>('Jordan Vance', [Validators.required, Validators.minLength(2)]),
    email: new FormControl<string>('jordan.vance@example.com', [Validators.required, Validators.email]),
    phone: new FormControl<string>('+1 (310) 890-4122', [Validators.required, Validators.minLength(7)]),
    preApproved: new FormControl<boolean>(true),
    notes: new FormControl<string>('Interested in private pool equipment specifications and solar efficiency records.')
  });

  constructor() {
    if (this.calendarDays.length > 0) {
      this.selectedDate.set(this.calendarDays[1].dateStr);
    }
  }

  setTourType(type: 'in-person' | 'video-walkthrough'): void {
    this.tourType.set(type);
  }

  selectDate(d: string): void {
    this.selectedDate.set(d);
  }

  selectTime(t: string): void {
    this.selectedTime.set(t);
  }

  confirmBooking(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    const prop = this.isOpen();
    if (!prop) return;

    const val = this.bookingForm.value;
    const booking = this.propertyService.submitTourBooking({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyPrice: prop.financials.price,
      propertyAddress: `${prop.location.address}, ${prop.location.city}`,
      agentName: prop.agent.name,
      tourType: this.tourType(),
      date: this.selectedDate(),
      timeSlot: this.selectedTime(),
      buyerName: val.name || '',
      buyerEmail: val.email || '',
      buyerPhone: val.phone || '',
      preApproved: Boolean(val.preApproved),
      notes: val.notes || ''
    });

    this.confirmedBooking.set(booking);
  }

  downloadCalendarFile(booking: ViewingBooking): void {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Verdant Luxury Real Estate//Tour Scheduler//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Private Tour: ${booking.propertyTitle}`,
      `DESCRIPTION:Private viewing of ${booking.propertyTitle} with ${booking.agentName}. Address: ${booking.propertyAddress}`,
      `LOCATION:${booking.propertyAddress}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Viewing-${booking.id}.ics`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('hero_modern_villa')) {
      target.src = '/images/hero_modern_villa_1792939739344.jpg';
    }
  }

  close(): void {
    this.confirmedBooking.set(null);
    this.propertyService.closeTourModal();
  }

  private generateDays(): CalendarDay[] {
    const list: CalendarDay[] = [];
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dName = dayNames[d.getDay()];
      const mName = monthNames[d.getMonth()];
      const dNum = String(d.getDate()).padStart(2, '0');
      list.push({
        dateStr: `${mName} ${dNum}, ${d.getFullYear()}`,
        dayName: dName,
        dayNum: dNum,
        monthName: mName,
        isAvailable: true
      });
    }
    return list;
  }
}
