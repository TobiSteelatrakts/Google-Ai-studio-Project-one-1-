import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MortgageBreakdown } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-mortgage-calculator-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    @if (modalState().isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex justify-center p-0 sm:p-6 animate-fadeIn">
        <div class="relative bg-white w-full max-w-3xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 mt-auto sm:my-auto text-stone-900 flex flex-col max-h-[94dvh] sm:max-h-[90vh]">
          
          <!-- Top Header -->
          <div class="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <mat-icon class="text-lg">calculate</mat-icon>
              </span>
              <div>
                <h3 class="font-serif-display text-lg font-semibold text-stone-900">Integrated Mortgage Planner</h3>
                <p class="text-xs text-stone-500">
                  @if (modalState().propertyTitle) {
                    Calculated for: <span class="font-medium text-stone-800">{{ modalState().propertyTitle }}</span>
                  } @else {
                    Bespoke financing modeler for architectural investments
                  }
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close mortgage calculator"
            >
              <mat-icon class="text-xl">close</mat-icon>
            </button>
          </div>

          <!-- Body Container -->
          <div class="p-6 overflow-y-auto max-h-[82vh] space-y-6">
            
            <!-- Result Highlight Hero Card -->
            <div class="p-6 rounded-2xl bg-stone-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
              <div class="space-y-1">
                <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Estimated Total Monthly Payment</span>
                <div class="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-white">
                  {{ propertyService.formatCurrency(breakdown().totalMonthlyPayment) }}
                  <span class="text-sm font-normal text-stone-400">/mo</span>
                </div>
                <p class="text-xs text-stone-400">
                  Loan Amount: <span class="font-mono text-stone-200">{{ propertyService.formatCurrency(breakdown().loanAmount) }}</span>
                </p>
              </div>

              <!-- Visual Proportion Bar -->
              <div class="w-full sm:w-64 space-y-2">
                <div class="h-3 w-full bg-stone-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    class="bg-emerald-500 h-full transition-all duration-300"
                    [style.width.%]="piPercent()"
                    title="Principal & Interest"
                  ></div>
                  <div
                    class="bg-sky-500 h-full transition-all duration-300"
                    [style.width.%]="taxPercent()"
                    title="Property Tax"
                  ></div>
                  <div
                    class="bg-amber-500 h-full transition-all duration-300"
                    [style.width.%]="insPercent()"
                    title="Home Insurance"
                  ></div>
                  <div
                    class="bg-purple-500 h-full transition-all duration-300"
                    [style.width.%]="hoaPercent()"
                    title="HOA Dues"
                  ></div>
                </div>

                <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-stone-400">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span class="truncate font-mono tabular-nums">P&amp;I: {{ propertyService.formatCurrency(breakdown().monthlyPrincipalInterest) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                    <span class="truncate font-mono tabular-nums">Tax: {{ propertyService.formatCurrency(breakdown().monthlyPropertyTax) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span class="truncate font-mono tabular-nums">Ins: {{ propertyService.formatCurrency(breakdown().monthlyInsurance) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                    <span class="truncate font-mono tabular-nums">HOA: {{ propertyService.formatCurrency(breakdown().monthlyHoa) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interactive Inputs Form -->
            <form [formGroup]="calcForm" class="space-y-5">
              
              <!-- Home Price Input & Slider -->
              <div class="space-y-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div class="flex items-center justify-between">
                  <label for="calcHomePrice" class="text-xs font-semibold text-stone-700">Estate Acquisition Price</label>
                  <span class="text-sm font-bold font-mono text-emerald-900 tabular-nums">
                    {{ propertyService.formatCurrency(calcForm.get('homePrice')?.value || 0) }}
                  </span>
                </div>
                <input
                  id="calcHomePrice"
                  type="range"
                  formControlName="homePrice"
                  min="1000000"
                  max="20000000"
                  step="50000"
                  class="w-full accent-emerald-600 cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>$1,000,000</span>
                  <span>$10,000,000</span>
                  <span>$20,000,000</span>
                </div>
              </div>

              <!-- Down Payment (% and $) -->
              <div class="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div class="flex items-center justify-between">
                  <label for="calcDownPercent" class="text-xs font-semibold text-stone-700">Down Payment</label>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-stone-600 tabular-nums">
                      {{ calcForm.get('downPercent')?.value }}%
                    </span>
                    <span class="text-xs font-bold font-mono text-emerald-900 tabular-nums">
                      ({{ propertyService.formatCurrency(downPaymentDollar()) }})
                    </span>
                  </div>
                </div>

                <!-- Down payment presets -->
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="setDownPercent(10)"
                    class="px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer"
                    [class.bg-emerald-700]="calcForm.get('downPercent')?.value === 10"
                    [class.text-white]="calcForm.get('downPercent')?.value === 10"
                    [class.border-emerald-700]="calcForm.get('downPercent')?.value === 10"
                    [class.bg-white]="calcForm.get('downPercent')?.value !== 10"
                    [class.border-stone-200]="calcForm.get('downPercent')?.value !== 10"
                  >
                    10%
                  </button>
                  <button
                    type="button"
                    (click)="setDownPercent(20)"
                    class="px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer"
                    [class.bg-emerald-700]="calcForm.get('downPercent')?.value === 20"
                    [class.text-white]="calcForm.get('downPercent')?.value === 20"
                    [class.border-emerald-700]="calcForm.get('downPercent')?.value === 20"
                    [class.bg-white]="calcForm.get('downPercent')?.value !== 20"
                    [class.border-stone-200]="calcForm.get('downPercent')?.value !== 20"
                  >
                    20% (Standard)
                  </button>
                  <button
                    type="button"
                    (click)="setDownPercent(30)"
                    class="px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer"
                    [class.bg-emerald-700]="calcForm.get('downPercent')?.value === 30"
                    [class.text-white]="calcForm.get('downPercent')?.value === 30"
                    [class.border-emerald-700]="calcForm.get('downPercent')?.value === 30"
                    [class.bg-white]="calcForm.get('downPercent')?.value !== 30"
                    [class.border-stone-200]="calcForm.get('downPercent')?.value !== 30"
                  >
                    30%
                  </button>
                  <button
                    type="button"
                    (click)="setDownPercent(40)"
                    class="px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer"
                    [class.bg-emerald-700]="calcForm.get('downPercent')?.value === 40"
                    [class.text-white]="calcForm.get('downPercent')?.value === 40"
                    [class.border-emerald-700]="calcForm.get('downPercent')?.value === 40"
                    [class.bg-white]="calcForm.get('downPercent')?.value !== 40"
                    [class.border-stone-200]="calcForm.get('downPercent')?.value !== 40"
                  >
                    40%
                  </button>
                </div>

                <input
                  id="calcDownPercent"
                  type="range"
                  formControlName="downPercent"
                  min="5"
                  max="60"
                  step="1"
                  class="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <!-- Term & Interest Rate Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <!-- Loan Term (30y vs 15y) -->
                <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span class="text-xs font-semibold text-stone-700 block">Amortization Period</span>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      (click)="setTerm(30)"
                      class="py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                      [class.bg-emerald-700]="calcForm.get('termYears')?.value === 30"
                      [class.text-white]="calcForm.get('termYears')?.value === 30"
                      [class.border-emerald-700]="calcForm.get('termYears')?.value === 30"
                      [class.bg-white]="calcForm.get('termYears')?.value !== 30"
                      [class.border-stone-200]="calcForm.get('termYears')?.value !== 30"
                    >
                      30-Year Fixed
                    </button>
                    <button
                      type="button"
                      (click)="setTerm(15)"
                      class="py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                      [class.bg-emerald-700]="calcForm.get('termYears')?.value === 15"
                      [class.text-white]="calcForm.get('termYears')?.value === 15"
                      [class.border-emerald-700]="calcForm.get('termYears')?.value === 15"
                      [class.bg-white]="calcForm.get('termYears')?.value !== 15"
                      [class.border-stone-200]="calcForm.get('termYears')?.value !== 15"
                    >
                      15-Year Fixed
                    </button>
                  </div>
                </div>

                <!-- Interest Rate Slider -->
                <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label for="calcInterestRate" class="text-xs font-semibold text-stone-700">Interest Rate (APR)</label>
                    <span class="text-xs font-bold font-mono text-emerald-900 tabular-nums">
                      {{ calcForm.get('interestRate')?.value }}%
                    </span>
                  </div>
                  <input
                    id="calcInterestRate"
                    type="range"
                    formControlName="interestRate"
                    min="4.0"
                    max="9.0"
                    step="0.1"
                    class="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div class="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>4.0%</span>
                    <span>6.5%</span>
                    <span>9.0%</span>
                  </div>
                </div>

              </div>

              <!-- Property Tax & HOA inputs -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <label for="calcPropertyTaxRate" class="text-[11px] font-semibold text-stone-600 block mb-1">Property Tax Rate</label>
                  <div class="flex items-center gap-1">
                    <input
                      id="calcPropertyTaxRate"
                      type="number"
                      step="0.05"
                      formControlName="propertyTaxRate"
                      class="w-full text-xs font-mono bg-white border border-stone-200 rounded p-1.5 text-stone-900"
                    />
                    <span class="text-xs text-stone-500 font-medium">%</span>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <label for="calcAnnualInsurance" class="text-[11px] font-semibold text-stone-600 block mb-1">Annual Hazard Ins.</label>
                  <div class="flex items-center gap-1">
                    <span class="text-xs text-stone-500 font-medium">$</span>
                    <input
                      id="calcAnnualInsurance"
                      type="number"
                      step="500"
                      formControlName="annualInsurance"
                      class="w-full text-xs font-mono bg-white border border-stone-200 rounded p-1.5 text-stone-900"
                    />
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <label for="calcMonthlyHoa" class="text-[11px] font-semibold text-stone-600 block mb-1">Monthly HOA Dues</label>
                  <div class="flex items-center gap-1">
                    <span class="text-xs text-stone-500 font-medium">$</span>
                    <input
                      id="calcMonthlyHoa"
                      type="number"
                      step="50"
                      formControlName="monthlyHoa"
                      class="w-full text-xs font-mono bg-white border border-stone-200 rounded p-1.5 text-stone-900"
                    />
                  </div>
                </div>
              </div>

            </form>

            <!-- Total Loan Cost Summary Table (Zero-Pill Tabular Format) -->
            <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h4 class="text-xs font-semibold text-stone-900 uppercase tracking-wider">Loan Horizon Summary</h4>
              <div class="grid grid-cols-3 gap-4 text-xs pt-1">
                <div>
                  <span class="text-stone-400 block text-[10px] uppercase font-semibold">Total Principal</span>
                  <span class="font-mono font-bold text-stone-900 tabular-nums">
                    {{ propertyService.formatCurrency(breakdown().loanAmount) }}
                  </span>
                </div>
                <div>
                  <span class="text-stone-400 block text-[10px] uppercase font-semibold">Total Interest Paid</span>
                  <span class="font-mono font-bold text-stone-900 tabular-nums">
                    {{ propertyService.formatCurrency(breakdown().totalInterestPaid) }}
                  </span>
                </div>
                <div>
                  <span class="text-stone-400 block text-[10px] uppercase font-semibold">Total Out-of-Pocket</span>
                  <span class="font-mono font-bold text-emerald-800 tabular-nums">
                    {{ propertyService.formatCurrency(breakdown().totalLoanCost) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Pre-Approval Action CTA -->
            <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p class="text-xs text-stone-500 text-center sm:text-left">
                Rates indicative of prime tier jumbo portfolios. Speak with our private wealth mortgage desk.
              </p>

              <button
                type="button"
                (click)="connectWithMortgageAdvisor()"
                class="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <mat-icon class="text-base">lock</mat-icon>
                <span>Request Jumbo Pre-Approval</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    }
  `
})
export class MortgageCalculatorModal {
  readonly propertyService = inject(PropertyService);
  readonly modalState = this.propertyService.mortgageModalState;

  readonly calcForm = new FormGroup({
    homePrice: new FormControl<number>(5450000),
    downPercent: new FormControl<number>(20),
    termYears: new FormControl<number>(30),
    interestRate: new FormControl<number>(6.5),
    propertyTaxRate: new FormControl<number>(1.15),
    annualInsurance: new FormControl<number>(11500),
    monthlyHoa: new FormControl<number>(420)
  });

  constructor() {
    this.calcForm.get('homePrice')?.setValue(this.modalState().homePrice);
  }

  readonly breakdown = computed<MortgageBreakdown>(() => {
    const hp = Number(this.calcForm.get('homePrice')?.value) || 5000000;
    const dpPercent = Number(this.calcForm.get('downPercent')?.value) || 20;
    const term = Number(this.calcForm.get('termYears')?.value) || 30;
    const rate = Number(this.calcForm.get('interestRate')?.value) || 6.5;
    const taxRate = Number(this.calcForm.get('propertyTaxRate')?.value) || 1.15;
    const ins = Number(this.calcForm.get('annualInsurance')?.value) || 8000;
    const hoa = Number(this.calcForm.get('monthlyHoa')?.value) || 300;

    const downAmount = Math.round(hp * (dpPercent / 100));

    return this.propertyService.calculateMortgage({
      homePrice: hp,
      downPaymentPercent: dpPercent,
      downPaymentAmount: downAmount,
      loanTermYears: term,
      interestRate: rate,
      propertyTaxRate: taxRate,
      annualInsurance: ins,
      monthlyHoa: hoa
    });
  });

  downPaymentDollar(): number {
    const hp = Number(this.calcForm.get('homePrice')?.value) || 0;
    const dp = Number(this.calcForm.get('downPercent')?.value) || 0;
    return Math.round(hp * (dp / 100));
  }

  piPercent(): number {
    const b = this.breakdown();
    if (!b.totalMonthlyPayment) return 70;
    return Math.round((b.monthlyPrincipalInterest / b.totalMonthlyPayment) * 100);
  }

  taxPercent(): number {
    const b = this.breakdown();
    if (!b.totalMonthlyPayment) return 20;
    return Math.round((b.monthlyPropertyTax / b.totalMonthlyPayment) * 100);
  }

  insPercent(): number {
    const b = this.breakdown();
    if (!b.totalMonthlyPayment) return 5;
    return Math.round((b.monthlyInsurance / b.totalMonthlyPayment) * 100);
  }

  hoaPercent(): number {
    const b = this.breakdown();
    if (!b.totalMonthlyPayment) return 5;
    return Math.round((b.monthlyHoa / b.totalMonthlyPayment) * 100);
  }

  setDownPercent(pct: number): void {
    this.calcForm.get('downPercent')?.setValue(pct);
  }

  setTerm(years: number): void {
    this.calcForm.get('termYears')?.setValue(years);
  }

  connectWithMortgageAdvisor(): void {
    this.close();
    const firstProp = this.propertyService.allProperties()[0];
    this.propertyService.openContactModal(firstProp.agent, firstProp);
  }

  close(): void {
    this.propertyService.closeMortgageModal();
  }
}
