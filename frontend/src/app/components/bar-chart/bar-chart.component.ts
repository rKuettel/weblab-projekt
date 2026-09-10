import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { ThemeService } from '../../services/theme.service';
echarts.use([BarChart, GridComponent, SVGRenderer, TooltipComponent, LegendComponent]);

export interface BarChartData {
  name: string;
  value: number;
}

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
  readonly data = input<BarChartData[]>([]);

  options = computed<EChartsCoreOption>(() => {
    const series = this.data().map((i) => {
      return i.value;
    });

    const xAxisDate = this.data().map((i) => {
      return i.name;
    });

    return {
      legend: {
        data: ['bar'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisDate,
      },
      yAxis: {},
      series: [
        {
          name: 'bar',
          type: 'bar',
          data: series,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  });
}
