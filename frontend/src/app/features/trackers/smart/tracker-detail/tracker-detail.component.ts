import { Component, computed, inject, Signal, signal } from '@angular/core';
import { TrackerApi } from '../../services/api/tracker.api';
import { EventApi } from '../../services/api/event.api';
import { ActivatedRoute } from '@angular/router';
import { EventListComponent } from '../../dumb/event-list/event-list.component';
import { TrackerSummaryComponent } from '../../dumb/tracker-summary/tracker-summary.component';
import {
  DateRange,
  DateRangeSelectorComponent,
  daysAgo,
} from '../../../../components/date-range-selector/date-range-selector.component';
import { CalendarHeatmapComponent } from '../../../../components/calendar-heatmap/calendar-heatmap.component';
import { BarChartComponent } from '../../../../components/bar-chart/bar-chart.component';

@Component({
  imports: [
    EventListComponent,
    DateRangeSelectorComponent,
    TrackerSummaryComponent,
    CalendarHeatmapComponent,
    BarChartComponent,
  ],
  selector: 'app-tracker-detail',
  styles: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .header h2 {
      margin-bottom: 0;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 3fr;
      gap: 1rem;
    }

    .events {
      min-width: 20rem;
    }

    .stats {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr 1fr;
      align-items: start;
      align-content: start;
    }

    .heatmap {
      grid-column: span 2;
    }

    /* @media screen and (min-width: 768px) { */
    /*   .content { */
    /*     grid-template-columns: repeat(2, 1fr); */
    /*   } */
    /* } */
    /* @media only screen and (min-width: 1024px) { */
    /*   .content { */
    /*     grid-template-columns: repeat(3, 1fr); */
    /*   } */
    /* } */
  `,
  template: `
    <div class="header">
      <h2>Trackers</h2>
      <app-date-range-selector
        (changed)="dateRangeChanged.set($event)"
        [dateRange]="this.dateRange()"
      >
      </app-date-range-selector>
    </div>
    <div class="content">
      @if (this.trackerEvents.hasValue()) {
        <article class="events" [aria-busy]="this.trackerEvents.isLoading()">
          <h3>Events</h3>

          <app-event-list [events]="trackerEvents.value()"></app-event-list>
        </article>
      }

      <div class="stats">
        <article [aria-busy]="this.tracker.isLoading()">
          <h3>Total</h3>
          @if (this.trackerEvents.hasValue()) {
            <app-tracker-summary
              [summary]="this.trackerEvents.value().reduce((acc, e) => (acc += e.data.delta), 0)"
            ></app-tracker-summary>
          }
        </article>
        <article [aria-busy]="this.tracker.isLoading()">
          <h3>Avg Per Day</h3>
          @if (this.trackerEvents.hasValue()) {
            <app-tracker-summary
              [summary]="this.trackerEvents.value().reduce((acc, e) => (acc += e.data.delta), 0)"
            ></app-tracker-summary>
          }
        </article>
        <article class="heatmap" [aria-busy]="this.trackerEvents.isLoading()">
          @if (this.heatMapData()) {
            <h3>Heatmap</h3>
            <app-calendar-heatmap [data]="this.heatMapData()" [dateRange]="this.dateRangeChanged()">
              ></app-calendar-heatmap
            >
          }
        </article>

        <article class="heatmap" [aria-busy]="this.trackerEvents.isLoading()">
          @if (this.heatMapData()) {
            <h3>Bar Chart</h3>
            <app-bar-chart [data]="this.barChartData()"> ></app-bar-chart>
          }
        </article>
      </div>
    </div>
  `,
})
export class TrackerDetailComponent {
  private activatedRoute = inject(ActivatedRoute);
  readonly trackerId = signal(this.activatedRoute.snapshot.params['id']);

  public dateRange = signal<DateRange>({
    from: daysAgo(7),
    to: new Date(),
  });

  public dateRangeChanged = signal<DateRange>({
    ...this.dateRange(),
  });

  private dateRangeTransformed = computed(() => {
    const date = this.dateRangeChanged();
    const to = date.to;
    const from = date.from;
    if (to) {
      to.setHours(23, 59, 59);
    }
    if (from) {
      from.setHours(0, 0, 0);
    }
    return {
      from: from,
      to: to,
    };
  });

  private api = inject(TrackerApi);
  private eventApi = inject(EventApi);
  public tracker = this.api.getTracker(this.trackerId);
  public trackerEvents = this.eventApi.getTrackerEvents(this.trackerId, this.dateRangeTransformed);

  public heatMapData = computed(() => {
    const events = this.trackerEvents.value();
    const grouped = events?.reduce(
      (acc, event) => {
        const date = event.timestamp.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = event.data.delta;
        } else {
          acc[date] += event.data.delta;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    if (!grouped) {
      return [];
    }
    return Object.entries(grouped).map(([date, sum]) => {
      return {
        date: new Date(date),
        value: sum,
      };
    });
  });

  public barChartData = computed(() => {
    // Copy before reversing so the resource's array is not mutated.
    const events = [...this.trackerEvents.value()].reverse();
    return events.map((e) => {
      return {
        value: e.data.delta,
        name: e.timestamp.toDateString(),
      };
    });
  });

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.trackerId.set(params['id']);
    });
  }
}
