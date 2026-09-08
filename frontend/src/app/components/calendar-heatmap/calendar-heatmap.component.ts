import type { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, HeatmapChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CalendarComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Component, computed, input } from '@angular/core';
import { DateRange } from '../date-range-selector/date-range-selector.component';
echarts.use([
  BarChart,
  GridComponent,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CalendarComponent,
  HeatmapChart,
]);

export interface CalendarHeatmapData {
  date: Date;
  value: number;
}

@Component({
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  selector: 'app-calendar-heatmap',
  template: ` <div echarts [options]="options()"></div> `,
  styles: `
    :host {
      width: 100%;
    }
    .calendar-heatmap {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
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
  readonly data = input<CalendarHeatmapData[]>([]);
  readonly dateRange = input.required<DateRange>();
  readonly aspectRatio = input<number>(2);

  options = computed<EChartsCoreOption>(() => {
    const dateRange = this.dateRange();

    let dateRangeEchart;

    if (!dateRange.from || !dateRange.to) {
      dateRangeEchart = new Date().getFullYear();
    } else {
      dateRangeEchart = [
        dateRange.from.toISOString().split('T')[0],
        dateRange.to.toISOString().split('T')[0],
      ];
    }

    console.log('DateRangeEchart: ', dateRangeEchart);

    const data = this.data().map((d) => {
      return [d.date.toISOString().split('T')[0], d.value];
    });

    const max = this.data().reduce((max, d) => Math.max(max, d.value), 0);

    return {
      tooltip: {
        formatter: function (params: any) {
          return `${params.value[0]}: ${params.value[1]}`;
        },
      },
      visualMap: {
        min: 0,
        max: max,
        splitNumber: 10,
        precision: 0,
        type: 'piecewise',
        orient: 'vertical',
        left: 'right',
      },
      calendar: {
        left: 30,
        right: 100,
        cellSize: ['auto', 'auto'],
        range: dateRangeEchart,
        itemStyle: {
          borderWidth: 0.5,
        },
        yearLabel: { show: false },
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: data,
      },
    };
  });
}
