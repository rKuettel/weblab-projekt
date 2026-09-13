import { TestBed } from '@angular/core/testing';
import { CategoryTrackerStatsComponent } from './category-tracker-stats.component';
import { CategoryTrackerEvent } from '../../../events.types';
import { DateRange } from '../../../../../components/date-range-selector/date-range-selector.component';
import { CategoryTrackerSummary } from '../../../tracker.types';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { inputBinding, signal } from '@angular/core';

const DEFAULT_RANGE: DateRange = {
  from: new Date(2026, 0, 1),
  to: new Date(2026, 0, 3),
};

const DEFAULT_SUMMARY: CategoryTrackerSummary = [
  { category: 'Food', amount: 10 },
  { category: 'Transport', amount: 5 },
];

function getDate(localDate: Date): string {
  return localDate.toISOString().split('T')[0];
}

function makeCategoryEvent(
  timestamp: Date,
  category: string,
  amount: number,
): CategoryTrackerEvent {
  return { id: `e-${timestamp.getTime()}-${category}`, timestamp, data: { category, amount } };
}

describe('CategoryTrackerStatsComponent', () => {
  async function setup(
    events: CategoryTrackerEvent[] = [],
    dateRange: DateRange = DEFAULT_RANGE,
    trackerSummary: CategoryTrackerSummary = DEFAULT_SUMMARY,
  ) {
    await TestBed.configureTestingModule({
      imports: [CategoryTrackerStatsComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    TestBed.inject(TranslateService).setTranslation('en', {});

    const fixture = TestBed.createComponent(CategoryTrackerStatsComponent, {
      bindings: [
        inputBinding('dateRange', signal(dateRange)),
        inputBinding('trackerSummary', signal(trackerSummary)),
        inputBinding('trackerEvents', signal(events)),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
    };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  describe('pieChartData', () => {
    it('groups the events by category and sums the amounts', async () => {
      const { component } = await setup([
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 5),
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 2),
        makeCategoryEvent(new Date(2026, 0, 2), 'Transport', 2),
        makeCategoryEvent(new Date(2026, 0, 2), 'Food', 3),
      ]);
      expect(component.pieChartData()).toEqual({
        source: [
          { category: 'Food', amount: 10 },
          { category: 'Transport', amount: 2 },
        ],
      });
    });

    it('returns an empty source when there are no events', async () => {
      const { component } = await setup();
      expect(component.pieChartData()).toEqual({ source: [] });
    });
  });

  describe('sum', () => {
    it('sums the amounts of all events', async () => {
      const { component } = await setup([
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 5),
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 2),
        makeCategoryEvent(new Date(2026, 0, 2), 'Transport', 2),
        makeCategoryEvent(new Date(2026, 0, 2), 'Food', 3),
      ]);
      expect(component.sum()).toBe(12);
    });

    it('returns 0 when there are no events', async () => {
      const { component } = await setup();
      expect(component.sum()).toBe(0);
    });
  });

  describe('barChartData', () => {
    it('uses the date and all summary categories as dimensions', async () => {
      const { component } = await setup();
      expect(component.barChartData().dimensions).toEqual(['date', 'Food', 'Transport']);
    });

    it('creates one zero-filled row per day of the date range when there are no events', async () => {
      const { component } = await setup();
      expect(component.barChartData().source).toEqual([
        { date: getDate(new Date(2026, 0, 1)), Food: 0, Transport: 0 },
        { date: getDate(new Date(2026, 0, 2)), Food: 0, Transport: 0 },
        { date: getDate(new Date(2026, 0, 3)), Food: 0, Transport: 0 },
      ]);
    });

    it('sums the amounts per category and day', async () => {
      const { component } = await setup([
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 1),
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 2),
        makeCategoryEvent(new Date(2026, 0, 2), 'Transport', 4),
        makeCategoryEvent(new Date(2026, 0, 2), 'Food', 3),
      ]);
      expect(component.barChartData().source).toEqual([
        { date: getDate(new Date(2026, 0, 1)), Food: 3, Transport: 0 },
        { date: getDate(new Date(2026, 0, 2)), Food: 3, Transport: 4 },
        { date: getDate(new Date(2026, 0, 3)), Food: 0, Transport: 0 },
      ]);
    });

    it('keeps the rows sorted by date', async () => {
      const { component } = await setup([
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 1),
        makeCategoryEvent(new Date(2026, 0, 1), 'Food', 2),
        makeCategoryEvent(new Date(2026, 0, 3), 'Food', 3),
        makeCategoryEvent(new Date(2026, 0, 2), 'Food', 4),
        makeCategoryEvent(new Date(2026, 0, 2), 'Food', 5),
      ]);
      expect(component.barChartData().source).toEqual([
        { date: getDate(new Date(2026, 0, 1)), Food: 3, Transport: 0 },
        { date: getDate(new Date(2026, 0, 2)), Food: 9, Transport: 0 },
        { date: getDate(new Date(2026, 0, 3)), Food: 3, Transport: 0 },
      ]);
    });
  });
});
