import { inputBinding, Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BarChartComponent, BarChartData } from './bar-chart.component';
import { NgxEchartsDirective } from 'ngx-echarts';

describe('BarChart', () => {
  async function setup(data: Signal<BarChartData[]> = signal([])) {
    await TestBed.configureTestingModule({
      imports: [NgxEchartsDirective, BarChartComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BarChartComponent, {
      bindings: [inputBinding('data', data)],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
    };
  }

  it('should map the data to the chart series and axis', async () => {
    const data: BarChartData[] = [
      { name: 'Mon', value: 5 },
      { name: 'Tue', value: 15 },
    ];
    const { component } = await setup(signal(data));
    const options = component.options() as {
      legend: { data: string[] };
      xAxis: { data: string[] };
      series: { name: string; type: string; data: number[] }[];
    };

    expect(options.series).toHaveLength(1);
    expect(options.series[0].data).toEqual([5, 15]);
    expect(options.xAxis.data).toEqual(['Mon', 'Tue']);
    expect(options.legend.data).toEqual(['bar']);
  });

  it('should update the options when the data changes', async () => {
    const data = signal<BarChartData[]>([{ name: 'Mon', value: 5 }]);
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BarChartComponent, {
      bindings: [inputBinding('data', data)],
    });
    fixture.detectChanges();
    const component = fixture.componentInstance;

    data.set([
      { name: 'Mon', value: 5 },
      { name: 'Tue', value: 7 },
    ]);
    fixture.detectChanges();

    const options = component.options() as {
      series: { data: number[] }[];
      xAxis: { data: string[] };
    };
    expect(options.series[0].data).toEqual([5, 7]);
    expect(options.xAxis.data).toEqual(['Mon', 'Tue']);
  });
});
