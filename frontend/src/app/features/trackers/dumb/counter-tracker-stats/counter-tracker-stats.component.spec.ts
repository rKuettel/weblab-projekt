import { TestBed } from '@angular/core/testing';
import { CounterTrackerStatsComponent } from './counter-tracker-stats.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { Tracker } from '../../tracker.types';
import { makeCounterTracker, makeEvent } from '../../../../../../test/test-utils';
import { TrackerEvent } from '../../events.types';
import { inputBinding, signal } from '@angular/core';
import { DateRange } from '../../../../components/date-range-selector/date-range-selector.component';

const DEFAULT_RANGE: DateRange = {
  from: new Date('2024-01-01'),
  to: new Date('2024-01-31'),
};

describe('CounterTrackerStatsComponent', () => {
  async function setup(
    events: TrackerEvent[] = [],
    dateRange: DateRange = DEFAULT_RANGE,
    tracker: Tracker = makeCounterTracker({
      id: '42',
      name: 'Steps',
      summary: { sum: 30 },
    }),
  ) {
    await TestBed.configureTestingModule({
      imports: [CounterTrackerStatsComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {});

    const fixture = TestBed.createComponent(CounterTrackerStatsComponent, {
      bindings: [
        inputBinding('dateRange', signal(dateRange)),
        inputBinding('tracker', signal(tracker)),
        inputBinding('trackerEvents', signal(events)),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      root: fixture.nativeElement as Element,
    };
  }

  it('should group events per day for the heatmap', async () => {
    const { component } = await setup([
      makeEvent({ id: 'e1', timestamp: new Date('2024-06-10T10:00:00Z'), data: { delta: 10 } }),
      makeEvent({ id: 'e2', timestamp: new Date('2024-06-11T15:30:00Z'), data: { delta: 20 } }),
      makeEvent({ id: 'e3', timestamp: new Date('2024-06-11T18:00:00Z'), data: { delta: 5 } }),
    ]);

    expect(component.heatMapData()).toEqual([
      { date: new Date('2024-06-10'), value: 10 },
      { date: new Date('2024-06-11'), value: 25 },
    ]);
  });

  //TODO: rework
  // it('should map events to bar chart data', async () => {
  //   const { component } = await setup([
  //     makeEvent({ id: 'e1', timestamp: new Date('2024-06-10T10:00:00Z'), data: { delta: 10 } }),
  //     makeEvent({ id: 'e2', timestamp: new Date('2024-06-11T15:30:00Z'), data: { delta: 20 } }),
  //     makeEvent({ id: 'e3', timestamp: new Date('2024-06-11T18:00:00Z'), data: { delta: 5 } }),
  //   ]);
  //
  //   const barData = component.barChartData();
  //   expect(barData.source.map((d) => d.value)).toEqual([20, 10]);
  // });
});
