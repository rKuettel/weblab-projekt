import { Component, computed, input } from '@angular/core';
import { Tracker } from '../../../tracker.types';
import { CategoryTrackerEvent, CounterTrackerEvent, TrackerEvent } from '../../../events.types';
import { DateRange } from '../../../../../components/date-range-selector/date-range-selector.component';
import { CounterTrackerStatsComponent } from '../counter-tracker-stats/counter-tracker-stats.component';
import { CategoryTrackerStatsComponent } from '../category-tracker-stats/category-tracker-stats.component';

@Component({
  imports: [CounterTrackerStatsComponent, CategoryTrackerStatsComponent],
  selector: 'app-tracker-stats',
  styles: ``,
  template: `
    @let currentTracker = this.tracker();
    @switch (currentTracker.type) {
      @case ('counter') {
        <app-counter-tracker-stats
          [trackerEvents]="this.counterTrackerEvents()"
          [tracker]="currentTracker"
          [dateRange]="this.dateRange()"
        ></app-counter-tracker-stats>
      }
      @case ('category') {
        <app-category-tracker-stats
          [trackerEvents]="this.categoryTrackerEvents()"
          [trackerSummary]="currentTracker.summary"
          [dateRange]="this.dateRange()"
        ></app-category-tracker-stats>
      }
    }
  `,
})
export class TrackerStatsComponent {
  readonly tracker = input.required<Tracker>();
  readonly trackerEvents = input.required<TrackerEvent[]>();
  readonly dateRange = input.required<DateRange>();

  public counterTrackerEvents = computed(() => {
    return this.trackerEvents() as CounterTrackerEvent[];
  });
  public categoryTrackerEvents = computed(() => {
    return this.trackerEvents() as CategoryTrackerEvent[];
  });
}
