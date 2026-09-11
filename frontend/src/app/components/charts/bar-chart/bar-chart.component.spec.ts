import { inputBinding, Signal, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ChartsData } from '../chart-data.type';

describe('BarChart', () => {
  async function setup(data: Signal<ChartsData> = signal([])) {
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

  it('should map create series by dimensions', async () => {
    const data: ChartsData = {
      dimensions: ['test1', 'test2', 'test3'],
    };
    const { component } = await setup(signal(data));
    const options = component.options();
    expect(options.series).toHaveLength(2);
  });

  it('should default to one series when no dimensions provided', async () => {
    const data: ChartsData = {};
    const { component } = await setup(signal(data));
    const options = component.options();
    expect(options.series).toHaveLength(1);
  });
});
