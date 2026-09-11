import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CalendarHeatmapComponent, CalendarHeatmapData } from './calendar-heatmap.component';
import { DateRange } from '../../date-range-selector/date-range-selector.component';
import { NgxEchartsDirective } from 'ngx-echarts';

describe('CalendarHeatmap', () => {
  async function setup(
    data: CalendarHeatmapData[] = [],
    dateRange: DateRange = {
      from: new Date('2024-01-01'),
      to: new Date('2024-01-31'),
    },
  ) {
    await TestBed.configureTestingModule({
      imports: [NgxEchartsDirective, CalendarHeatmapComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(CalendarHeatmapComponent, {
      bindings: [inputBinding('data', signal(data)), inputBinding('dateRange', signal(dateRange))],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
    };
  }

  it('should use the given date range for the calendar', async () => {
    const { component } = await setup([]);
    const options = component.options() as { calendar: { range: unknown } };

    expect(options.calendar.range).toEqual(['2024-01-01', '2024-01-31']);
  });

  it('should map the data to the heatmap series', async () => {
    const data: CalendarHeatmapData[] = [
      { date: new Date('2024-01-10'), value: 5 },
      { date: new Date('2024-01-11'), value: 8 },
    ];
    const { component } = await setup(data);
    const options = component.options() as {
      series: { data: unknown[] };
      visualMap: { min: number; max: number };
    };

    expect(options.series.data).toEqual([
      ['2024-01-10', 5],
      ['2024-01-11', 8],
    ]);
  });

  it('should calculate max based on data', async () => {
    const data: CalendarHeatmapData[] = [
      { date: new Date('2024-01-10'), value: 5 },
      { date: new Date('2024-01-11'), value: 8 },
    ];
    const { component } = await setup(data);
    const options = component.options() as {
      series: { data: unknown[] };
      visualMap: { min: number; max: number };
    };

    expect(options.visualMap.min).toBe(0);
    expect(options.visualMap.max).toBe(8);
  });

  it('should set the max to 0 without data', async () => {
    const { component } = await setup([]);
    const options = component.options() as { visualMap: { max: number } };

    expect(options.visualMap.max).toBe(0);
  });
});
