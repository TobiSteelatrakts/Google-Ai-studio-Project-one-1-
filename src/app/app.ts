import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AdvisorsSection } from './components/advisors-section/advisors-section';
import { AgentContactModal } from './components/agent-contact-modal/agent-contact-modal';
import { FilterBar } from './components/filter-bar/filter-bar';
import { Footer } from './components/footer/footer';
import { Hero } from './components/hero/hero';
import { InteractiveMap } from './components/interactive-map/interactive-map';
import { LightboxModal } from './components/lightbox-modal/lightbox-modal';
import { MortgageCalculatorModal } from './components/mortgage-calculator-modal/mortgage-calculator-modal';
import { Navbar } from './components/navbar/navbar';
import { PropertyCard } from './components/property-card/property-card';
import { PropertyDetailsModal } from './components/property-details-modal/property-details-modal';
import { SavedDrawer } from './components/saved-drawer/saved-drawer';
import { ScheduleTourModal } from './components/schedule-tour-modal/schedule-tour-modal';
import { LazyImgDirective } from './directives/lazy-img.directive';
import { PropertyService } from './services/property.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    Navbar,
    Hero,
    FilterBar,
    PropertyCard,
    InteractiveMap,
    PropertyDetailsModal,
    LightboxModal,
    ScheduleTourModal,
    AgentContactModal,
    MortgageCalculatorModal,
    SavedDrawer,
    AdvisorsSection,
    Footer,
    LazyImgDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly propertyService = inject(PropertyService);

  openMortgageCalculator(): void {
    const prop = this.propertyService.filteredProperties()[0] || this.propertyService.allProperties()[0];
    this.propertyService.openMortgageModal(prop.financials.price, prop.title);
  }

  openScheduleTour(): void {
    const prop = this.propertyService.filteredProperties()[0] || this.propertyService.allProperties()[0];
    this.propertyService.openTourModal(prop);
  }

  toggleMobileView(): void {
    const current = this.propertyService.viewMode();
    this.propertyService.setViewMode(current === 'map' ? 'grid' : 'map');
  }

  resetAllFilters(): void {
    this.propertyService.resetFilters();
  }
}
