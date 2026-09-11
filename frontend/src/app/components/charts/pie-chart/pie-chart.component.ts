import { Component, computed, inject, input } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
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
  PieChart,
  DatasetComponent,
  GridComponent,
  SVGRenderer,
  TooltipComponent,
  LegendComponent,
]);

@Component({
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  selector: 'app-pie-chart',
  styles: `
    :host {
      flex: 1;
      display: flex;
      align-items: stretch;
      flex-direction: column;
    }
    .demo-class {
      flex: 1;
      height: 100%;
      width: 100%;
    }
  `,
  template: `
    <div
      echarts
      [options]="options()"
      [theme]="themeService.echartsTheme()"
      class="demo-chart"
    ></div>
  `,
})
export class PieChartComponent {
  readonly themeService = inject(ThemeService);
  readonly data = input<ChartsData>({});

  options = computed<EChartsOption>(() => {
    const dataset = this.data();
    return {
      dataset,
      legend: {
        align: 'left',
      },
      series: {
        type: 'pie',
        radius: '60%',
        center: ['50%', '40%'],
      },
      tooltip: {},
    };
  });
}
