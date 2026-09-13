import { Component, computed, input } from '@angular/core';
import { CategoryTrackerEvent } from '../../../events.types';
import { BarChartComponent } from '../../../../../components/charts/bar-chart/bar-chart.component';
import { DateRange } from '../../../../../components/date-range-selector/date-range-selector.component';
import { PieChartComponent } from '../../../../../components/charts/pie-chart/pie-chart.component';
import { CategoryTrackerSummary } from '../../../tracker.types';
import { ChartsData } from '../../../../../components/charts/chart-data.type';
import { BigNumberComponent } from '../../../../../components/big-number/big-number.component';
import { TranslatePipe } from '@ngx-translate/core';
import { generateEventPerDay, groupBy, groupByDate, sumBy } from '../stats.util';

@Component({
  imports: [BarChartComponent, PieChartComponent, BigNumberComponent, TranslatePipe],
  selector: 'app-category-tracker-stats',
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
      <h3>{{ 'tracker.stats.category.pie' | translate }}</h3>
      <app-pie-chart [data]="pieChartData()"></app-pie-chart>
    </article>
    <article>
      <h3>{{ 'tracker.stats.category.total' | translate }}</h3>
      <app-big-number [number]="sum()"></app-big-number>
    </article>

    <article class="wide-card">
      <h3>{{ 'tracker.stats.category.barChart' | translate }}</h3>
      <app-bar-chart [data]="this.barChartData()"> ></app-bar-chart>
    </article>
  `,
})
export class CategoryTrackerStatsComponent {
  readonly dateRange = input.required<DateRange>();
  readonly trackerEvents = input.required<CategoryTrackerEvent[]>();
  readonly trackerSummary = input.required<CategoryTrackerSummary>();

  public pieInRange = computed(() => {
    return Object.entries(groupBy(this.trackerEvents(), (e) => e.data.category)).map(
      ([category, events]) => {
        return {
          category,
          amount: sumBy(events, (e) => e.data.amount),
        };
      },
    );
  });

  public sum = computed(() => {
    return sumBy(this.pieInRange(), (c) => c.amount);
  });
  public barChartData = computed<ChartsData>(() => {
    const allCategories = this.trackerSummary().map((s) => s.category);
    const events: CategoryTrackerEvent[] = [
      ...generateEventPerDay(this.dateRange(), {
        category: allCategories[0],
        amount: 0,
      }),
      ...this.trackerEvents(),
    ];
    const groupedByDate = Object.entries(groupByDate(events));
    groupedByDate.sort((a, b) => Date.parse(a[0]) - Date.parse(b[0]));

    const source = groupedByDate.map(([k, events]) => {
      const cateogries = Object.fromEntries(allCategories.map((c) => [c, []])) as Record<
        string,
        []
      >;
      const groups = groupBy(events, (e) => e.data.category, cateogries);
      return Object.fromEntries([
        ['date', k],
        ...Object.entries(groups).map(([c, e]) => [c, sumBy(e, (s) => s.data.amount)]),
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
      source: this.pieInRange(),
    };
  });
}
