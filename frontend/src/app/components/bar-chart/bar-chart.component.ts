import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([BarChart, GridComponent, CanvasRenderer, TooltipComponent, LegendComponent]);

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
    <div echarts [options]="options()" class="demo-chart"></div>
    <!-- <ngx-charts-bar-vertical -->
    <!--   [animations]="false" -->
    <!--   , -->
    <!--   [scheme]="colorScheme" -->
    <!--   [results]="this.data()" -->
    <!--   [gradient]="true" -->
    <!--   [xAxis]="true" -->
    <!--   [yAxis]="true" -->
    <!--   [legend]="true" -->
    <!--   [showXAxisLabel]="true" -->
    <!--   [showYAxisLabel]="true" -->
    <!--   [xAxisLabel]="'Test'" -->
    <!--   [yAxisLabel]="'Test'" -->
    <!-- > -->
    <!-- </ngx-charts-bar-vertical> -->
  `,
})
export class BarChartComponent {
  readonly data = input<BarChartData[]>([]);
  // public colorScheme: Color = {
  //   name: 'barchart',
  //   selectable: true,
  //   group: ScaleType.Ordinal,
  //   domain: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  // };
  options = computed<EChartsCoreOption>(() => {
    const series = this.data().map((i) => {
      return i.value;
      // return {
      //   name: i.name,
      //   data: i.value,
      // };
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
