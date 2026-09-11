import { Component, computed, inject, input } from '@angular/core';
import { CategoryTrackerEvent } from '../../events.types';
import { BarChartComponent } from '../../../../components/charts/bar-chart/bar-chart.component';
import { DateRange } from '../../../../components/date-range-selector/date-range-selector.component';
import { PieChartComponent } from '../../../../components/charts/pie-chart/pie-chart.component';
import { StatsService } from '../../services/stats.service';
import { CategoryTrackerSummary } from '../../tracker.types';
import { ChartsData } from '../../../../components/charts/chart-data.type';

@Component({
  imports: [BarChartComponent, PieChartComponent],
  selector: 'app-category-tracker-stats',
  styles: `
    .heatmap {
      grid-column: span 2;
    }
    :host {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr 1fr;
      align-items: start;
      align-content: start;
    }
  `,
  template: `
    <article>
      <h3>Total</h3>
    </article>
    <article>
      <h3>Pie</h3>
      <app-pie-chart [data]="pieChartData()"></app-pie-chart>
    </article>

    <article class="heatmap">
      <h3>Bar Chart</h3>
      <app-bar-chart [data]="this.barChartData()"> ></app-bar-chart>
    </article>
  `,
})
export class CategoryTrackerStatsComponent {
  readonly statsService = inject(StatsService);
  readonly dateRange = input.required<DateRange>();
  readonly trackerEvents = input.required<CategoryTrackerEvent[]>();
  readonly trackerSummary = input.required<CategoryTrackerSummary>();

  public barChartData = computed<ChartsData>(() => {
    const allCategories = this.trackerSummary().map((s) => s.category);
    const groupedByDate = this.statsService.groupByDate(this.trackerEvents());

    const source = Object.entries(groupedByDate).map(([k, events]) => {
      const cateogries = Object.fromEntries(allCategories.map((c) => [c, []])) as Record<
        string,
        []
      >;
      const groups = this.statsService.groupBy(events, (e) => e.data.category, cateogries);
      return Object.fromEntries([
        ['date', k],
        ...Object.entries(groups).map(([c, e]) => [
          c,
          this.statsService.sumBy(e, (s) => s.data.amount),
        ]),
      ]);
    });

    const dimensions = ['date', ...allCategories];
    return {
      dimensions,
      source,
    };
  });

  public pieChartData = computed(() => {
    return {
      source: this.trackerSummary(),
    };
  });
}
