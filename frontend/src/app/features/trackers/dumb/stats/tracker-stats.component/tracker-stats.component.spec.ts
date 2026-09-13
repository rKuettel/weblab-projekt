import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerStatsComponent } from './tracker-stats.component';
import { Tracker } from '../../../tracker.types';
import { TrackerEvent } from '../../../events.types';
import {
  makeCategoryTracker,
  makeCounterTracker,
  makeEvent,
} from '../../../../../../../test/test-utils';
import { By } from '@angular/platform-browser';
import { CounterTrackerStatsComponent } from '../counter-tracker-stats/counter-tracker-stats.component';
import { CategoryTrackerStatsComponent } from '../category-tracker-stats/category-tracker-stats.component';
import { inputBinding, signal } from '@angular/core';

const events: TrackerEvent[] = [
  makeEvent({ id: 'e1', timestamp: new Date('2024-06-10T10:00:00Z'), data: { delta: 10 } }),
  makeEvent({ id: 'e2', timestamp: new Date('2024-06-11T15:30:00Z'), data: { delta: 20 } }),
];

describe('TrackerStatsComponent', () => {
  async function setup(
    tracker: Tracker = makeCounterTracker({ id: '42', name: 'Steps', summary: { sum: 30 } }),
    trackerEvents: TrackerEvent[] = events,
  ) {
    await TestBed.configureTestingModule({
      imports: [TrackerStatsComponent],
      providers: [],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrackerStatsComponent, {
      bindings: [
        inputBinding('tracker', signal(tracker)),
        inputBinding('trackerEvents', signal(trackerEvents)),
        inputBinding(
          'dateRange',
          signal({
            from: new Date(),
            to: new Date(),
          }),
        ),
      ],
    });
    fixture.detectChanges();

    return {
      fixture,
      component: fixture.componentInstance,
      root: fixture.nativeElement as Element,
    };
  }

  it('should only render counter stats when counter tracker', async () => {
    const { fixture } = await setup(makeCounterTracker({ summary: { sum: 10 } }));

    const counterTracker = fixture.debugElement.query(By.directive(CounterTrackerStatsComponent));
    const categoryTracker = fixture.debugElement.query(By.directive(CategoryTrackerStatsComponent));

    expect(counterTracker).toBeDefined();
    expect(categoryTracker).toBeNull();
  });

  it('should only render category stats when category tracker', async () => {
    const { fixture } = await setup(
      makeCategoryTracker({ summary: [{ category: 'test', amount: 10 }] }),
    );

    const counterTracker = fixture.debugElement.query(By.directive(CounterTrackerStatsComponent));
    const categoryTracker = fixture.debugElement.query(By.directive(CategoryTrackerStatsComponent));

    expect(counterTracker).toBeNull();
    expect(categoryTracker).toBeDefined();
  });
});
