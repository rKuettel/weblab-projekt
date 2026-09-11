import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { ThemeService } from '../../../services/theme.service';
import { ChartsData } from '../chart-data.type';
import { EChartsOption, SeriesOption } from 'echarts';
echarts.use([
  BarChart,
  DatasetComponent,
  GridComponent,
  SVGRenderer,
  TooltipComponent,
  LegendComponent,
]);

@Component({
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  selector: 'app-bar-chart',
  styles: ``,
  template: `
    <div
      echarts
      [options]="options()"
      [theme]="themeService.echartsTheme()"
      class="demo-chart"
    ></div>
  `,
})
export class BarChartComponent {
  readonly themeService = inject(ThemeService);
  readonly data = input<ChartsData>({});

  options = computed<EChartsOption>(() => {
    const dataset = this.data();
    const series = Array.from({ length: (dataset.dimensions?.length ?? 2) - 1 }, () => {
      return { type: 'bar', stack: 'stack' } as SeriesOption;
    });
    return {
      dataset,
      legend: {
        align: 'left',
      },
      series,
      xAxis: { type: 'category' },
      yAxis: {},
      tooltip: {},
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  });
}
