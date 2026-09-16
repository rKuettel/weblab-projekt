import { Component, computed, input } from '@angular/core';
import { CounterTrackerEvent } from '../../../events.types';
import { BarChartComponent } from '../../../../../components/charts/bar-chart/bar-chart.component';
import { CalendarHeatmapComponent } from '../../../../../components/charts/calendar-heatmap/calendar-heatmap.component';
import { BigNumberComponent } from '../../../../../components/big-number/big-number.component';
import { DateRange } from '../../../../../components/date-range-selector/date-range-selector.component';
import { TranslatePipe } from '@ngx-translate/core';
import { generateEventPerDay, groupByDate, sumBy } from '../stats.util';

const MS_PER_DAY = 86_400_000;
@Component({
  imports: [BarChartComponent, CalendarHeatmapComponent, BigNumberComponent, TranslatePipe],
  selector: 'app-counter-tracker-stats',
  styles: `
    :host {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr;
      align-content: stretch;
    }

    @media screen and (min-width: 768px) {
      :host {
        grid-template-columns: repeat(2, 1fr);
      }

      .wide-card {
        grid-column: span 2;
      }
    }
  `,
  template: `
    <article>
      <h3>{{ 'tracker.stats.counter.total' | translate }}</h3>
      <app-big-number testId="stats-total" [number]="sumInRange()"></app-big-number>
    </article>
    <article>
      <h3>{{ 'tracker.stats.counter.dailyAvg' | translate }}</h3>
      <app-big-number testId="stats-daily-average" [number]="this.dailyAvg()"></app-big-number>
    </article>
    <article class="wide-card">
      <h3>{{ 'tracker.stats.counter.heatmap' | translate }}</h3>
      @defer {
        <app-calendar-heatmap [data]="this.heatMapData()" [dateRange]="this.dateRange()">
          ></app-calendar-heatmap
        >
      }
    </article>

    <article class="wide-card">
      <h3>{{ 'tracker.stats.counter.barChart' | translate }}</h3>
      @defer {
        <app-bar-chart [data]="this.barChartData()"> ></app-bar-chart>
      }
    </article>
  `,
})
export class CounterTrackerStatsComponent {
  readonly dateRange = input.required<DateRange>();
  readonly trackerEvents = input.required<CounterTrackerEvent[]>();

  public heatMapData = computed(() => {
    return this.sumByDate(this.trackerEvents());
  });

  public sumInRange = computed(() => {
    return sumBy(this.trackerEvents(), (e) => e.data.delta);
  });

  public dailyAvg = computed(() => {
    const dates = this.dateRange();
    const from = dates.from;
    const to = dates.to;
    const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    const days = Math.round((toUtc - fromUtc) / MS_PER_DAY);

    // plus 1 since days are inclusive
    return this.sumInRange() / (days + 1);
  });

  public barChartData = computed(() => {
    const events: CounterTrackerEvent[] = [
      ...generateEventPerDay(this.dateRange(), {
        delta: 0,
      }),
      ...this.trackerEvents(),
    ];
    const summed = this.sumByDate(events);
    summed.sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      source: summed.map((e) => {
        return {
          name: new Date(e.date).toDateString(),
          value: e.value,
        };
      }),
    };
  });

  private sumByDate(events: CounterTrackerEvent[]) {
    const grouped = groupByDate(events);
    return Object.entries(grouped).map(([date, events]) => {
      return {
        date: new Date(date),
        value: sumBy(events, (e) => e.data.delta),
      };
    });
  }
}
