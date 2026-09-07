import { Component, computed, input, Input, OnChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HeatMapModule } from '@swimlane/ngx-charts';
import { DateRange } from '../date-range-selector/date-range-selector.component';

export interface CalendarHeatmapData {
  date: Date;
  value: number;
}

@Component({
  imports: [HeatMapModule],
  selector: 'app-calendar-heatmap',
  template: `
    <div class="calendar-heatmap">
      <ngx-charts-heat-map
        [scheme]="colorScheme"
        [results]="calendarData()"
        [xAxis]="true"
        [yAxis]="true"
        xAxisLabel="Week"
        yAxisLabel="Day of Week"
        (select)="onSelect($event)"
      >
      </ngx-charts-heat-map>

      <div class="legend">
        <span>Less</span>

        @for (color of this.colorScheme.domain; track $index) {
          <span class="legend-square" [style.background]="color"> </span>
        }

        <span>More</span>
      </div>
    </div>
  `,
  styles: `
    .calendar-heatmap {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;

      h3 {
        margin: 0 0 12px;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .legend {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 8px;

      font-size: 12px;
      color: #666;
    }

    .legend-square {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
  `,
})
export class CalendarHeatmapComponent {
  private weekdayName = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  readonly data = input<CalendarHeatmapData[]>([]);
  readonly dateRange = input.required<DateRange>();

  public calendarData = computed(() => {
    const dateRange = this.dateRange();
    const days = this.getDatesBetween(dateRange.from, dateRange.to);
    const initData = days.map((d) => {
      return {
        name: this.getXAxisLabel(d),
        series: [
          {
            name: this.getYAxisLabel(d),
            value: 0,
          },
        ],
      };
    });

    const data = this.data().map((item) => {
      return {
        name: this.getXAxisLabel(item.date),
        series: [
          {
            name: this.getYAxisLabel(item.date),
            value: item.value,
          },
        ],
      };
    });
    return [...initData, ...data];
  });
  public view: [number, number] = [900, 180];
  public colorScheme: Color = {
    name: 'heatmap',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  };

  private getDatesBetween(startDate?: Date, endDate?: Date): Date[] {
    if (!startDate || !endDate) {
      return [];
    }
    const dates: Date[] = [];

    let current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const finalDate = new Date(endDate);
    finalDate.setHours(0, 0, 0, 0);

    while (current <= finalDate) {
      // We push a NEW Date object because 'current' is being mutated
      dates.push(new Date(current));

      // Increment by one day
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private getWeekOfYear(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  private getXAxisLabel(date: Date): string {
    return `${this.getWeekOfYear(date)} - ${date.getFullYear()}`;
  }

  private getYAxisLabel(date: Date): string {
    const dayOfTheWeek = this.weekdayName.format(date);
    return dayOfTheWeek;
  }

  onSelect(event: any): void {
    console.log('Selected day:', event);
  }
}
