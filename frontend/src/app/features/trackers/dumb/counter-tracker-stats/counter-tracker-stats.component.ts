import { Component, computed, inject, input } from '@angular/core';
import { CounterTrackerEvent } from '../../events.types';
import { BarChartComponent } from '../../../../components/charts/bar-chart/bar-chart.component';
import { CalendarHeatmapComponent } from '../../../../components/charts/calendar-heatmap/calendar-heatmap.component';
import { BigNumberComponent } from '../../../../components/big-number/big-number.component';
import { DateRange } from '../../../../components/date-range-selector/date-range-selector.component';
import { StatsService } from '../../services/stats.service';
import { Tracker } from '../../tracker.types';

@Component({
  imports: [BarChartComponent, CalendarHeatmapComponent, BigNumberComponent],
  selector: 'app-counter-tracker-stats',
  styles: `
    :host {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr 1fr;
      align-items: start;
      align-content: start;
    }
    .heatmap {
      grid-column: span 2;
    }
  `,
  template: `
    <article>
      <h3>Total</h3>
      <app-big-number
        [number]="this.trackerEvents().reduce((acc, e) => (acc += e.data.delta), 0)"
      ></app-big-number>
    </article>
    <article>
      <h3>Avg Per Day</h3>
      <app-big-number
        [number]="this.trackerEvents().reduce((acc, e) => (acc += e.data.delta), 0)"
      ></app-big-number>
    </article>
    <article class="heatmap">
      @if (this.heatMapData()) {
        <h3>Heatmap</h3>
        <app-calendar-heatmap [data]="this.heatMapData()" [dateRange]="this.dateRange()">
          ></app-calendar-heatmap
        >
      }
    </article>

    <article class="heatmap">
      @if (this.heatMapData()) {
        <h3>Bar Chart</h3>
        <app-bar-chart [data]="this.barChartData()"> ></app-bar-chart>
      }
    </article>
  `,
})
export class CounterTrackerStatsComponent {
  private statsService = inject(StatsService);
  readonly dateRange = input.required<DateRange>();
  readonly tracker = input.required<Tracker<'counter'>>();
  readonly trackerEvents = input.required<CounterTrackerEvent[]>();

  public heatMapData = computed(() => {
    const events = this.trackerEvents();
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
    const events = [...this.trackerEvents()].reverse();
    return {
      source: events.map((e) => {
        return {
          name: e.timestamp.toDateString(),
          value: e.data.delta,
        };
      }),
    };
  });

  private datesInbetween(range: Required<DateRange>): Date[] {
    const dates: Date[] = [];
    const start = range.from;
    const end = range.to;

    // Normalize to midnight to ignore time components
    const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    // Guard against inverted ranges
    if (current > endMidnight) return dates;

    while (current <= endMidnight) {
      dates.push(new Date(current)); // push a copy, not a reference
      current.setDate(current.getDate() + 1); // safely handles month/year rollovers
    }

    return dates;
  }
}
