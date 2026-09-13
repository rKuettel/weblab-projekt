import { TestBed } from '@angular/core/testing';
import { CounterTrackerStatsComponent } from './counter-tracker-stats.component';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { makeEvent } from '../../../../../../../test/test-utils';
import { TrackerEvent } from '../../../events.types';
import { inputBinding, signal } from '@angular/core';
import { DateRange } from '../../../../../components/date-range-selector/date-range-selector.component';

const DEFAULT_RANGE: DateRange = {
  from: new Date(2026, 0, 1),
  to: new Date(2026, 0, 3),
};

function getDate(localDate: Date): string {
  return localDate.toISOString().split('T')[0];
}

function dayName(localDate: Date): string {
  return new Date(getDate(localDate)).toDateString();
}

describe('CounterTrackerStatsComponent', () => {
  async function setup(events: TrackerEvent[] = [], dateRange: DateRange = DEFAULT_RANGE) {
    await TestBed.configureTestingModule({
      imports: [CounterTrackerStatsComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {});

    const fixture = TestBed.createComponent(CounterTrackerStatsComponent, {
      bindings: [
        inputBinding('dateRange', signal(dateRange)),
        inputBinding('trackerEvents', signal(events)),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
    };
  }

  describe('heatMapData', () => {
    it('should group events per day for the heatmap', async () => {
      const { component } = await setup([
        makeEvent({ id: 'e1', timestamp: new Date('2026-06-10T10:00:00Z'), data: { delta: 10 } }),
        makeEvent({ id: 'e2', timestamp: new Date('2026-06-11T15:30:00Z'), data: { delta: 20 } }),
        makeEvent({ id: 'e3', timestamp: new Date('2026-06-11T18:00:00Z'), data: { delta: 5 } }),
      ]);

      expect(component.heatMapData()).toEqual([
        { date: new Date('2026-06-10'), value: 10 },
        { date: new Date('2026-06-11'), value: 25 },
      ]);
    });

    it('keeps negative deltas in the sum', async () => {
      const { component } = await setup([
        makeEvent({ id: 'e1', timestamp: new Date('2026-06-10T10:00:00Z'), data: { delta: 10 } }),
        makeEvent({ id: 'e2', timestamp: new Date('2026-06-10T12:00:00Z'), data: { delta: -4 } }),
      ]);

      expect(component.heatMapData()).toEqual([{ date: new Date('2026-06-10'), value: 6 }]);
    });

    it('returns an empty array when there are no events', async () => {
      const { component } = await setup();
      expect(component.heatMapData()).toEqual([]);
    });
  });

  describe('sumInRange', () => {
    it('sums the deltas of all events', async () => {
      const { component } = await setup([
        makeEvent({ id: 'e1', timestamp: new Date(2026, 0, 1), data: { delta: 5 } }),
        makeEvent({ id: 'e2', timestamp: new Date(2026, 0, 1), data: { delta: 2 } }),
        makeEvent({ id: 'e3', timestamp: new Date(2026, 0, 3), data: { delta: 8 } }),
      ]);
      expect(component.sumInRange()).toBe(15);
    });

    it('returns 0 when there are no events', async () => {
      const { component } = await setup();
      expect(component.sumInRange()).toBe(0);
    });
  });

  describe('dailyAvg', () => {
    it('divides the sum of all events by the number of days in the range (inclusive)', async () => {
      const { component } = await setup([
        makeEvent({ id: 'e1', timestamp: new Date(2026, 0, 1), data: { delta: 6 } }),
        makeEvent({ id: 'e2', timestamp: new Date(2026, 0, 3), data: { delta: 6 } }),
      ]);
      expect(component.dailyAvg()).toBe(4);
    });

    it('treats a single-day range as one day', async () => {
      const { component } = await setup(
        [makeEvent({ id: 'e1', timestamp: new Date(2026, 0, 1), data: { delta: 7 } })],
        { from: new Date(2026, 0, 1), to: new Date(2026, 0, 1) },
      );
      expect(component.dailyAvg()).toBe(7);
    });

    it('returns 0 when there are no events', async () => {
      const { component } = await setup();
      expect(component.dailyAvg()).toBe(0);
    });
  });

  describe('barChartData', () => {
    it('creates one zero entry per day of the date range when there are no events', async () => {
      const { component } = await setup();
      expect(component.barChartData()).toEqual({
        source: [
          { name: dayName(new Date(2026, 0, 1)), value: 0 },
          { name: dayName(new Date(2026, 0, 2)), value: 0 },
          { name: dayName(new Date(2026, 0, 3)), value: 0 },
        ],
      });
    });

    it('sums the deltas per day', async () => {
      const { component } = await setup([
        makeEvent({ id: 'e1', timestamp: new Date(2026, 0, 1), data: { delta: 5 } }),
        makeEvent({ id: 'e2', timestamp: new Date(2026, 0, 1), data: { delta: -2 } }),
        makeEvent({ id: 'e3', timestamp: new Date(2026, 0, 3), data: { delta: 8 } }),
      ]);
      expect(component.barChartData()).toEqual({
        source: [
          { name: dayName(new Date(2026, 0, 1)), value: 3 },
          { name: dayName(new Date(2026, 0, 2)), value: 0 },
          { name: dayName(new Date(2026, 0, 3)), value: 8 },
        ],
      });
    });

    it('keeps the entries sorted by date', async () => {
      const { component } = await setup([
        makeEvent({ id: 'e1', timestamp: new Date(2026, 0, 2), data: { delta: 1 } }),
        makeEvent({ id: 'e2', timestamp: new Date(2026, 0, 1), data: { delta: 2 } }),
      ]);
      expect(component.barChartData()).toEqual({
        source: [
          { name: dayName(new Date(2026, 0, 1)), value: 2 },
          { name: dayName(new Date(2026, 0, 2)), value: 1 },
          { name: dayName(new Date(2026, 0, 3)), value: 0 },
        ],
      });
    });
  });
});
